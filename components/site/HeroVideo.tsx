"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const LOADER_FALLBACK_MS = 8000;

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  const revealVideo = useCallback(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (video && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      revealVideo();
    }

    const fallbackTimer = window.setTimeout(revealVideo, LOADER_FALLBACK_MS);

    return () => window.clearTimeout(fallbackTimer);
  }, [revealVideo]);

  return (
    <>
      <div
        className={`heroVideoLoader ${isReady ? "heroVideoLoaderHidden" : ""}`}
        aria-hidden="true"
      >
        <div className="heroVideoLoaderInner">
          <Image
            className="heroVideoLoaderLogo"
            src="/repete-logo.png"
            alt=""
            width={637}
            height={178}
            priority
            unoptimized
          />
          <span className="heroVideoLoaderRule" />
        </div>
      </div>

      <video
        ref={videoRef}
        className="heroVideo"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={revealVideo}
        onCanPlay={revealVideo}
        onError={revealVideo}
        aria-hidden="true"
      >
        <source src="/videos/repete-hero.mp4" type="video/mp4" />
      </video>
    </>
  );
}
