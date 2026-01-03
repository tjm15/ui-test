"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { BRAND } from "@/lib/constants";
import type { ReadingProfile } from "@/types";

interface ReadingControlProps {
  profile: ReadingProfile;
  setProfile: (id: string) => void;
  options: ReadingProfile[];
}

export function ReadingControl({ profile, setProfile, options }: ReadingControlProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-sm hover:bg-slate-50"
          aria-label="Open reading details"
          title="Reading"
        >
          <span className="inline-flex h-2 w-2 rounded-full" style={{ background: BRAND.teal }} />
          <span className="max-w-[140px] sm:max-w-[220px] truncate font-medium">{profile.label}</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-500 transition group-hover:text-slate-700" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold" style={{ color: BRAND.navy }}>
                Working reading
              </div>
              <div className="text-xs text-slate-600">{profile.label}</div>
            </div>
            <Badge variant="outline" className="text-slate-600">
              Derived
            </Badge>
          </div>
          <p className="mt-2 text-xs text-slate-600">{profile.summary}</p>

          <div className="mt-3">
            <div className="text-xs font-semibold text-slate-700">Switch reading</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {options.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setProfile(o.id)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    o.id === profile.id
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Separator />
        <div className="p-4">
          <div className="text-xs font-semibold text-slate-700">Working emphasis</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {profile.emphasis.map((row) => (
              <div key={row.k} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                <div className="text-[11px] font-medium text-slate-700">{row.k}</div>
                <div className="text-[11px] text-slate-600">{row.v}</div>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div className="p-4">
          <div className="text-xs font-semibold text-slate-700">Interpretation cues</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.cues.map((h) => (
              <span
                key={h.phrase}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700"
                title={h.meaning}
              >
                <span className="font-medium">{h.phrase}</span>
                <span className="text-slate-500">→</span>
                <span className="text-slate-600">{h.meaning}</span>
              </span>
            ))}
          </div>
        </div>
        <Separator />
        <div className="p-4">
          <div className="text-xs font-semibold text-slate-700">Source basis (optional)</div>
          <ul className="mt-2 space-y-1 text-[11px] text-slate-600">
            {profile.sources.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
