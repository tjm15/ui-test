"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar,
  AlertCircle,
  FileText,
  Activity,
  Eye,
  Target,
  BookOpen,
  FileCheck,
  FileEdit,
  FileQuestion,
  MapPin,
  Map,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import type { ShellKey } from "@/types";

export type HomeSystemVM = {
  // Programme
  stage: { label: string; status: string };
  gates: { id: string; status: "passed" | "in_progress" | "pending" }[];
  nextDates: { label: string; date: string; type: string }[];
  blocking: number;
  drift: "on_track" | "minor_drift" | "material_drift";

  // Plan Content
  policies: {
    vision: "drafted" | "missing";
    spatial: "drafted" | "missing";
    policiesCount: number;
    policiesTotal: number;
    monitoring: "outline" | "drafted" | "missing";
  };
  churn: {
    changed7d: number;
    untouched: number;
    highChurnArea?: string;
  };

  // Scrutiny
  scrutinyPoints: { label: string; severity: "Fragile" | "Unclear" | "Exposed" | "Tightening" }[];
  whereItBites: string[];
  reading: { label: string; lastRevised: string };

  // Evidence
  evidence: {
    final: number;
    draft: number;
    missing: number;
  };
  criticalMissing: string[];
  recentlyUpdated?: string;

  // Places
  sites: {
    identified: number;
    assessed: number;
    allocated: number;
  };
  allocationRisk: number;
  mapGaps: number;

  // Scenarios
  scenarios: {
    active: number;
    stale: number;
  };
  envelopeChips: string[];
  breadth: "Narrowing" | "Stable" | "Widening";
};

interface ShellHomeProps {
  view: HomeSystemVM;
  onNavigate: (shell: ShellKey) => void;
}

type CardRole = "state" | "inventory" | "envelope";

function GateIcon({ status }: { status: "passed" | "in_progress" | "pending" }) {
  if (status === "passed") return <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />;
  if (status === "in_progress") return <Clock className="h-3.5 w-3.5 text-amber-600" />;
  return <Circle className="h-3.5 w-3.5 text-slate-300" />;
}

