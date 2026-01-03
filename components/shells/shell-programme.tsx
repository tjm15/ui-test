"use client";

import React from "react";
import { ShellHeader } from "@/components/shell-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus, Pencil, BadgeCheck, X, Check, CircleDashed } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { nowStamp, todayISO, maxDateISO, addMonths, uid } from "@/lib/utils";
import type { Milestone, GatewayType, GatewayState, ConsultationType, Consultation } from "@/types";

interface ShellProgrammeProps {
  milestones: Milestone[];
  setMilestones: (m: Milestone[]) => void;
  timetablePublishedAt?: string;
  setTimetablePublishedAt: (d?: string) => void;
  noticePublishedAt?: string;
  setNoticePublishedAt: (d?: string) => void;
  scopingEnd?: string;
  consultations: Record<ConsultationType, Consultation>;
  gateways: Record<GatewayType, GatewayState>;
  setGateways: (next: Record<GatewayType, GatewayState>) => void;
}

function ChecklistItem({ label }: { label: string }) {
  const [done, setDone] = React.useState(false);
  return (
    <button
      onClick={() => setDone((d) => !d)}
      className={`w-full rounded-2xl border p-3 text-left ${done ? "bg-white/70" : "bg-white"} border-slate-200`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-semibold text-slate-800">{label}</div>
        {done ? <Check className="h-4 w-4 text-slate-600" /> : <CircleDashed className="h-4 w-4 text-slate-500" />}
      </div>
    </button>
  );
}

function GatewayWorkspace({
  g,
  update,
  readiness,
  onPublishAdvice,
}: {
  g: GatewayState;
  update: (patch: Partial<GatewayState>) => void;
  readiness: { ok: boolean; reason?: string; hint?: string };
  onPublishAdvice?: () => void;
}) {
  return (
    <Tabs defaultValue="readiness" className="w-full">
      <TabsList className="bg-white/70 border border-slate-200 rounded-2xl">
        <TabsTrigger value="readiness">Readiness</TabsTrigger>
        <TabsTrigger value="pack">Pack</TabsTrigger>
        <TabsTrigger value="submit">Submit</TabsTrigger>
        <TabsTrigger value="advice">Advice</TabsTrigger>
        <TabsTrigger value="actions">Actions</TabsTrigger>
      </TabsList>

      <div className="mt-4">
        <TabsContent value="readiness">
          <Card className="border-slate-200 bg-white/70">
            <CardHeader>
              <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                {g.id} readiness
              </CardTitle>
              <CardDescription>Hard gates shown as blockers (prototype).</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {readiness.ok ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800">
                  <span className="font-semibold">Ready:</span> you can assemble and submit.
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  <span className="font-semibold">Blocked:</span> {readiness.reason}
                </div>
              )}
              {readiness.hint && <div className="text-xs text-slate-600">Hint: {readiness.hint}</div>}
              <div className="text-xs text-slate-600">
                Status: <span className="font-medium">{g.status}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pack">
          <Card className="border-slate-200 bg-white/70">
            <CardHeader>
              <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                Pack composer
              </CardTitle>
              <CardDescription>In production, this pulls from Policies/Places/Evidence/Engage.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <ChecklistItem label="Plan version selected" />
              <ChecklistItem label="Consultation summary attached" />
              <ChecklistItem label="Policy map attached" />
              <ChecklistItem label="Statements (where relevant)" />
              <Button
                className="rounded-2xl"
                style={{ background: BRAND.navy }}
                onClick={() => update({ status: "drafting" })}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Mark pack drafting
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submit">
          <Card className="border-slate-200 bg-white/70">
            <CardHeader>
              <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                Submit
              </CardTitle>
              <CardDescription>Records timestamp (prototype).</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <Button
                className="rounded-2xl"
                style={{ background: BRAND.navy }}
                disabled={!readiness.ok}
                onClick={() => update({ status: "submitted", submittedAt: nowStamp() })}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit {g.id}
              </Button>
              {g.submittedAt && (
                <div className="text-xs text-slate-600">
                  Submitted: <span className="font-medium">{g.submittedAt}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advice">
          <Card className="border-slate-200 bg-white/70">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                    Advice / outcome
                  </CardTitle>
                  <CardDescription>Gateway 1 has no assessor advice.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="rounded-2xl border-slate-200 bg-white"
                    onClick={() =>
                      update({
                        adviceReceivedAt: nowStamp(),
                        status: g.id === "G1" ? g.status : "advice_received",
                      })
                    }
                    disabled={g.id === "G1"}
                  >
                    Receive advice
                  </Button>
                  <Button
                    className="rounded-2xl"
                    style={{ background: BRAND.navy }}
                    onClick={onPublishAdvice}
                    disabled={!g.adviceReceivedAt}
                  >
                    Publish
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="text-xs text-slate-600">Received: {g.adviceReceivedAt ?? "—"}</div>
              <div className="text-xs text-slate-600">Published: {g.advicePublishedAt ?? "—"}</div>
              {g.id === "G3" && (
                <div className="mt-2 flex gap-2">
                  <Button
                    className="rounded-2xl"
                    style={{ background: BRAND.navy }}
                    onClick={() => update({ status: "passed" })}
                  >
                    <BadgeCheck className="h-4 w-4 mr-2" />
                    Mark passed
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-2xl border-slate-200 bg-white"
                    onClick={() => update({ status: "not_passed" })}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Mark not passed
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card className="border-slate-200 bg-white/70">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                    Response actions
                  </CardTitle>
                  <CardDescription>Convert advice into a short tracked list.</CardDescription>
                </div>
                <Button
                  className="rounded-2xl"
                  style={{ background: BRAND.navy }}
                  onClick={() =>
                    update({ actions: [...g.actions, { id: uid("act"), title: "New action", status: "open" }] })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {g.actions.map((a) => (
                <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-3 flex items-center justify-between gap-2">
                  <Input
                    value={a.title}
                    onChange={(e) =>
                      update({ actions: g.actions.map((x) => (x.id === a.id ? { ...x, title: e.target.value } : x)) })
                    }
                  />
                  <Button
                    variant={a.status === "done" ? "outline" : "default"}
                    className="rounded-2xl"
                    style={a.status !== "done" ? { background: BRAND.navy } : undefined}
                    onClick={() =>
                      update({
                        actions: g.actions.map((x) =>
                          x.id === a.id ? { ...x, status: x.status === "done" ? "open" : "done" } : x
                        ),
                      })
                    }
                  >
                    {a.status === "done" ? "Reopen" : "Done"}
                  </Button>
                </div>
              ))}
              {g.actions.length === 0 && <div className="text-sm text-slate-600">No actions yet.</div>}
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
}

export function ShellProgramme({
  milestones,
  setMilestones,
  timetablePublishedAt,
  setTimetablePublishedAt,
  noticePublishedAt,
  setNoticePublishedAt,
  scopingEnd,
  consultations,
  gateways,
  setGateways,
}: ShellProgrammeProps) {
  const [decisions, setDecisions] = React.useState([
    { id: uid("dec"), label: "Publish notice", body: "Delegated", leadWeeks: 1 },
    { id: uid("dec"), label: "Approve consultation pack", body: "Cabinet", leadWeeks: 6 },
    { id: uid("dec"), label: "Submit plan", body: "Full Council", leadWeeks: 8 },
  ]);

  const [campaigns, setCampaigns] = React.useState<Array<{ id: string; name: string; status: "draft" | "scheduled" | "sent" }>>([
    { id: uid("camp"), name: "Notice of intention", status: "draft" },
    { id: uid("camp"), name: "Content & evidence consultation", status: "scheduled" },
  ]);

  const patchGateway = (id: GatewayType, p: Partial<GatewayState>) =>
    setGateways({ ...gateways, [id]: { ...gateways[id], ...p } });

  const g1Earliest = noticePublishedAt ? maxDateISO(addMonths(noticePublishedAt, 4), scopingEnd) : undefined;

  const readinessG1 = {
    ok: Boolean(noticePublishedAt && scopingEnd),
    reason: !noticePublishedAt
      ? "Publish notice first"
      : !scopingEnd
      ? "Close scoping consultation (end date required)"
      : undefined,
    hint: g1Earliest ? `Earliest publish date: ${g1Earliest}` : "",
  };

  const readinessG2 = {
    ok: Boolean(consultations.content.summaryPublishedAt),
    reason: consultations.content.summaryPublishedAt
      ? undefined
      : "Publish the content & evidence consultation summary first",
  };

  const readinessG3 = {
    ok: Boolean(consultations.proposed.summaryPublishedAt),
    reason: consultations.proposed.summaryPublishedAt
      ? undefined
      : "Publish the proposed plan consultation summary first",
  };

  const next = milestones
    .filter((m) => m.date >= todayISO())
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(0, 6);

  const updateDate = (id: string, date: string) =>
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, date } : m)));

  const canPublish = Boolean(timetablePublishedAt);
  const earliestG1 = noticePublishedAt ? maxDateISO(addMonths(noticePublishedAt, 4), scopingEnd) : undefined;

  const cycle = (s: "draft" | "scheduled" | "sent") =>
    s === "draft" ? "scheduled" : s === "scheduled" ? "sent" : "draft";

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="bg-white/70 border border-slate-200 rounded-2xl">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="timetable">Timetable</TabsTrigger>
        <TabsTrigger value="notice">Notice</TabsTrigger>
        <TabsTrigger value="governance">Governance</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="g1">Gateway 1</TabsTrigger>
        <TabsTrigger value="g2">Gateway 2</TabsTrigger>
        <TabsTrigger value="g3">Gateway 3</TabsTrigger>
        <TabsTrigger value="submission">Submission</TabsTrigger>
      </TabsList>

      <div className="mt-4">
        <TabsContent value="overview">
          <div className="space-y-4">
            <ShellHeader title="Programme" subtitle="Timetable, notice, governance, gateways, submission" />
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                  Critical path
                </CardTitle>
                <CardDescription>Next key dates and dependencies.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {next.map((m) => (
                  <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{m.label}</div>
                        <div className="text-xs text-slate-600">{m.date}</div>
                      </div>
                      <Badge variant="outline" className="text-slate-600">
                        {m.kind}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timetable">
          <div className="space-y-4">
            <ShellHeader title="Timetable" subtitle="Keep milestones coherent and publishable." />
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                      Milestones editor
                    </CardTitle>
                    <CardDescription>Prototype date editor (no dependencies).</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-slate-600">
                      {timetablePublishedAt ? `Published: ${timetablePublishedAt}` : "Not published"}
                    </Badge>
                    <Button
                      className="rounded-2xl"
                      style={{ background: BRAND.navy }}
                      onClick={() => setTimetablePublishedAt(todayISO())}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Publish timetable
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {milestones
                  .slice()
                  .sort((a, b) => (a.date > b.date ? 1 : -1))
                  .map((m) => (
                    <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-800 truncate">{m.label}</div>
                          <div className="text-xs text-slate-600">{m.kind}</div>
                        </div>
                        <Input type="date" value={m.date} onChange={(e) => updateDate(m.id, e.target.value)} className="w-[160px]" />
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notice">
          <div className="space-y-4">
            <ShellHeader title="Notice" subtitle="Publish notice of intention and compute earliest Gateway 1 date." />
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                  Notice of intention
                </CardTitle>
                <CardDescription>Prototype constraints: timetable must be published first.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="text-xs text-slate-500">Timetable status</div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-slate-800">
                      {timetablePublishedAt ? "Published" : "Not published"}
                    </div>
                    {timetablePublishedAt && (
                      <Badge variant="outline" className="text-slate-600">
                        {timetablePublishedAt}
                      </Badge>
                    )}
                  </div>
                  {!timetablePublishedAt && (
                    <div className="mt-2 text-xs text-amber-700">Publish timetable before publishing notice.</div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs text-slate-500">Notice</div>
                      <div className="text-sm font-semibold text-slate-800">
                        {noticePublishedAt ? `Published (${noticePublishedAt})` : "Not published"}
                      </div>
                    </div>
                    <Button
                      className="rounded-2xl"
                      style={{ background: BRAND.navy }}
                      disabled={!canPublish}
                      onClick={() => setNoticePublishedAt(todayISO())}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Publish notice
                    </Button>
                  </div>
                  {noticePublishedAt && (
                    <div className="mt-2 text-xs text-slate-600">
                      Earliest Gateway 1 summary date: <span className="font-medium">{earliestG1 ?? "—"}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="governance">
          <div className="space-y-4">
            <ShellHeader title="Governance" subtitle="Decision points, lead times, and bottlenecks." />
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                      Governance console
                    </CardTitle>
                    <CardDescription>Prototype list.</CardDescription>
                  </div>
                  <Button
                    className="rounded-2xl"
                    style={{ background: BRAND.navy }}
                    onClick={() =>
                      setDecisions((d) => [
                        ...d,
                        { id: uid("dec"), label: "New decision point", body: "Committee", leadWeeks: 4 },
                      ])
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {decisions.map((d) => (
                  <div key={d.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800 truncate">{d.label}</div>
                        <div className="text-xs text-slate-600">{d.body}</div>
                      </div>
                      <Badge variant="outline" className="text-slate-600 shrink-0">
                        {d.leadWeeks}w lead
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="space-y-4">
            <ShellHeader title="Notifications" subtitle="Segments, templates, and delivery log." />
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                      Campaigns
                    </CardTitle>
                    <CardDescription>Prototype.</CardDescription>
                  </div>
                  <Button
                    className="rounded-2xl"
                    style={{ background: BRAND.navy }}
                    onClick={() => setCampaigns((c) => [...c, { id: uid("camp"), name: "New campaign", status: "draft" }])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {campaigns.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800 truncate">{c.name}</div>
                        <div className="text-xs text-slate-600">Status: {c.status}</div>
                      </div>
                      <Button
                        variant="outline"
                        className="rounded-2xl border-slate-200 bg-white"
                        onClick={() =>
                          setCampaigns((arr) =>
                            arr.map((x) => (x.id === c.id ? { ...x, status: cycle(x.status) } : x))
                          )
                        }
                      >
                        Advance
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="g1">
          <GatewayWorkspace g={gateways.G1} update={(p) => patchGateway("G1", p)} readiness={readinessG1} />
          <div className="mt-3 rounded-2xl border border-slate-200 bg-white/70 p-3 text-sm text-slate-700">
            Publish the Gateway 1 summary (prototype):
            <Button
              variant="outline"
              className="ml-2 rounded-2xl border-slate-200 bg-white"
              onClick={() => patchGateway("G1", { status: "passed", publishedAt: todayISO() })}
              disabled={!readinessG1.ok}
            >
              Publish summary
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="g2">
          <GatewayWorkspace
            g={gateways.G2}
            update={(p) => patchGateway("G2", p)}
            readiness={readinessG2}
            onPublishAdvice={() => patchGateway("G2", { advicePublishedAt: nowStamp() })}
          />
        </TabsContent>

        <TabsContent value="g3">
          <GatewayWorkspace
            g={gateways.G3}
            update={(p) => patchGateway("G3", p)}
            readiness={readinessG3}
            onPublishAdvice={() => patchGateway("G3", { advicePublishedAt: nowStamp() })}
          />
        </TabsContent>

        <TabsContent value="submission">
          <div className="space-y-4">
            <ShellHeader title="Submission" subtitle="Assemble and submit to examination (enabled after G3 pass)" />
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                  Pack
                </CardTitle>
                <CardDescription>Prototype checklist.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <ChecklistItem label="Statement of compliance" />
                <ChecklistItem label="Statement of soundness" />
                <ChecklistItem label="Policy map" />
                <ChecklistItem label="Consultation summaries" />
                <Button
                  className="rounded-2xl"
                  style={{ background: BRAND.navy }}
                  disabled={gateways.G3.status !== "passed"}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Generate submission pack
                </Button>
                {gateways.G3.status !== "passed" && (
                  <div className="text-xs text-amber-700">Pass Gateway 3 to unlock submission.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
