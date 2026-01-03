"use client";

import React from "react";
import { ShellHeader } from "@/components/shell-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2 } from "lucide-react";
import { SeverityBadge } from "@/components/severity-badge";
import { BRAND } from "@/lib/constants";
import { uid, todayISO } from "@/lib/utils";
import type { MonitoringSignal, Severity } from "@/types";

interface ShellMonitoringProps {
  signals: MonitoringSignal[];
  setSignals: (s: MonitoringSignal[]) => void;
}

export function ShellMonitoring({ signals, setSignals }: ShellMonitoringProps) {
  const [filter, setFilter] = React.useState<"all" | "open" | "watching" | "closed">("all");
  const [severityFilter, setSeverityFilter] = React.useState<Severity | "all">("all");

  const addSignal = () =>
    setSignals([
      ...signals,
      {
        id: uid("sig"),
        indicator: "New indicator",
        baseline: "",
        current: "",
        target: "",
        trend: "stable",
        severity: "Medium",
        status: "open",
        notes: "",
      },
    ]);

  const updateSignal = (id: string, patch: Partial<MonitoringSignal>) =>
    setSignals(signals.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const removeSignal = (id: string) => setSignals(signals.filter((s) => s.id !== id));

  const filtered = signals.filter((s) => {
    if (filter !== "all" && s.status !== filter) return false;
    if (severityFilter !== "all" && s.severity !== severityFilter) return false;
    return true;
  });

  const stats = {
    total: signals.length,
    open: signals.filter((s) => s.status === "open").length,
    watching: signals.filter((s) => s.status === "watching").length,
    closed: signals.filter((s) => s.status === "closed").length,
    high: signals.filter((s) => s.severity === "High").length,
    medium: signals.filter((s) => s.severity === "Medium").length,
    low: signals.filter((s) => s.severity === "Low").length,
  };

  const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-slate-500" />;
  };

  return (
    <div className="space-y-4">
      <ShellHeader title="Monitoring" subtitle="Track indicators, trends, and interventions" />

      <Card className="border-slate-200 bg-white/70">
        <CardHeader>
          <CardTitle className="text-base" style={{ color: BRAND.navy }}>
            Dashboard
          </CardTitle>
          <CardDescription>Overview of monitoring signals.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="text-xs text-slate-600 mb-1">Total signals</div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3">
              <div className="text-xs text-blue-700 mb-1">Open</div>
              <div className="text-2xl font-bold text-blue-900">{stats.open}</div>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
              <div className="text-xs text-amber-700 mb-1">Watching</div>
              <div className="text-2xl font-bold text-amber-900">{stats.watching}</div>
            </div>
            <div className="rounded-2xl border border-green-200 bg-green-50 p-3">
              <div className="text-xs text-green-700 mb-1">Closed</div>
              <div className="text-2xl font-bold text-green-900">{stats.closed}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="signals" className="w-full">
        <TabsList className="bg-white/70 border border-slate-200 rounded-2xl">
          <TabsTrigger value="signals">Signals</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="interventions">Interventions</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="signals">
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                      Signals ({filtered.length})
                    </CardTitle>
                    <CardDescription>Track performance indicators and trends.</CardDescription>
                  </div>
                  <Button className="rounded-2xl" style={{ background: BRAND.navy }} onClick={addSignal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <div className="text-xs text-slate-600 self-center mr-2">Filter:</div>
                  {(["all", "open", "watching", "closed"] as const).map((f) => (
                    <Button
                      key={f}
                      variant={filter === f ? "default" : "outline"}
                      size="sm"
                      className="rounded-2xl"
                      style={filter === f ? { background: BRAND.navy } : undefined}
                      onClick={() => setFilter(f)}
                    >
                      {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                    </Button>
                  ))}
                  <div className="w-px h-6 bg-slate-200 self-center mx-1" />
                  {(["all", "High", "Medium", "Low"] as const).map((sev) => (
                    <Button
                      key={sev}
                      variant={severityFilter === sev ? "default" : "outline"}
                      size="sm"
                      className="rounded-2xl"
                      style={severityFilter === sev ? { background: BRAND.navy } : undefined}
                      onClick={() => setSeverityFilter(sev)}
                    >
                      {sev}
                    </Button>
                  ))}
                </div>

                {filtered.length === 0 && (
                  <div className="text-center text-slate-600 py-8">No signals match the current filter.</div>
                )}

                {filtered.map((sig) => (
                  <div key={sig.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Input
                            value={sig.indicator}
                            onChange={(e) => updateSignal(sig.id, { indicator: e.target.value })}
                            className="font-semibold"
                            placeholder="Indicator name"
                          />
                          <TrendIcon trend={sig.trend} />
                          <SeverityBadge level={sig.severity} />
                        </div>
                        <Textarea
                          value={sig.notes}
                          onChange={(e) => updateSignal(sig.id, { notes: e.target.value })}
                          rows={2}
                          placeholder="Notes..."
                          className="text-sm border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3 mb-3">
                      <div>
                        <div className="text-xs text-slate-600 mb-1">Baseline</div>
                        <Input
                          value={sig.baseline}
                          onChange={(e) => updateSignal(sig.id, { baseline: e.target.value })}
                          className="h-8 text-sm"
                          placeholder="e.g., 100"
                        />
                      </div>
                      <div>
                        <div className="text-xs text-slate-600 mb-1">Current</div>
                        <Input
                          value={sig.current}
                          onChange={(e) => updateSignal(sig.id, { current: e.target.value })}
                          className="h-8 text-sm"
                          placeholder="e.g., 85"
                        />
                      </div>
                      <div>
                        <div className="text-xs text-slate-600 mb-1">Target</div>
                        <Input
                          value={sig.target}
                          onChange={(e) => updateSignal(sig.id, { target: e.target.value })}
                          className="h-8 text-sm"
                          placeholder="e.g., 120"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex gap-2 flex-wrap">
                        <select
                          value={sig.trend}
                          onChange={(e) => updateSignal(sig.id, { trend: e.target.value as "up" | "down" | "stable" })}
                          className="rounded-2xl border border-slate-200 px-3 py-1 text-xs"
                        >
                          <option value="up">Trend: Up</option>
                          <option value="down">Trend: Down</option>
                          <option value="stable">Trend: Stable</option>
                        </select>
                        <select
                          value={sig.severity}
                          onChange={(e) => updateSignal(sig.id, { severity: e.target.value as Severity })}
                          className="rounded-2xl border border-slate-200 px-3 py-1 text-xs"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                        <select
                          value={sig.status}
                          onChange={(e) => updateSignal(sig.id, { status: e.target.value as "open" | "watching" | "closed" })}
                          className="rounded-2xl border border-slate-200 px-3 py-1 text-xs"
                        >
                          <option value="open">Open</option>
                          <option value="watching">Watching</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-2xl border-slate-200"
                        onClick={() => removeSignal(sig.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                  Trend analysis
                </CardTitle>
                <CardDescription>Performance trends and alerts.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-xs font-semibold text-red-900">High severity</span>
                    </div>
                    <div className="text-2xl font-bold text-red-900">{stats.high}</div>
                  </div>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span className="text-xs font-semibold text-amber-900">Medium severity</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-900">{stats.medium}</div>
                  </div>
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-semibold text-green-900">Low severity</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">{stats.low}</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-800 mb-3">Trend breakdown</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-slate-700">Improving</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">
                        {signals.filter((s) => s.trend === "up").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Minus className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-700">Stable</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">
                        {signals.filter((s) => s.trend === "stable").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-slate-700">Declining</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">
                        {signals.filter((s) => s.trend === "down").length}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interventions">
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                  Interventions
                </CardTitle>
                <CardDescription>Actions to address underperformance.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center text-slate-600">
                  Intervention planning workspace (prototype).
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
