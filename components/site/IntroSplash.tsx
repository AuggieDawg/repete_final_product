"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Image from "next/image";
import { useEffect, useState } from "react";

const SPLASH_COOLDOWN_MS = 10 * 60 * 1000;
const SPLASH_STORAGE_KEY = "repete-auto-last-splash-at";

export function IntroSplash() {
  const [shouldRender, setShouldRender] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const now = Date.now();
    const lastShownRaw = window.localStorage.getItem(SPLASH_STORAGE_KEY);
    const lastShown = lastShownRaw ? Number(lastShownRaw) : 0;
    const withinCooldown =
      Number.isFinite(lastShown) && now - lastShown < SPLASH_COOLDOWN_MS;

    if (withinCooldown) {
      setShouldRender(false);
      return;
    }

    window.localStorage.setItem(SPLASH_STORAGE_KEY, String(now));
    setShouldRender(true);

    const exitTimer = window.setTimeout(() => setIsLeaving(true), 2600);
    const removeTimer = window.setTimeout(() => setShouldRender(false), 3400);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div className={`introSplash ${isLeaving ? "introSplashLeaving" : ""}`}>
      <div className="introGlow introGlowOne" />
      <div className="introGlow introGlowTwo" />

      <div className="introLogoWrap">
        <Image
          src="/repete-logo.png"
          alt="Repete Auto"
          width={620}
          height={150}
          priority
          className="introLogo"
        />
        <p>Premium vehicle presentation for Vernal, Utah.</p>
      </div>
    </div>
  );
}
