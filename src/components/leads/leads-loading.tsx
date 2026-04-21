"use client";

import { useEffect, useState } from "react";
import { Target, Building2, TrendingUp, Sparkles } from "lucide-react";

const STATUS_MESSAGES = [
  { icon: Target, text: "Matching your ICP profile" },
  { icon: Building2, text: "Scanning prospect database" },
  { icon: TrendingUp, text: "Calculating fit scores" },
  { icon: Sparkles, text: "Surfacing top leads" },
];

export function LeadsLoading() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIdx((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const current = STATUS_MESSAGES[msgIdx];
  const Icon = current.icon;

  return (
    <div className="relative flex flex-col items-center justify-center py-16 md:py-24">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[oklch(0.55_0.25_280)]/10 to-transparent blur-3xl" />
      </div>

      {/* Radar */}
      <div className="relative z-10 flex size-48 items-center justify-center md:size-56">
        {/* Outermost pulse ring */}
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[oklch(0.65_0.22_265)]/15" />
        {/* Middle ring */}
        <span
          className="absolute inline-flex size-3/4 animate-ping rounded-full bg-[oklch(0.65_0.22_265)]/20"
          style={{ animationDelay: "0.4s" }}
        />
        {/* Inner ring */}
        <span
          className="absolute inline-flex size-1/2 animate-ping rounded-full bg-[oklch(0.65_0.22_265)]/30"
          style={{ animationDelay: "0.8s" }}
        />

        {/* Concentric static circles */}
        <span className="absolute size-full rounded-full ring-1 ring-white/[0.06]" />
        <span className="absolute size-3/4 rounded-full ring-1 ring-white/[0.08]" />
        <span className="absolute size-1/2 rounded-full ring-1 ring-white/[0.10]" />

        {/* Sweeping line */}
        <span className="radar-sweep absolute size-full rounded-full" />

        {/* Center icon */}
        <div className="relative z-10 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.55_0.25_280)] to-[oklch(0.65_0.22_250)] shadow-[0_0_40px_oklch(0.65_0.22_265/0.5)]">
          <Icon
            key={msgIdx}
            className="size-7 text-white animate-fade-in-up"
          />
        </div>

        {/* Floating dot blips */}
        <Blip top="12%" left="20%" delay="0s" />
        <Blip top="30%" left="78%" delay="0.6s" />
        <Blip top="68%" left="14%" delay="1.2s" />
        <Blip top="78%" left="72%" delay="1.8s" />
        <Blip top="42%" left="92%" delay="2.4s" />
      </div>

      {/* Status text */}
      <div className="relative z-10 mt-10 text-center">
        <h3 className="gradient-text text-xl font-bold tracking-tight md:text-2xl">
          Loading leads for business
        </h3>
        <div className="mt-3 flex h-6 items-center justify-center">
          <p
            key={msgIdx}
            className="animate-fade-in-up text-sm text-muted-foreground"
          >
            {current.text}
            <LoadingDots />
          </p>
        </div>
      </div>

      {/* Progress strip */}
      <div className="relative z-10 mt-6 h-1 w-56 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="loader-bar h-full rounded-full bg-gradient-to-r from-[oklch(0.55_0.25_280)] via-[oklch(0.65_0.22_265)] to-[oklch(0.7_0.18_240)]" />
      </div>

      {/* Step pips */}
      <div className="relative z-10 mt-5 flex gap-2">
        {STATUS_MESSAGES.map((_, i) => (
          <span
            key={i}
            className={`size-1.5 rounded-full transition-all duration-300 ${
              i === msgIdx
                ? "w-6 bg-[oklch(0.7_0.2_265)]"
                : i < msgIdx
                ? "bg-[oklch(0.65_0.22_265)]/50"
                : "bg-white/[0.08]"
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        .radar-sweep {
          background: conic-gradient(
            from 0deg,
            transparent 0%,
            oklch(0.65 0.22 265 / 0.35) 8%,
            transparent 18%,
            transparent 100%
          );
          animation: radar-spin 3.6s linear infinite;
          mask-image: radial-gradient(circle, black 60%, transparent 100%);
          -webkit-mask-image: radial-gradient(circle, black 60%, transparent 100%);
        }

        @keyframes radar-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .loader-bar {
          width: 35%;
          animation: loader-slide 1.6s ease-in-out infinite;
        }

        @keyframes loader-slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(285%);
          }
        }
      `}</style>
    </div>
  );
}

function Blip({
  top,
  left,
  delay,
}: {
  top: string;
  left: string;
  delay: string;
}) {
  return (
    <span
      className="absolute size-1.5 rounded-full bg-[oklch(0.7_0.2_265)]"
      style={{
        top,
        left,
        animation: `blip 2.4s ease-in-out ${delay} infinite`,
      }}
    >
      <style jsx>{`
        @keyframes blip {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.8);
            box-shadow: 0 0 0 0 oklch(0.7 0.2 265 / 0);
          }
          15% {
            opacity: 1;
            transform: scale(1.2);
            box-shadow: 0 0 12px 2px oklch(0.7 0.2 265 / 0.7);
          }
          50% {
            opacity: 0.4;
            transform: scale(1);
            box-shadow: 0 0 0 0 oklch(0.7 0.2 265 / 0);
          }
        }
      `}</style>
    </span>
  );
}

function LoadingDots() {
  return (
    <span className="ml-0.5 inline-flex">
      <span className="loading-dot">.</span>
      <span className="loading-dot" style={{ animationDelay: "0.15s" }}>
        .
      </span>
      <span className="loading-dot" style={{ animationDelay: "0.3s" }}>
        .
      </span>
      <style jsx>{`
        .loading-dot {
          animation: dot-bounce 1.4s ease-in-out infinite;
          display: inline-block;
        }
        @keyframes dot-bounce {
          0%,
          80%,
          100% {
            opacity: 0.2;
          }
          40% {
            opacity: 1;
          }
        }
      `}</style>
    </span>
  );
}
