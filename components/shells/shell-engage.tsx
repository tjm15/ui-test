"use client";

import React from "react";
import { ShellHeader } from "@/components/shell-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Send, FileText, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { uid, todayISO } from "@/lib/utils";
import type { ConsultationType, Consultation, Representation } from "@/types";

interface ShellEngageProps {
  consultations: Record<ConsultationType, Consultation>;
  setConsultations: (c: Record<ConsultationType, Consultation>) => void;
}

function RepresentationCard({
  rep,
  onUpdateStatus,
}: {
  rep: Representation;
  onUpdateStatus: (status: "unread" | "triaged" | "summarized") => void;
}) {
  const statusColor =
    rep.status === "summarized" ? "bg-green-50 text-green-700 border-green-200" : rep.status === "triaged" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4" style={{ color: BRAND.navy }} />
            <span className="text-sm font-semibold text-slate-800">{rep.respondent}</span>
            <Badge variant="outline" className={statusColor}>
              {rep.status}
            </Badge>
          </div>
          <div className="text-xs text-slate-600 mb-2">Received: {rep.receivedAt}</div>
          <div className="text-sm text-slate-700 line-clamp-2">{rep.summary}</div>
        </div>
        <div className="flex gap-1">
          {rep.status === "unread" && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-2xl border-slate-200"
              onClick={() => onUpdateStatus("triaged")}
            >
              Triage
            </Button>
          )}
          {rep.status === "triaged" && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-2xl border-slate-200"
              onClick={() => onUpdateStatus("summarized")}
            >
              Summarize
            </Button>
          )}
          {rep.status === "summarized" && (
            <Button variant="outline" size="sm" className="rounded-2xl border-slate-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ShellEngage({ consultations, setConsultations }: ShellEngageProps) {
  const [activeConsultation, setActiveConsultation] = React.useState<ConsultationType>("scoping");

  const cons = consultations[activeConsultation];

  const updateConsultation = (type: ConsultationType, patch: Partial<Consultation>) =>
    setConsultations({ ...consultations, [type]: { ...consultations[type], ...patch } });

  const addRepresentation = () => {
    const newRep: Representation = {
      id: uid("rep"),
      respondent: "New respondent",
      receivedAt: todayISO(),
      summary: "Summary of representation...",
      status: "unread",
    };
    updateConsultation(activeConsultation, { representations: [...cons.representations, newRep] });
  };

  const updateRepStatus = (repId: string, status: "unread" | "triaged" | "summarized") => {
    updateConsultation(activeConsultation, {
      representations: cons.representations.map((r) => (r.id === repId ? { ...r, status } : r)),
    });
  };

  const stats = {
    total: cons.representations.length,
    unread: cons.representations.filter((r) => r.status === "unread").length,
    triaged: cons.representations.filter((r) => r.status === "triaged").length,
    summarized: cons.representations.filter((r) => r.status === "summarized").length,
  };

  const canPublish = stats.total > 0 && stats.unread === 0;

  return (
    <div className="space-y-4">
      <ShellHeader title="Engage" subtitle="Manage consultations and representations" />

      <Card className="border-slate-200 bg-white/70">
        <CardHeader>
          <CardTitle className="text-base" style={{ color: BRAND.navy }}>
            Select consultation
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex gap-2 flex-wrap">
          {(["scoping", "content", "proposed"] as ConsultationType[]).map((type) => (
            <Button
              key={type}
              variant={activeConsultation === type ? "default" : "outline"}
              className="rounded-2xl"
              style={activeConsultation === type ? { background: BRAND.navy } : undefined}
              onClick={() => setActiveConsultation(type)}
            >
              {type === "scoping" ? "Scoping" : type === "content" ? "Content & evidence" : "Proposed plan"}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Tabs defaultValue="representations" className="w-full">
        <TabsList className="bg-white/70 border border-slate-200 rounded-2xl">
          <TabsTrigger value="representations">Representations</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="representations">
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                      Representations ({stats.total})
                    </CardTitle>
                    <CardDescription>
                      Unread: {stats.unread} · Triaged: {stats.triaged} · Summarized: {stats.summarized}
                    </CardDescription>
                  </div>
                  <Button className="rounded-2xl" style={{ background: BRAND.navy }} onClick={addRepresentation}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {cons.representations.length === 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600">
                    No representations yet.
                  </div>
                )}
                {cons.representations.map((rep) => (
                  <RepresentationCard key={rep.id} rep={rep} onUpdateStatus={(s) => updateRepStatus(rep.id, s)} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary">
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                      Consultation summary
                    </CardTitle>
                    <CardDescription>Aggregate and synthesize representations.</CardDescription>
                  </div>
                  {cons.summaryPublishedAt && (
                    <Badge variant="outline" className="text-slate-600">
                      Published: {cons.summaryPublishedAt}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <Textarea
                  placeholder="Write consultation summary..."
                  rows={8}
                  className="rounded-2xl border-slate-200 bg-white"
                  defaultValue={cons.summaryDraft || ""}
                  onBlur={(e) => updateConsultation(activeConsultation, { summaryDraft: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button
                    className="rounded-2xl"
                    style={{ background: BRAND.navy }}
                    disabled={!canPublish}
                    onClick={() => updateConsultation(activeConsultation, { summaryPublishedAt: todayISO() })}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Publish summary
                  </Button>
                  {!canPublish && (
                    <div className="flex items-center gap-2 text-xs text-amber-700">
                      <AlertTriangle className="h-4 w-4" />
                      Process all representations before publishing
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                  Thematic analysis
                </CardTitle>
                <CardDescription>Group representations by topic and sentiment.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-semibold text-green-900">Supportive</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                      {cons.representations.filter((r) => r.summary.toLowerCase().includes("support")).length}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span className="text-xs font-semibold text-amber-900">Concerns</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-900">
                      {cons.representations.filter((r) => r.summary.toLowerCase().includes("concern")).length}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-xs font-semibold text-red-900">Objections</span>
                    </div>
                    <div className="text-2xl font-bold text-red-900">
                      {cons.representations.filter((r) => r.summary.toLowerCase().includes("object")).length}
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-800 mb-2">Common themes</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-slate-600">
                      Housing delivery
                    </Badge>
                    <Badge variant="outline" className="text-slate-600">
                      Transport infrastructure
                    </Badge>
                    <Badge variant="outline" className="text-slate-600">
                      Green spaces
                    </Badge>
                    <Badge variant="outline" className="text-slate-600">
                      Climate action
                    </Badge>
                    <Badge variant="outline" className="text-slate-600">
                      Heritage protection
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
