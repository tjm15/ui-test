"use client";

import React from "react";
import { BRAND } from "@/lib/constants";

interface ShellHeaderProps {
  title: string;
  subtitle?: string;
}

export function ShellHeader({ title, subtitle }: ShellHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: BRAND.navy }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm" style={{ color: BRAND.text }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
