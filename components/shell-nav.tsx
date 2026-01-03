"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { CalendarClock } from "lucide-react";
import { BRAND, SHELLS } from "@/lib/constants";
import type { ShellKey } from "@/types";

interface ShellNavProps {
  active: ShellKey;
  onSelect: (key: ShellKey) => void;
}

export function ShellNav({ active, onSelect }: ShellNavProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-xl shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.teal})`,
            }}
          />
          <div>
            <div className="text-sm font-semibold" style={{ color: BRAND.navy }}>
              Planner's Assistant
            </div>
            <div className="text-xs" style={{ color: BRAND.text }}>
              Helping to build a better future
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="px-2">
        {SHELLS.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === active;
          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                isActive ? "bg-white shadow-sm" : "hover:bg-white/70"
              }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <Icon className={`h-4 w-4 ${isActive ? "text-slate-800" : "text-slate-500"}`} />
                <span className={`${isActive ? "font-semibold" : "font-medium"} text-slate-800 truncate`}>
                  {item.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-3">
          <div className="flex items-start gap-3">
            <CalendarClock className="mt-0.5 h-4 w-4 text-slate-600" />
            <div>
              <div className="text-xs font-semibold text-slate-700">Next key date</div>
              <div className="text-xs text-slate-600">Briefing · 5 days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
