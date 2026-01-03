"use client";

import React from "react";
import { ShellHeader } from "@/components/shell-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, GitBranch, Trash2, Camera, Copy } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { uid, todayISO } from "@/lib/utils";
import type { Option, Variant } from "@/types";

interface ShellDecisionsProps {
  options: Option[];
  setOptions: (o: Option[]) => void;
}

export function ShellDecisions({ options, setOptions }: ShellDecisionsProps) {
  const [snapshots, setSnapshots] = React.useState<Array<{ id: string; name: string; date: string; optionCount: number }>>([
    { id: uid("snap"), name: "Baseline scenario", date: todayISO(), optionCount: 3 },
  ]);

  const addOption = () =>
    setOptions([
      ...options,
      {
        id: uid("opt"),
        label: "New option",
        description: "",
        pros: [],
        cons: [],
        variants: [],
      },
    ]);

  const removeOption = (id: string) => setOptions(options.filter((o) => o.id !== id));

  const updateOption = (id: string, patch: Partial<Option>) =>
    setOptions(options.map((o) => (o.id === id ? { ...o, ...patch } : o)));

  const addVariant = (optionId: string) => {
    const newVariant: Variant = { id: uid("var"), label: "New variant", tweaks: "", outcomes: "" };
    setOptions(
      options.map((o) => (o.id === optionId ? { ...o, variants: [...o.variants, newVariant] } : o))
    );
  };

  const updateVariant = (optionId: string, variantId: string, patch: Partial<Variant>) => {
    setOptions(
      options.map((o) =>
        o.id === optionId
          ? { ...o, variants: o.variants.map((v) => (v.id === variantId ? { ...v, ...patch } : v)) }
          : o
      )
    );
  };

  const removeVariant = (optionId: string, variantId: string) => {
    setOptions(
      options.map((o) => (o.id === optionId ? { ...o, variants: o.variants.filter((v) => v.id !== variantId) } : o))
    );
  };

  const addProCon = (optionId: string, type: "pros" | "cons", text: string) => {
    setOptions(
      options.map((o) => (o.id === optionId ? { ...o, [type]: [...o[type], { id: uid("pc"), text }] } : o))
    );
  };

  const removeProCon = (optionId: string, type: "pros" | "cons", itemId: string) => {
    setOptions(
      options.map((o) =>
        o.id === optionId ? { ...o, [type]: o[type].filter((x) => x.id !== itemId) } : o
      )
    );
  };

  const createSnapshot = () => {
    setSnapshots((s) => [
      ...s,
      { id: uid("snap"), name: `Snapshot ${s.length + 1}`, date: todayISO(), optionCount: options.length },
    ]);
  };

  return (
    <div className="space-y-4">
      <ShellHeader title="Decisions" subtitle="Options analysis, variants, and scenario modeling" />

      <Tabs defaultValue="options" className="w-full">
        <TabsList className="bg-white/70 border border-slate-200 rounded-2xl">
          <TabsTrigger value="options">Options</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
          <TabsTrigger value="snapshots">Snapshots</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="options">
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                      Options ({options.length})
                    </CardTitle>
                    <CardDescription>Define and evaluate strategic options.</CardDescription>
                  </div>
                  <Button className="rounded-2xl" style={{ background: BRAND.navy }} onClick={addOption}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add option
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {options.map((opt) => (
                  <div key={opt.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <Input
                          value={opt.label}
                          onChange={(e) => updateOption(opt.id, { label: e.target.value })}
                          className="font-semibold mb-2"
                          placeholder="Option name"
                        />
                        <Textarea
                          value={opt.description}
                          onChange={(e) => updateOption(opt.id, { description: e.target.value })}
                          rows={2}
                          placeholder="Description..."
                          className="text-sm border-slate-200"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-2xl border-slate-200"
                        onClick={() => removeOption(opt.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 mb-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-semibold text-green-700">Pros</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addProCon(opt.id, "pros", "New benefit")}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        {opt.pros.map((p) => (
                          <div key={p.id} className="flex items-start gap-2">
                            <Input
                              value={p.text}
                              onChange={(e) =>
                                updateOption(opt.id, {
                                  pros: opt.pros.map((x) => (x.id === p.id ? { ...x, text: e.target.value } : x)),
                                })
                              }
                              className="flex-1 h-8 text-xs"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProCon(opt.id, "pros", p.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-semibold text-red-700">Cons</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addProCon(opt.id, "cons", "New drawback")}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        {opt.cons.map((c) => (
                          <div key={c.id} className="flex items-start gap-2">
                            <Input
                              value={c.text}
                              onChange={(e) =>
                                updateOption(opt.id, {
                                  cons: opt.cons.map((x) => (x.id === c.id ? { ...x, text: e.target.value } : x)),
                                })
                              }
                              className="flex-1 h-8 text-xs"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProCon(opt.id, "cons", c.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <GitBranch className="h-4 w-4" style={{ color: BRAND.teal }} />
                          <span className="text-xs font-semibold text-slate-700">
                            Variants ({opt.variants.length})
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-2xl border-slate-200"
                          onClick={() => addVariant(opt.id)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                      {opt.variants.map((v) => (
                        <div key={v.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 mb-2">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Input
                              value={v.label}
                              onChange={(e) => updateVariant(opt.id, v.id, { label: e.target.value })}
                              className="flex-1 h-8 text-xs font-semibold bg-white"
                              placeholder="Variant name"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeVariant(opt.id, v.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <Input
                            value={v.tweaks}
                            onChange={(e) => updateVariant(opt.id, v.id, { tweaks: e.target.value })}
                            className="mb-2 h-8 text-xs bg-white"
                            placeholder="Key tweaks..."
                          />
                          <Textarea
                            value={v.outcomes}
                            onChange={(e) => updateVariant(opt.id, v.id, { outcomes: e.target.value })}
                            rows={2}
                            placeholder="Expected outcomes..."
                            className="text-xs bg-white border-slate-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compare">
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                  Side-by-side comparison
                </CardTitle>
                <CardDescription>Compare all options at a glance.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {options.map((opt) => (
                    <div key={opt.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                      <div className="text-sm font-semibold text-slate-800 mb-2">{opt.label}</div>
                      <div className="text-xs text-slate-600 mb-2 line-clamp-2">{opt.description}</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                          {opt.pros.length} pros
                        </Badge>
                        <Badge variant="outline" className="text-red-700 border-red-200 bg-red-50">
                          {opt.cons.length} cons
                        </Badge>
                        {opt.variants.length > 0 && (
                          <Badge variant="outline" className="text-slate-600">
                            {opt.variants.length} variants
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {options.length === 0 && (
                  <div className="text-center text-slate-600 py-8">No options to compare yet.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="snapshots">
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                      Snapshots
                    </CardTitle>
                    <CardDescription>Save and restore option sets for scenario testing.</CardDescription>
                  </div>
                  <Button className="rounded-2xl" style={{ background: BRAND.navy }} onClick={createSnapshot}>
                    <Camera className="h-4 w-4 mr-2" />
                    Create snapshot
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {snapshots.map((snap) => (
                  <div key={snap.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{snap.name}</div>
                        <div className="text-xs text-slate-600">
                          {snap.date} · {snap.optionCount} options
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-2xl border-slate-200">
                        <Copy className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
