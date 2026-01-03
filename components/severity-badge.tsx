"use client";

import React from "react";
import { AlertTriangle, CircleDot, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Severity } from "@/types";

interface SeverityBadgeProps {
  level: Severity;
}

export function SeverityBadge({ level }: SeverityBadgeProps) {
  const map = {
    High: { icon: AlertTriangle, label: "High", cls: "border-red-300 text-red-700" },
    Medium: { icon: CircleDot, label: "Medium", cls: "border-amber-300 text-amber-700" },
    Low: { icon: Circle, label: "Low", cls: "border-slate-300 text-slate-600" },
  }[level];

  const Icon = map.icon;

  return (
    <Badge variant="outline" className={`gap-1 ${map.cls}`}>
      <Icon className="h-3.5 w-3.5" />
      {map.label}
    </Badge>
  );
}
