import React from "react";
import { cn } from "@/lib/utils";

interface FullLoadingProps {
  label?: string; // custom text like "Creating product..."
  className?: string;
}

export default function FullLoading({ label, className }: FullLoadingProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-3 bg-white/20 backdrop-blur-sm",
        className,
      )}
    >
      {/* <div className="border-t-primary h-10 w-10 animate-spin rounded-full border-4 border-[#99999940]" /> */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        className="size-16"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        >
          <path
            strokeDasharray="2 4"
            strokeDashoffset={6}
            d="M12 21c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9"
          >
            <animate
              attributeName="stroke-dashoffset"
              dur="0.6s"
              repeatCount="indefinite"
              values="6;0"
            ></animate>
          </path>
          <path
            strokeDasharray={32}
            strokeDashoffset={32}
            d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9"
          >
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.1s"
              dur="0.4s"
              values="32;0"
            ></animate>
          </path>
          <path strokeDasharray={10} strokeDashoffset={10} d="M12 16v-7.5">
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.5s"
              dur="0.2s"
              values="10;0"
            ></animate>
          </path>
          <path
            strokeDasharray={6}
            strokeDashoffset={6}
            d="M12 8.5l3.5 3.5M12 8.5l-3.5 3.5"
          >
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.7s"
              dur="0.2s"
              values="6;0"
            ></animate>
          </path>
        </g>
      </svg>
      <p className="text-sm font-medium text-[#444444]">
        {label || "Loading..."}
      </p>
    </div>
  );
}
