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
import type { ShellKey, CardIntensity, HomeCardIntensities } from "@/types";

export type HomeSystemVM = {
  // Intensity for each card (diffusion mode)
  intensities: HomeCardIntensities;

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

// Intensity-driven visual treatment
function getIntensityStyles(intensity: CardIntensity) {
  switch (intensity) {
    case 0: // Dormant
      return {
        card: "bg-slate-50/40 border-slate-200/50 opacity-70",
        header: "text-slate-500",
        text: "text-slate-500",
        accent: "text-slate-400",
        pulse: "",
      };
    case 1: // Active
      return {
        card: "bg-white border-slate-300",
        header: "text-slate-800",
        text: "text-slate-700",
        accent: "text-slate-600",
        pulse: "",
      };
    case 2: // Pressing
      return {
        card: "bg-amber-50/30 border-amber-400 shadow-sm",
        header: "text-slate-900 font-bold",
        text: "text-slate-800",
        accent: "text-amber-700",
        pulse: "",
      };
    case 3: // Acute
      return {
        card: "bg-gradient-to-br from-amber-100/50 via-orange-50/40 to-red-50/30 border-red-400 shadow-md ring-1 ring-red-200/50",
        header: "text-slate-900 font-bold",
        text: "text-slate-900",
        accent: "text-red-700",
        pulse: "animate-pulse-slow",
      };
  }
}

function GateIcon({ status, intensity }: { status: "passed" | "in_progress" | "pending"; intensity: CardIntensity }) {
  const sizeClass = intensity >= 2 ? "h-4 w-4" : "h-3.5 w-3.5";
  const glowClass = intensity === 3 ? "drop-shadow-glow" : "";
  
  if (status === "passed") return <CheckCircle2 className={`${sizeClass} ${glowClass} text-green-600`} />;
  if (status === "in_progress") return <Clock className={`${sizeClass} ${glowClass} text-amber-600`} />;
  return <Circle className={`${sizeClass} ${glowClass} text-slate-300`} />;
}

function DiffusionCard({
  title,
  intensity,
  onOpen,
  children,
}: {
  title: string;
  intensity: CardIntensity;
  onOpen: () => void;
  children: React.ReactNode;
}) {
  const styles = getIntensityStyles(intensity);
  const densityClass = intensity >= 2 ? "space-y-1" : "space-y-1.5";

  return (
    <Card 
      className={`${styles.card} ${styles.pulse} flex flex-col transition-all duration-700 cursor-pointer hover:shadow-lg`}
      onClick={onOpen}
    >
      <CardHeader className="pb-1.5 px-2.5 pt-2.5">
        <h3 className={`text-sm ${styles.header} transition-all duration-700`}>{title}</h3>
      </CardHeader>
      <CardContent className={`flex-1 px-2.5 pb-2.5 pt-0 ${densityClass}`}>
        {children}
      </CardContent>
    </Card>
  );
}

export function ShellHome({ view, onNavigate }: ShellHomeProps) {
  const driftLabel = { on_track: "On track", minor_drift: "Minor drift", material_drift: "Material drift" };
  const driftColor = { on_track: "text-green-700", minor_drift: "text-amber-700", material_drift: "text-red-700" };
  
  const { intensities } = view;

  return (
    <div className="space-y-3">
      {/* Fixed 2×3 grid layout — NEVER reorders, NEVER resizes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* ═══════════════════════════════════════════════════════════════
            ROW 1
            ═══════════════════════════════════════════════════════════════ */}
        
        {/* PROGRAMME */}
        <DiffusionCard
          title="Programme"
          intensity={intensities.programme}
          onOpen={() => onNavigate("programme")}
        >
          {(() => {
            const styles = getIntensityStyles(intensities.programme);
            const labelSize = intensities.programme >= 2 ? "text-2xl" : "text-xl";
            const dateSize = intensities.programme >= 2 ? "text-xs font-bold" : "text-xs";
            const blockingWeight = intensities.programme >= 2 ? "font-bold" : "font-medium";
            
            return (
              <>
                {/* Stage label */}
                <div className="mb-1">
                  <div className={`${labelSize} font-bold ${styles.header} leading-tight transition-all duration-700`}>
                    {view.stage.label}
                  </div>
                  <Badge variant="outline" className={`text-xs ${styles.text} mt-1`}>
                    {view.stage.status}
                  </Badge>
                </div>

                {/* Gateway strip with intensity-aware icons */}
                <div className="flex items-center gap-3 py-1">
                  {view.gates.map((g) => (
                    <div key={g.id} className="flex items-center gap-1">
                      <GateIcon status={g.status} intensity={intensities.programme} />
                      <span className={`text-xs font-medium ${styles.text} transition-all duration-700`}>
                        {g.id}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Next dates with warmer treatment at higher intensity */}
                <div className={`border-t pt-1.5 space-y-0.5 ${
                  intensities.programme >= 2 ? "border-amber-200" : "border-slate-100"
                } transition-all duration-700`}>
                  {view.nextDates.slice(0, 3).map((d, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <Calendar className={`h-3 w-3 ${styles.accent} shrink-0 transition-all duration-700`} />
                      <span className={`${dateSize} ${styles.text} truncate flex-1 transition-all duration-700`}>
                        {d.label}
                      </span>
                      <span className={`${dateSize} ${styles.accent} shrink-0 transition-all duration-700`}>
                        {d.date}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Blocking & Drift — thicker at higher intensity */}
                <div className={`flex items-center justify-between text-xs pt-1 ${blockingWeight} transition-all duration-700`}>
                  <span className={`flex items-center gap-1 ${styles.text}`}>
                    {view.blocking > 0 && <AlertCircle className={`h-3 w-3 ${styles.accent}`} />}
                    Blocking: {view.blocking === 0 ? "None" : `${view.blocking} item${view.blocking > 1 ? "s" : ""}`}
                  </span>
                  <Badge variant="outline" className={`text-xs ${driftColor[view.drift]} border-current`}>
                    {driftLabel[view.drift]}
                  </Badge>
                </div>
              </>
            );
          })()}
        </DiffusionCard>

        {/* PLAN CONTENT */}
        <DiffusionCard
          title="Plan Content"
          intensity={intensities.planContent}
          onOpen={() => onNavigate("policies")}
        >
          {(() => {
            const styles = getIntensityStyles(intensities.planContent);
            const countSize = intensities.planContent >= 2 ? "text-base font-bold" : "text-sm font-semibold";
            const highlightChanged = intensities.planContent >= 2;
            
            return (
              <div className="grid grid-cols-2 gap-2">
                {/* Policies Status */}
                <div className="space-y-0.5 text-xs">
                  <div className={`flex items-center gap-1 font-semibold ${styles.header} mb-0.5 text-[11px] uppercase tracking-wide transition-all duration-700`}>
                    <FileText className="h-3 w-3" />
                    Status
                  </div>
                  <div className="flex justify-between">
                    <span className={styles.text}>Vision</span>
                    <span className={`${countSize} ${styles.header} capitalize transition-all duration-700`}>
                      {view.policies.vision}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={styles.text}>Spatial</span>
                    <span className={`${countSize} ${styles.header} capitalize transition-all duration-700`}>
                      {view.policies.spatial}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={styles.text}>Policies</span>
                    <span className={`${countSize} ${styles.header} transition-all duration-700`}>
                      {view.policies.policiesCount} / {view.policies.policiesTotal}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={styles.text}>Monitor</span>
                    <span className={`${countSize} ${styles.header} capitalize transition-all duration-700`}>
                      {view.policies.monitoring}
                    </span>
                  </div>
                </div>

                {/* Text Churn — highlighted section when intensity rises */}
                <div className={`space-y-0.5 text-xs ${
                  highlightChanged ? "bg-amber-100/40 -mr-2.5 pr-2.5 -my-1 py-1 rounded" : ""
                } transition-all duration-700`}>
                  <div className={`flex items-center gap-1 font-semibold ${styles.header} mb-0.5 text-[11px] uppercase tracking-wide transition-all duration-700`}>
                    <Activity className="h-3 w-3" />
                    Churn (7d)
                  </div>
                  <div className="flex justify-between">
                    <span className={styles.text}>Changed</span>
                    <span className={`${countSize} ${highlightChanged ? "text-amber-800" : styles.header} transition-all duration-700`}>
                      {view.churn.changed7d}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={styles.text}>Untouched</span>
                    <span className={`${countSize} ${styles.header} transition-all duration-700`}>
                      {view.churn.untouched}
                    </span>
                  </div>
                  {view.churn.highChurnArea && (
                    <div className={`pt-0.5 ${styles.accent} font-medium text-[11px] transition-all duration-700`}>
                      High: {view.churn.highChurnArea}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </DiffusionCard>

        {/* SCRUTINY & EXPOSURE */}
        <DiffusionCard
          title="Scrutiny & Exposure"
          intensity={intensities.scrutiny}
          onOpen={() => onNavigate("decisions")}
        >
          {(() => {
            const styles = getIntensityStyles(intensities.scrutiny);
            const severityWeight = intensities.scrutiny >= 2 ? "font-extrabold" : "font-bold";
            const bgIntensity = intensities.scrutiny >= 3 ? "bg-red-100/60" : 
                               intensities.scrutiny >= 2 ? "bg-red-50/50" : 
                               "bg-red-50/30";
            
            return (
              <>
                {/* Active scrutiny points with intensity-aware background */}
                <div className={`space-y-1 ${bgIntensity} -mx-2.5 px-2.5 py-1.5 rounded transition-all duration-700`}>
                  {view.scrutinyPoints.slice(0, 3).map((sp, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs">
                      <Eye className={`h-3 w-3 ${styles.accent} shrink-0 transition-all duration-700`} />
                      <span className={`${styles.text} truncate font-medium flex-1 transition-all duration-700`}>
                        {sp.label}
                      </span>
                      <span className={`text-xs ${severityWeight} shrink-0 transition-all duration-700 ${
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

                {/* Where it bites — chips cluster tighter at high intensity */}
                <div className="border-t border-slate-200 pt-1.5">
                  <div className={`flex items-center gap-1 text-[11px] font-semibold ${styles.header} mb-1 uppercase tracking-wide transition-all duration-700`}>
                    <Target className="h-3 w-3" />
                    Where it bites
                  </div>
                  <div className={`flex flex-wrap ${intensities.scrutiny >= 2 ? "gap-0.5" : "gap-1"} transition-all duration-700`}>
                    {view.whereItBites.slice(0, 4).map((w, idx) => (
                      <Badge key={idx} variant="outline" className={`text-xs ${styles.text} border-slate-300 transition-all duration-700`}>
                        {w}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Current reading */}
                <div className="border-t border-slate-200 pt-1.5 text-xs">
                  <div className={`flex items-center gap-1 font-semibold ${styles.header} transition-all duration-700`}>
                    <BookOpen className="h-3 w-3 text-slate-600" />
                    {view.reading.label}
                  </div>
                  <div className={`${styles.text} mt-0.5 transition-all duration-700`}>
                    Last revised: {view.reading.lastRevised}
                  </div>
                </div>
              </>
            );
          })()}
        </DiffusionCard>

        {/* ═══════════════════════════════════════════════════════════════
            ROW 2
            ═══════════════════════════════════════════════════════════════ */}

        {/* EVIDENCE */}
        <DiffusionCard
          title="Evidence"
          intensity={intensities.evidence}
          onOpen={() => onNavigate("evidence")}
        >
          {(() => {
            const styles = getIntensityStyles(intensities.evidence);
            const missingSize = intensities.evidence >= 3 ? "text-3xl" : 
                               intensities.evidence >= 2 ? "text-2xl" : "text-xl";
            const missingFloat = intensities.evidence >= 3 ? "transform scale-110" : "";
            
            return (
              <>
                {/* Counters — MISSING visually floats forward at high intensity */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className={`transition-all duration-700 ${intensities.evidence >= 3 ? "opacity-60" : ""}`}>
                    <FileCheck className="h-4 w-4 mx-auto mb-0.5 text-green-600" />
                    <div className={`text-base font-bold text-green-700 transition-all duration-700`}>
                      {view.evidence.final}
                    </div>
                    <div className={`text-[10px] ${styles.text} uppercase tracking-wide transition-all duration-700`}>
                      Final
                    </div>
                  </div>
                  <div className={`transition-all duration-700 ${intensities.evidence >= 3 ? "opacity-60" : ""}`}>
                    <FileEdit className="h-4 w-4 mx-auto mb-0.5 text-amber-600" />
                    <div className={`text-base font-bold text-amber-700 transition-all duration-700`}>
                      {view.evidence.draft}
                    </div>
                    <div className={`text-[10px] ${styles.text} uppercase tracking-wide transition-all duration-700`}>
                      Draft
                    </div>
                  </div>
                  <div className={`transition-all duration-700 ${missingFloat}`}>
                    <FileQuestion className="h-5 w-5 mx-auto mb-0.5 text-red-600" />
                    <div className={`${missingSize} font-bold text-red-700 transition-all duration-700`}>
                      {view.evidence.missing}
                    </div>
                    <div className={`text-[10px] ${styles.text} uppercase tracking-wide font-semibold transition-all duration-700`}>
                      Missing
                    </div>
                  </div>
                </div>

                {/* Critical missing — enlarges at high intensity */}
                {view.criticalMissing.length > 0 && (
                  <div className="border-t border-slate-100 pt-1.5">
                    <div className={`flex items-center gap-1 text-[11px] font-semibold ${styles.header} mb-0.5 uppercase tracking-wide transition-all duration-700`}>
                      <AlertCircle className={`h-3 w-3 ${styles.accent} transition-all duration-700`} />
                      Critical missing
                    </div>
                    <ul className="space-y-0.5">
                      {view.criticalMissing.slice(0, 2).map((item, idx) => (
                        <li key={idx} className={`text-xs ${styles.text} truncate transition-all duration-700`}>
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recently updated */}
                {view.recentlyUpdated && (
                  <div className={`text-xs ${styles.text} pt-1 transition-all duration-700`}>
                    Latest: {view.recentlyUpdated}
                  </div>
                )}
              </>
            );
          })()}
        </DiffusionCard>

        {/* PLACES */}
        <DiffusionCard
          title="Places"
          intensity={intensities.places}
          onOpen={() => onNavigate("places")}
        >
          {(() => {
            const styles = getIntensityStyles(intensities.places);
            const pipelineSharpness = intensities.places >= 2 ? "border-2 border-slate-300" : "border border-slate-200";
            const riskWeight = intensities.places >= 2 ? "font-extrabold" : "font-bold";
            
            return (
              <>
                {/* Sites pipeline — segmentation sharpens at higher intensity */}
                <div className={`bg-slate-50 rounded px-2 py-1.5 mb-1.5 ${pipelineSharpness} transition-all duration-700`}>
                  <div className={`flex items-center gap-1 text-[11px] font-semibold ${styles.header} mb-1 uppercase tracking-wide transition-all duration-700`}>
                    <MapPin className="h-3 w-3" />
                    Sites pipeline
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className={`text-lg font-bold ${styles.header} transition-all duration-700`}>
                        {view.sites.identified}
                      </div>
                      <div className={`text-[10px] ${styles.text} uppercase transition-all duration-700`}>ID'd</div>
                    </div>
                    <div>
                      <div className={`text-lg font-bold ${styles.header} transition-all duration-700`}>
                        {view.sites.assessed}
                      </div>
                      <div className={`text-[10px] ${styles.text} uppercase transition-all duration-700`}>Assessed</div>
                    </div>
                    <div>
                      <div className={`text-lg font-bold ${styles.header} transition-all duration-700`}>
                        {view.sites.allocated}
                      </div>
                      <div className={`text-[10px] ${styles.text} uppercase transition-all duration-700`}>Alloc'd</div>
                    </div>
                  </div>
                </div>

                {/* Allocation risk — gains color weight at higher intensity */}
                <div className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className={`${styles.text} transition-all duration-700`}>Allocation risk</span>
                    <span className={`${riskWeight} transition-all duration-700 ${
                      view.allocationRisk === 0 ? "text-green-700" : 
                      intensities.places >= 2 ? "text-red-700" : "text-amber-700"
                    }`}>
                      {view.allocationRisk === 0 ? "None" : `${view.allocationRisk} items`}
                    </span>
                  </div>
                </div>

                {/* Map gaps */}
                <div className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className={`flex items-center gap-1 ${styles.text} transition-all duration-700`}>
                      <Map className="h-3 w-3 text-slate-500" />
                      Policy map gaps
                    </span>
                    <span className={`font-bold ${styles.header} transition-all duration-700`}>
                      {view.mapGaps} gaps
                    </span>
                  </div>
                </div>
              </>
            );
          })()}
        </DiffusionCard>

        {/* SCENARIOS SNAPSHOT */}
        <DiffusionCard
          title="Scenarios Snapshot"
          intensity={intensities.scenarios}
          onOpen={() => onNavigate("decisions")}
        >
          {(() => {
            const styles = getIntensityStyles(intensities.scenarios);
            const stalePulse = intensities.scenarios >= 3 ? "animate-pulse-slow" : "";
            const envelopePulse = intensities.scenarios >= 2 ? "animate-pulse-slow" : "";
            
            return (
              <>
                {/* Counters */}
                <div className="grid grid-cols-2 gap-3 text-center mb-2">
                  <div>
                    <div className={`text-lg font-bold ${styles.header} transition-all duration-700`}>
                      {view.scenarios.active}
                    </div>
                    <div className={`text-[10px] ${styles.text} uppercase tracking-wide transition-all duration-700`}>
                      Active
                    </div>
                  </div>
                  <div className={stalePulse}>
                    <div className={`text-lg font-bold ${intensities.scenarios >= 3 ? "text-red-600" : "text-slate-400"} transition-all duration-700`}>
                      {view.scenarios.stale}
                    </div>
                    <div className={`text-[10px] ${styles.text} uppercase tracking-wide transition-all duration-700`}>
                      Stale
                    </div>
                  </div>
                </div>

                {/* Envelope chips — pulse at higher intensity */}
                <div className="border-t border-slate-200/50 pt-1.5">
                  <div className={`flex items-center gap-1 justify-center text-[11px] font-semibold ${styles.header} mb-1.5 uppercase tracking-wide transition-all duration-700`}>
                    <Lightbulb className="h-3 w-3" />
                    Current envelope
                  </div>
                  <div className={`flex flex-wrap gap-1.5 justify-center ${envelopePulse}`}>
                    {view.envelopeChips.slice(0, 3).map((chip, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className={`text-xs font-semibold ${styles.text} border-slate-400 px-2.5 py-0.5 transition-all duration-700`}
                      >
                        {chip}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Breadth indicator — shifts visually at higher intensity */}
                <div className="text-xs pt-1.5 text-center">
                  <span className={`${styles.text} transition-all duration-700`}>Breadth: </span>
                  <span className={`inline-flex items-center gap-1 font-bold transition-all duration-700 ${
                    view.breadth === "Widening" ? "text-blue-700" : 
                    view.breadth === "Narrowing" ? intensities.scenarios >= 2 ? "text-red-700" : "text-amber-700" : 
                    "text-slate-700"
                  }`}>
                    {view.breadth === "Widening" && <TrendingUp className="h-3 w-3" />}
                    {view.breadth === "Narrowing" && <TrendingDown className="h-3 w-3" />}
                    {view.breadth === "Stable" && <Minus className="h-3 w-3" />}
                    {view.breadth}
                  </span>
                </div>
              </>
            );
          })()}
        </DiffusionCard>
      </div>
    </div>
  );
}
