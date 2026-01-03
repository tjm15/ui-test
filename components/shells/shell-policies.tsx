"use client";

import React from "react";
import { ShellHeader } from "@/components/shell-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Send, Save } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { uid, todayISO } from "@/lib/utils";

interface Section {
  id: string;
  num: string;
  heading: string;
  body: string;
}

interface ShellPoliciesProps {
  visionOutcomesPublishedAt?: string;
  setVisionOutcomesPublishedAt: (d?: string) => void;
}

export function ShellPolicies({ visionOutcomesPublishedAt, setVisionOutcomesPublishedAt }: ShellPoliciesProps) {
  const [vision, setVision] = React.useState(
    "To create a resilient, inclusive, and sustainable community that prioritizes the wellbeing of all residents, preserves our natural environment, and promotes economic opportunity through thoughtful development."
  );

  const [outcomes, setOutcomes] = React.useState([
    { id: uid("out"), text: "Reduce carbon emissions by 40% by 2035" },
    { id: uid("out"), text: "Ensure 30% affordable housing in new developments" },
    { id: uid("out"), text: "Protect and enhance biodiversity across 15% of land area" },
    { id: uid("out"), text: "Create 5,000 new jobs in green industries" },
  ]);

  const [sections, setSections] = React.useState<Section[]>([
    {
      id: uid("sec"),
      num: "1",
      heading: "Climate and environment",
      body: "Policies to address climate change, reduce carbon emissions, and protect the natural environment.",
    },
    {
      id: uid("sec"),
      num: "2",
      heading: "Housing and development",
      body: "Policies to meet housing need, including affordable housing requirements and sustainable design standards.",
    },
    {
      id: uid("sec"),
      num: "3",
      heading: "Economy and employment",
      body: "Policies to support job creation, local businesses, and sustainable economic growth.",
    },
    {
      id: uid("sec"),
      num: "4",
      heading: "Transport and connectivity",
      body: "Policies to improve transport infrastructure, promote active travel, and reduce car dependency.",
    },
    {
      id: uid("sec"),
      num: "5",
      heading: "Health and wellbeing",
      body: "Policies to support community health, access to services, and quality of life.",
    },
  ]);

  const addOutcome = () => setOutcomes((o) => [...o, { id: uid("out"), text: "New outcome" }]);
  const removeOutcome = (id: string) => setOutcomes((o) => o.filter((x) => x.id !== id));
  const updateOutcome = (id: string, text: string) =>
    setOutcomes((o) => o.map((x) => (x.id === id ? { ...x, text } : x)));

  const addSection = () =>
    setSections((s) => [...s, { id: uid("sec"), num: `${s.length + 1}`, heading: "New section", body: "" }]);
  const removeSection = (id: string) => setSections((s) => s.filter((x) => x.id !== id));
  const updateSection = (id: string, patch: Partial<Section>) =>
    setSections((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <Tabs defaultValue="vision" className="w-full">
      <TabsList className="bg-white/70 border border-slate-200 rounded-2xl">
        <TabsTrigger value="vision">Vision & Outcomes</TabsTrigger>
        <TabsTrigger value="sections">Policy sections</TabsTrigger>
      </TabsList>

      <div className="mt-4">
        <TabsContent value="vision">
          <div className="space-y-4">
            <ShellHeader title="Vision & Outcomes" subtitle="Strategic direction and measurable outcomes" />
            
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                      Vision statement
                    </CardTitle>
                    <CardDescription>Overarching vision for the plan period.</CardDescription>
                  </div>
                  {visionOutcomesPublishedAt && (
                    <div className="text-xs text-slate-600">Published: {visionOutcomesPublishedAt}</div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <Textarea
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  rows={4}
                  className="rounded-2xl border-slate-200 bg-white"
                />
                <div className="flex gap-2">
                  <Button className="rounded-2xl" style={{ background: BRAND.navy }}>
                    <Save className="h-4 w-4 mr-2" />
                    Save draft
                  </Button>
                  <Button
                    className="rounded-2xl"
                    style={{ background: BRAND.teal }}
                    onClick={() => setVisionOutcomesPublishedAt(todayISO())}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Publish
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                      Strategic outcomes
                    </CardTitle>
                    <CardDescription>Measurable outcomes that the plan will deliver.</CardDescription>
                  </div>
                  <Button className="rounded-2xl" style={{ background: BRAND.navy }} onClick={addOutcome}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {outcomes.map((out, idx) => (
                  <div key={out.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="flex items-start gap-2">
                      <div className="text-sm font-semibold text-slate-600 mt-2">{idx + 1}.</div>
                      <Input
                        value={out.text}
                        onChange={(e) => updateOutcome(out.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-2xl border-slate-200"
                        onClick={() => removeOutcome(out.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sections">
          <div className="space-y-4">
            <ShellHeader title="Policy sections" subtitle="Organize policies into thematic sections" />
            
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                      Section editor
                    </CardTitle>
                    <CardDescription>Each section groups related policies.</CardDescription>
                  </div>
                  <Button className="rounded-2xl" style={{ background: BRAND.navy }} onClick={addSection}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add section
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {sections.map((sec) => (
                  <div key={sec.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <Input
                        value={sec.num}
                        onChange={(e) => updateSection(sec.id, { num: e.target.value })}
                        className="w-16"
                        placeholder="No."
                      />
                      <div className="flex-1 space-y-2">
                        <Input
                          value={sec.heading}
                          onChange={(e) => updateSection(sec.id, { heading: e.target.value })}
                          placeholder="Section heading"
                          className="font-semibold"
                        />
                        <Textarea
                          value={sec.body}
                          onChange={(e) => updateSection(sec.id, { body: e.target.value })}
                          rows={2}
                          placeholder="Overview of policies in this section..."
                          className="border-slate-200"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-2xl border-slate-200"
                        onClick={() => removeSection(sec.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex gap-2">
                <Button className="rounded-2xl" style={{ background: BRAND.navy }}>
                  <Save className="h-4 w-4 mr-2" />
                  Save draft
                </Button>
                <Button variant="outline" className="rounded-2xl border-slate-200 bg-white">
                  Preview
                </Button>
                <Button className="rounded-2xl" style={{ background: BRAND.teal }}>
                  <Send className="h-4 w-4 mr-2" />
                  Publish
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
