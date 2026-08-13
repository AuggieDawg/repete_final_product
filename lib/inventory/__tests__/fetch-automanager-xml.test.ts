import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AutoManagerHttpError,
  FeedTimeoutError,
  fetchAutoManagerXml,
  isRetryableAutoManagerError
} from "../get-inventory";

const FEED_URL = "https://feed.example.test/inventory.xml";

function asFetch(mock: ReturnType<typeof vi.fn>): typeof fetch {
  return mock as unknown as typeof fetch;
}

describe("isRetryableAutoManagerError", () => {
  it.each([408, 429, 500, 502, 503, 599])("retries transient HTTP %i responses", (status) => {
    expect(isRetryableAutoManagerError(new AutoManagerHttpError(status, "temporary"))).toBe(
      true
    );
  });

  it.each([400, 401, 403, 404, 422, 600])("does not retry permanent HTTP %i responses", (status) => {
    expect(isRetryableAutoManagerError(new AutoManagerHttpError(status, "permanent"))).toBe(
      false
    );
  });

  it("retries timeouts and fetch transport errors, but not arbitrary errors", () => {
    expect(isRetryableAutoManagerError(new FeedTimeoutError(100))).toBe(true);
    expect(isRetryableAutoManagerError(new TypeError("fetch failed"))).toBe(true);
    expect(isRetryableAutoManagerError(new Error("invalid configuration"))).toBe(false);
  });
});

describe("fetchAutoManagerXml", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns a successful response without retrying and preserves Next cache options", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response("<Inventory />", {
        status: 200
      })
    );

    await expect(
      fetchAutoManagerXml(FEED_URL, 1800, {
        fetchImpl: asFetch(fetchMock),
        timeoutMs: 100,
        retryDelayMs: 25
      })
    ).resolves.toBe("<Inventory />");

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const requestInit = fetchMock.mock.calls[0]?.[1] as
      | (RequestInit & { next?: { revalidate?: number; tags?: string[] } })
      | undefined;

    expect(requestInit?.signal).toBeInstanceOf(AbortSignal);
    expect(requestInit?.next).toEqual({
      revalidate: 1800,
      tags: ["repete-inventory"]
    });

    await vi.runAllTimersAsync();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries one transient server response after the short fixed backoff", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("temporary", { status: 503, statusText: "Unavailable" }))
      .mockResolvedValueOnce(new Response("<Inventory />", { status: 200 }));

    const result = fetchAutoManagerXml(FEED_URL, 1800, {
      fetchImpl: asFetch(fetchMock),
      timeoutMs: 100,
      retryDelayMs: 25
    });

    await vi.advanceTimersByTimeAsync(24);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1);

    await expect(result).resolves.toBe("<Inventory />");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not retry permanent authentication or configuration responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response("denied", {
        status: 401,
        statusText: "Unauthorized"
      })
    );

    await expect(
      fetchAutoManagerXml(FEED_URL, 1800, {
        fetchImpl: asFetch(fetchMock),
        timeoutMs: 100,
        retryDelayMs: 25
      })
    ).rejects.toMatchObject({
      name: "AutoManagerHttpError",
      status: 401
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries one fetch-level network failure and then succeeds", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockResolvedValueOnce(new Response("<Inventory />", { status: 200 }));

    const result = fetchAutoManagerXml(FEED_URL, 1800, {
      fetchImpl: asFetch(fetchMock),
      timeoutMs: 100,
      retryDelayMs: 25
    });

    await vi.advanceTimersByTimeAsync(25);

    await expect(result).resolves.toBe("<Inventory />");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("uses the bounded local backoff instead of a long Retry-After value", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response("rate limited", {
          status: 429,
          headers: { "Retry-After": "3600" }
        })
      )
      .mockResolvedValueOnce(new Response("<Inventory />", { status: 200 }));

    const result = fetchAutoManagerXml(FEED_URL, 1800, {
      fetchImpl: asFetch(fetchMock),
      timeoutMs: 100,
      retryDelayMs: 25
    });

    await vi.advanceTimersByTimeAsync(24);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1);

    await expect(result).resolves.toBe("<Inventory />");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("aborts each stalled request and stops after two bounded attempts", async () => {
    const signals: AbortSignal[] = [];
    const fetchMock = vi.fn((_url: RequestInfo | URL, init?: RequestInit) => {
      const signal = init?.signal;

      if (!signal) throw new Error("expected an abort signal");

      signals.push(signal);

      return new Promise<Response>((_resolve, reject) => {
        signal.addEventListener(
          "abort",
          () => reject(signal.reason ?? new DOMException("Aborted", "AbortError")),
          { once: true }
        );
      });
    });

    const startedAt = Date.now();
    const result = fetchAutoManagerXml(FEED_URL, 1800, {
      fetchImpl: asFetch(fetchMock),
      timeoutMs: 100,
      retryDelayMs: 25
    });
    const rejection = expect(result).rejects.toThrow(
      "AutoManager XML request timed out after 100ms"
    );

    await vi.advanceTimersByTimeAsync(100);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(signals[0]?.aborted).toBe(true);

    await vi.advanceTimersByTimeAsync(25);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(100);
    await rejection;

    expect(signals).toHaveLength(2);
    expect(signals.every((signal) => signal.aborted)).toBe(true);
    expect(Date.now() - startedAt).toBe(225);
  });
});
