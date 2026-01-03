"use client";

import React from "react";
import { ShellNav } from "@/components/shell-nav";
import { StageRibbon } from "@/components/stage-ribbon";
import { ReadingControl } from "@/components/reading-control";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Menu, Users, Sparkles } from "lucide-react";
import { BRAND, SHELLS, STAGES, STAGE_DEFAULT } from "@/lib/constants";
import { useAppData } from "@/hooks/use-app-data";
import { ShellHome, type HomeSystemVM } from "@/components/shells/shell-home";
import {
  ShellProgramme,
  ShellPolicies,
  ShellPlaces,
  ShellEvidence,
  ShellEngage,
  ShellDecisions,
  ShellMonitoring,
} from "@/components/shells";
import type { ShellKey, StageKey } from "@/types";

export default function Home() {
  const [activeShell, setActiveShell] = React.useState<ShellKey>("home");
  const [activeStage, setActiveStage] = React.useState<StageKey>("content");

  const data = useAppData();

  const homeView: HomeSystemVM = React.useMemo(
    () => ({
      // Programme
      stage: {
        label: "Regulation 19",
        status: "In progress",
      },
      gates: [
        { id: "G1", status: "passed" },
        { id: "G2", status: "in_progress" },
        { id: "G3", status: "pending" },
      ],
      nextDates: data.milestones
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3)
        .map((m) => ({
          label: m.label,
          date: m.date,
          type: m.kind,
        })),
      blocking: 0,
      drift: "on_track",

      // Plan Content
      policies: {
        vision: data.visionOutcomesPublishedAt ? "drafted" : "missing",
        spatial: "drafted",
        policiesCount: 48,
        policiesTotal: 52,
        monitoring: "outline",
      },
      churn: {
        changed7d: 3,
        untouched: 12,
        highChurnArea: "Transport policies",
      },

      // Scrutiny
      scrutinyPoints: data.pressures.slice(0, 3).map((p) => ({
        label: p.title,
        severity: p.severity as "Fragile" | "Unclear" | "Exposed" | "Tightening",
      })),
      whereItBites: data.pressures.flatMap((p) => p.impacts).slice(0, 4),
      reading: {
        label: data.reading.label,
        lastRevised: "2d ago",
      },

      // Evidence
      evidence: {
        final: data.evidence.filter((e) => e.status === "final").length,
        draft: data.evidence.filter((e) => e.status === "draft").length,
        missing: 3, // Placeholder: calculate based on expected vs actual evidence
      },
      criticalMissing: ["Transport baseline study", "Housing viability assessment"],
      recentlyUpdated: data.evidence.find((e) => e.status === "final")?.title,

      // Places
      sites: {
        identified: 24,
        assessed: 18,
        allocated: 12,
      },
      allocationRisk: 2,
      mapGaps: 3,

      // Scenarios
      scenarios: {
        active: data.options.length,
        stale: 2,
      },
      envelopeChips: ["Baseline", "Stretch", "Fallback"],
      breadth: "Stable",
    }),
    [data]
  );

  const navigateStage = (s: StageKey) => {
    setActiveStage(s);
    setActiveShell(STAGE_DEFAULT[s].shell);
  };

  const goExploreScenarios = () => setActiveShell("decisions");

  return (
    <div className="h-screen w-full" style={{ background: BRAND.bg }}>
      <div className="flex h-full">
        {/* Left navigation (desktop) */}
        <aside className="hidden lg:block w-[260px] border-r border-slate-200 bg-white/40">
          <ShellNav active={activeShell} onSelect={setActiveShell} />
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
            <div className="flex items-center gap-2 px-4 py-3 md:gap-3 md:px-5">
              {/* Mobile nav */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-xl border-slate-200 bg-white"
                      aria-label="Open navigation"
                    >
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] p-0">
                    <div className="h-full bg-white/40">
                      <ShellNav active={activeShell} onSelect={setActiveShell} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Plan selector */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left shadow-sm hover:bg-slate-50">
                    <div className="min-w-0">
                      <div className="text-xs text-slate-500">Plan</div>
                      <div className="max-w-[220px] truncate text-sm font-semibold text-slate-800 sm:max-w-[340px]">
                        {data.activePlan.authority} · {data.activePlan.name}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-slate-600 shrink-0">
                      {data.activePlan.status}
                    </Badge>
                    <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[360px]" align="start">
                  <div className="text-sm font-semibold text-slate-800">Switch plan</div>
                  <div className="mt-2 space-y-2">
                    {data.plans.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => data.setActivePlanId(p.id)}
                        className={`w-full rounded-xl border p-3 text-left ${
                          p.id === data.activePlanId
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="text-sm font-semibold truncate">
                          {p.authority} · {p.name}
                        </div>
                        <div className={`text-xs ${p.id === data.activePlanId ? "text-white/80" : "text-slate-600"}`}>
                          Status: {p.status}
                        </div>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Stage ribbon (md+) */}
              <div className="hidden md:block flex-1 min-w-0">
                <StageRibbon active={activeStage} onSelect={navigateStage} />
              </div>

              {/* Right controls */}
              <div className="ml-auto flex items-center gap-2">
                <ReadingControl
                  profile={data.reading}
                  setProfile={data.setReadingId}
                  options={data.readingProfiles}
                />
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex rounded-2xl border-slate-200 bg-white"
                  title="Explore scenarios"
                  onClick={goExploreScenarios}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Explore scenarios
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="sm:hidden rounded-xl border-slate-200 bg-white"
                  aria-label="Explore scenarios"
                  title="Explore scenarios"
                  onClick={goExploreScenarios}
                >
                  <Users className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Row 2 (mobile) */}
            <div className="px-4 pb-3 md:hidden">
              <StageRibbon active={activeStage} onSelect={navigateStage} />
            </div>
          </header>

          {/* Body */}
          <ScrollArea className="flex-1">
            <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-5 sm:py-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  {SHELLS.find((s) => s.key === activeShell)?.label}
                </div>
                <Badge variant="outline" className="text-slate-600">
                  Stage: {STAGES.find((s) => s.key === activeStage)?.label}
                </Badge>
              </div>

              {activeShell === "home" && <ShellHome view={homeView} onNavigate={setActiveShell} />}
              {activeShell === "programme" && (
                <ShellProgramme
                  milestones={data.milestones}
                  setMilestones={data.setMilestones}
                  timetablePublishedAt={data.timetablePublishedAt}
                  setTimetablePublishedAt={data.setTimetablePublishedAt}
                  noticePublishedAt={data.noticePublishedAt}
                  setNoticePublishedAt={data.setNoticePublishedAt}
                  scopingEnd={data.scopingEnd}
                  consultations={data.consultations}
                  gateways={data.gateways}
                  setGateways={data.setGateways}
                />
              )}
              {activeShell === "policies" && (
                <ShellPolicies
                  visionOutcomesPublishedAt={data.visionOutcomesPublishedAt}
                  setVisionOutcomesPublishedAt={data.setVisionOutcomesPublishedAt}
                />
              )}
              {activeShell === "places" && <ShellPlaces />}
              {activeShell === "evidence" && <ShellEvidence evidence={data.evidence} setEvidence={data.setEvidence} />}
              {activeShell === "engage" && (
                <ShellEngage consultations={data.consultations} setConsultations={data.setConsultations} />
              )}
              {activeShell === "decisions" && <ShellDecisions options={data.options} setOptions={data.setOptions} />}
              {activeShell === "monitoring" && <ShellMonitoring signals={data.signals} setSignals={data.setSignals} />}

              <footer className="mt-10 pb-10 text-xs text-slate-500">
                <Separator className="mb-4" />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full" style={{ background: BRAND.accent }} />
                    <span>Prototype v2: Programme/Policies/Places/Evidence + Monitoring realm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Interactive mock</span>
                  </div>
                </div>
              </footer>
            </main>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