function BlockCard({
  title,
  role,
  statusChip,
  openLabel,
  onOpen,
  children,
}: {
  title: string;
  role: CardRole;
  statusChip?: React.ReactNode;
  openLabel: string;
  onOpen: () => void;
  children: React.ReactNode;
}) {
  // Role-specific styling
  const roleStyles = {
    state: {
      card: "border-slate-300 bg-gradient-to-br from-slate-50 to-white border-l-4 border-l-slate-400",
      title: "text-sm font-bold text-slate-900",
      content: "px-2.5 pb-2.5 pt-0 space-y-1.5",
    },
    inventory: {
      card: "border-slate-200 bg-white",
      title: "text-sm font-semibold text-slate-800",
      content: "px-2.5 pb-2.5 pt-0 space-y-1.5",
    },
    envelope: {
      card: "border-slate-200 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20",
      title: "text-sm font-semibold text-slate-900",
      content: "px-2.5 pb-2.5 pt-0 space-y-1.5",
    },
  };

  const styles = roleStyles[role];

  return (
    <Card className={`${styles.card} flex flex-col`}>
      <CardHeader className="pb-1.5 px-2.5 pt-2.5">
        <div className="flex items-center justify-between">
          <h3 className={styles.title}>{title}</h3>
          {statusChip ? (
            statusChip
          ) : (
            <button
              onClick={onOpen}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline"
            >
              {openLabel}
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className={`flex-1 ${styles.content}`}>
        {children}
        {statusChip && (
          <div className="pt-0.5">
            <button
              onClick={onOpen}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline"
            >
              {openLabel}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ShellHome({ view, onNavigate }: ShellHomeProps) {
  const driftLabel = { on_track: "On track", minor_drift: "Minor drift", material_drift: "Material drift" };
  const driftColor = { on_track: "text-green-700", minor_drift: "text-amber-700", material_drift: "text-red-700" };

  return (
    <div className="space-y-3">
      {/* Desktop: 2×3 grid, Mobile: 1 column stack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* ROW 1 */}
        {/* Programme Block — STATE CARD */}
        <BlockCard
          title="Programme"
          role="state"
          statusChip={<Badge variant="outline" className="text-xs text-slate-600">{view.stage.status}</Badge>}
          openLabel="Open Programme"
          onOpen={() => onNavigate("programme")}
        >
          {/* Stage — DOMINANT TEXT */}
          <div className="mb-1">
            <div className="text-2xl font-bold text-slate-900 leading-tight">{view.stage.label}</div>
          </div>

          {/* Gateway strip */}
          <div className="flex items-center gap-3 py-1">
            {view.gates.map((g) => (
              <div key={g.id} className="flex items-center gap-1">
                <GateIcon status={g.status} />
                <span className="text-xs font-medium text-slate-700">{g.id}</span>
              </div>
            ))}
          </div>

          {/* Next dates */}
          <div className="border-t border-slate-100 pt-1.5 space-y-0.5">
            {view.nextDates.slice(0, 3).map((d, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs">
                <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                <span className="text-slate-700 truncate flex-1">{d.label}</span>
                <span className="text-slate-500 shrink-0">{d.date}</span>
              </div>
            ))}
          </div>

          {/* Blocking & Drift */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="flex items-center gap-1 text-slate-700">
              {view.blocking > 0 && <AlertCircle className="h-3 w-3 text-amber-600" />}
              Blocking: {view.blocking === 0 ? "None" : `${view.blocking} item${view.blocking > 1 ? "s" : ""}`}
            </span>
            <Badge variant="outline" className={`text-xs ${driftColor[view.drift]} border-current`}>
              {driftLabel[view.drift]}
            </Badge>
          </div>
        </BlockCard>

        {/* Plan Content Block — INVENTORY CARD */}
        <BlockCard title="Plan Content" role="inventory" openLabel="Open Policies" onOpen={() => onNavigate("policies")}>
          <div className="grid grid-cols-2 gap-2">
            {/* A) POLICIES STATUS */}
            <div className="space-y-0.5 text-xs">
              <div className="flex items-center gap-1 font-semibold text-slate-700 mb-0.5 text-[11px] uppercase tracking-wide">
                <FileText className="h-3 w-3" />
                Status
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Vision</span>
                <span className="font-semibold text-slate-900 capitalize">{view.policies.vision}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Spatial</span>
                <span className="font-semibold text-slate-900 capitalize">{view.policies.spatial}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Policies</span>
                <span className="font-semibold text-slate-900">{view.policies.policiesCount} / {view.policies.policiesTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Monitor</span>
                <span className="font-semibold text-slate-900 capitalize">{view.policies.monitoring}</span>
              </div>
            </div>

            {/* B) TEXT CHURN */}
            <div className="space-y-0.5 text-xs">
              <div className="flex items-center gap-1 font-semibold text-slate-700 mb-0.5 text-[11px] uppercase tracking-wide">
                <Activity className="h-3 w-3" />
                Churn (7d)
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Changed</span>
                <span className="font-bold text-slate-900">{view.churn.changed7d}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Untouched</span>
                <span className="font-bold text-slate-900">{view.churn.untouched}</span>
              </div>
              {view.churn.highChurnArea && (
                <div className="pt-0.5 text-amber-700 font-medium text-[11px]">High: {view.churn.highChurnArea}</div>
              )}
            </div>
          </div>
        </BlockCard>

        {/* Scrutiny & Exposure Block — STATE CARD */}
        <BlockCard 
          title="Scrutiny & Exposure" 
          role="state"
          openLabel="Open Scenarios" 
          onOpen={() => onNavigate("decisions")}
        >
          {/* Active scrutiny points */}
          <div className="space-y-1 bg-red-50/40 -mx-2.5 px-2.5 py-1.5 rounded">
            {view.scrutinyPoints.slice(0, 3).map((sp, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs">
                <Eye className="h-3 w-3 text-red-600 shrink-0" />
                <span className="text-slate-800 truncate font-medium flex-1">{sp.label}</span>
                <span className={`text-xs font-bold shrink-0 ${
                  sp.severity === "Fragile" ? "text-red-700" :
                  sp.severity === "Unclear" ? "text-amber-700" :
                  sp.severity === "Exposed" ? "text-orange-700" :
                  "text-red-600"
                }`}>
                  {sp.severity}
                </span>
              </div>
            ))}
          </div>

          {/* Where it bites */}
          <div className="border-t border-slate-200 pt-1.5">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 mb-1 uppercase tracking-wide">
              <Target className="h-3 w-3" />
              Where it bites
            </div>
            <div className="flex flex-wrap gap-1">
              {view.whereItBites.slice(0, 4).map((w, idx) => (
                <Badge key={idx} variant="outline" className="text-xs text-slate-700 border-slate-300">
                  {w}
                </Badge>
              ))}
            </div>
          </div>

          {/* Current reading */}
          <div className="border-t border-slate-200 pt-1.5 text-xs">
            <div className="flex items-center gap-1 font-semibold text-slate-900">
              <BookOpen className="h-3 w-3 text-slate-600" />
              {view.reading.label}
            </div>
            <div className="text-slate-600 mt-0.5">Last revised: {view.reading.lastRevised}</div>
          </div>
        </BlockCard>

        {/* ROW 2 */}
        {/* Evidence Block — INVENTORY CARD */}
        <BlockCard title="Evidence" role="inventory" openLabel="Open Evidence" onOpen={() => onNavigate("evidence")}>
          {/* Counters — MISSING is visually dominant */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <FileCheck className="h-4 w-4 mx-auto mb-0.5 text-green-600" />
              <div className="text-base font-bold text-green-700">{view.evidence.final}</div>
              <div className="text-[10px] text-slate-600 uppercase tracking-wide">Final</div>
            </div>
            <div>
              <FileEdit className="h-4 w-4 mx-auto mb-0.5 text-amber-600" />
              <div className="text-base font-bold text-amber-700">{view.evidence.draft}</div>
              <div className="text-[10px] text-slate-600 uppercase tracking-wide">Draft</div>
            </div>
            <div>
              <FileQuestion className="h-5 w-5 mx-auto mb-0.5 text-red-600" />
              <div className="text-2xl font-bold text-red-700">{view.evidence.missing}</div>
              <div className="text-[10px] text-slate-600 uppercase tracking-wide font-semibold">Missing</div>
            </div>
          </div>

          {/* Critical missing */}
          {view.criticalMissing.length > 0 && (
            <div className="border-t border-slate-100 pt-1.5">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 mb-0.5 uppercase tracking-wide">
                <AlertCircle className="h-3 w-3 text-red-600" />
                Critical missing
              </div>
              <ul className="space-y-0.5">
                {view.criticalMissing.slice(0, 2).map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-700 truncate">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recently updated */}
          {view.recentlyUpdated && (
            <div className="text-xs text-slate-500 pt-1">Latest: {view.recentlyUpdated}</div>
          )}
        </BlockCard>

        {/* Places Block — INVENTORY CARD */}
        <BlockCard title="Places" role="inventory" openLabel="Open Places" onOpen={() => onNavigate("places")}>
          {/* Sites pipeline — single visual unit */}
          <div className="bg-slate-50 rounded px-2 py-1.5 mb-1.5">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 mb-1 uppercase tracking-wide">
              <MapPin className="h-3 w-3" />
              Sites pipeline
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-slate-700">{view.sites.identified}</div>
                <div className="text-[10px] text-slate-600 uppercase">ID'd</div>
              </div>
              <div>
                <div className="text-lg font-bold text-slate-700">{view.sites.assessed}</div>
                <div className="text-[10px] text-slate-600 uppercase">Assessed</div>
              </div>
              <div>
                <div className="text-lg font-bold text-slate-700">{view.sites.allocated}</div>
                <div className="text-[10px] text-slate-600 uppercase">Alloc'd</div>
              </div>
            </div>
          </div>

          {/* Allocation risk — highlighted if non-zero */}
          <div className="text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Allocation risk</span>
              <span className={`font-bold ${view.allocationRisk === 0 ? "text-green-700" : "text-amber-700"}`}>
                {view.allocationRisk === 0 ? "None" : `${view.allocationRisk} items`}
              </span>
            </div>
          </div>

          {/* Map gaps */}
          <div className="text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-700">
                <Map className="h-3 w-3 text-slate-500" />
                Policy map gaps
              </span>
              <span className="font-bold text-slate-900">{view.mapGaps} gaps</span>
            </div>
          </div>
        </BlockCard>

        {/* Scenarios Snapshot Block — ENVELOPE CARD */}
        <BlockCard title="Scenarios Snapshot" role="envelope" openLabel="Open Scenarios" onOpen={() => onNavigate("decisions")}>
          {/* Counters — less emphasis than other inventory cards */}
          <div className="grid grid-cols-2 gap-3 text-center mb-2">
            <div>
              <div className="text-lg font-bold text-slate-800">{view.scenarios.active}</div>
              <div className="text-[10px] text-slate-600 uppercase tracking-wide">Active</div>
            </div>
            <div>
              <div className="text-lg font-bold text-slate-400">{view.scenarios.stale}</div>
              <div className="text-[10px] text-slate-600 uppercase tracking-wide">Stale</div>
            </div>
          </div>

          {/* Envelope chips — PRIMARY SIGNAL */}
          <div className="border-t border-slate-200/50 pt-1.5">
            <div className="flex items-center gap-1 justify-center text-[11px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
              <Lightbulb className="h-3 w-3" />
              Current envelope
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {view.envelopeChips.slice(0, 3).map((chip, idx) => (
                <Badge 
                  key={idx} 
                  variant="outline" 
                  className="text-xs font-semibold text-slate-700 border-slate-400 px-2.5 py-0.5"
                >
                  {chip}
                </Badge>
              ))}
            </div>
          </div>

          {/* Breadth indicator */}
          <div className="text-xs pt-1.5 text-center">
            <span className="text-slate-600">Breadth: </span>
            <span className={`inline-flex items-center gap-1 font-bold ${
              view.breadth === "Widening" ? "text-blue-700" : 
              view.breadth === "Narrowing" ? "text-amber-700" : 
              "text-slate-700"
            }`}>
              {view.breadth === "Widening" && <TrendingUp className="h-3 w-3" />}
              {view.breadth === "Narrowing" && <TrendingDown className="h-3 w-3" />}
              {view.breadth === "Stable" && <Minus className="h-3 w-3" />}
              {view.breadth}
            </span>
          </div>
        </BlockCard>
      </div>
    </div>
  );
}
