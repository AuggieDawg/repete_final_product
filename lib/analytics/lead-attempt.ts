export type LeadAttemptStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const KEY_PREFIX = "repete:lead-attempt";

function getLeadAttemptKey(intent: string) {
  return `${KEY_PREFIX}:${intent}`;
}

export function markLeadAttempt(
  storage: LeadAttemptStorage,
  intent: string,
  attemptId: string
) {
  storage.setItem(getLeadAttemptKey(intent), attemptId);
}

export function consumeLeadAttempt(
  storage: LeadAttemptStorage,
  intent: string
): string | undefined {
  const key = getLeadAttemptKey(intent);
  const attemptId = storage.getItem(key) || undefined;

  if (attemptId) {
    storage.removeItem(key);
  }

  return attemptId;
}
