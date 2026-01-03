"use client";

import React from "react";
import { STAGES, STAGE_STATUS_ICONS } from "@/lib/constants";
import { stageStatus } from "@/lib/utils";
import type { StageKey } from "@/types";

interface StageRibbonProps {
  active: StageKey;
  onSelect: (stage: StageKey) => void;
}

export function StageRibbon({ active, onSelect }: StageRibbonProps) {
  const activeIndex = STAGES.findIndex((s) => s.key === active);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STAGES.map((s, idx) => {
          const st = stageStatus(idx, activeIndex);
          const Icon = STAGE_STATUS_ICONS[st as keyof typeof STAGE_STATUS_ICONS];
          return (
            <button
              key={s.key}
              onClick={() => onSelect(s.key)}
              className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs shrink-0 ${
                st === "active"
                  ? "border-[#f5c315] bg-[#f5c315]/15 text-[#2a3a60]"
                  : st === "done"
                  ? "border-slate-200 bg-white text-slate-700"
                  : "border-slate-200 bg-white/70 text-slate-500"
              }`}
              title={`Go to ${s.label}`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap font-medium">{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
