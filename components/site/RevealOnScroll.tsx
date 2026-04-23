"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export function RevealOnScroll({
  children,
  className = "",
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`revealOnScroll ${isVisible ? "revealOnScrollVisible" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
