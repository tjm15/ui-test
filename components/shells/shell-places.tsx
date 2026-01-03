"use client";

import React from "react";
import { ShellHeader } from "@/components/shell-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, MapPin, Trash2, ChevronRight } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { uid } from "@/lib/utils";

interface Site {
  id: string;
  ref: string;
  name: string;
  stage: "identify" | "assess" | "allocate";
  area: number;
  capacity?: number;
  notes: string;
}

interface ShellPlacesProps {}

export function ShellPlaces({}: ShellPlacesProps) {
  const [sites, setSites] = React.useState<Site[]>([
    { id: uid("site"), ref: "LAA001", name: "Former factory site, High Street", stage: "allocate", area: 2.5, capacity: 80, notes: "Brownfield, excellent transport links" },
    { id: uid("site"), ref: "LAA002", name: "Land north of Station Road", stage: "assess", area: 5.0, notes: "Greenfield, requires infrastructure" },
    { id: uid("site"), ref: "LAA003", name: "Former depot, Mill Lane", stage: "identify", area: 1.2, notes: "Potential contamination" },
  ]);

  const [policies, setPolicies] = React.useState([
    { id: uid("pol"), code: "SP1", title: "Spatial strategy", color: "#329c85" },
    { id: uid("pol"), code: "SP2", title: "Strategic allocations", color: "#f5c315" },
    { id: uid("pol"), code: "H1", title: "Housing delivery", color: "#2a3a60" },
  ]);

  const [tasks, setTasks] = React.useState([
    { id: uid("task"), title: "Update Habitat Regulations Assessment", owner: "Environment team", status: "in_progress" as const },
    { id: uid("task"), title: "Strategic Flood Risk Assessment addendum", owner: "Technical team", status: "not_started" as const },
    { id: uid("task"), title: "Heritage Impact Assessment for LAA001", owner: "Heritage consultant", status: "done" as const },
  ]);

  const addSite = () =>
    setSites((s) => [...s, { id: uid("site"), ref: `LAA${String(s.length + 1).padStart(3, "0")}`, name: "New site", stage: "identify", area: 0, notes: "" }]);

  const removeSite = (id: string) => setSites((s) => s.filter((x) => x.id !== id));

  const updateSite = (id: string, patch: Partial<Site>) =>
    setSites((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const advanceStage = (id: string) =>
    setSites((s) =>
      s.map((x) => {
        if (x.id !== id) return x;
        const next = x.stage === "identify" ? "assess" : x.stage === "assess" ? "allocate" : x.stage;
        return { ...x, stage: next };
      })
    );

  const addTask = () => setTasks((t) => [...t, { id: uid("task"), title: "New task", owner: "Team", status: "not_started" }]);

  const stageLabel = (s: "identify" | "assess" | "allocate") =>
    s === "identify" ? "Identify" : s === "assess" ? "Assess" : "Allocate";

  return (
    <Tabs defaultValue="sites" className="w-full">
      <TabsList className="bg-white/70 border border-slate-200 rounded-2xl">
        <TabsTrigger value="sites">Sites pipeline</TabsTrigger>
        <TabsTrigger value="map">Policy map</TabsTrigger>
        <TabsTrigger value="environment">Environment</TabsTrigger>
      </TabsList>

      <div className="mt-4">
        <TabsContent value="sites">
          <div className="space-y-4">
            <ShellHeader title="Sites pipeline" subtitle="Identify, assess, and allocate development sites" />
            
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                      Land availability assessment
                    </CardTitle>
                    <CardDescription>Track sites through the assessment process.</CardDescription>
                  </div>
                  <Button className="rounded-2xl" style={{ background: BRAND.navy }} onClick={addSite}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add site
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {sites.map((site) => (
                  <div key={site.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 mt-1" style={{ color: BRAND.teal }} />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <Input
                                value={site.ref}
                                onChange={(e) => updateSite(site.id, { ref: e.target.value })}
                                className="w-24 h-8 text-xs font-mono"
                              />
                              <Input
                                value={site.name}
                                onChange={(e) => updateSite(site.id, { name: e.target.value })}
                                className="font-semibold"
                              />
                            </div>
                            <Textarea
                              value={site.notes}
                              onChange={(e) => updateSite(site.id, { notes: e.target.value })}
                              rows={2}
                              placeholder="Notes..."
                              className="mt-2 text-sm border-slate-200"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-2xl border-slate-200"
                            onClick={() => removeSite(site.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-600">Area:</span>
                            <Input
                              type="number"
                              value={site.area}
                              onChange={(e) => updateSite(site.id, { area: parseFloat(e.target.value) || 0 })}
                              className="w-20 h-8 text-xs"
                            />
                            <span className="text-xs text-slate-600">ha</span>
                          </div>
                          {site.stage === "allocate" && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-600">Capacity:</span>
                              <Input
                                type="number"
                                value={site.capacity ?? 0}
                                onChange={(e) => updateSite(site.id, { capacity: parseInt(e.target.value) || 0 })}
                                className="w-20 h-8 text-xs"
                              />
                              <span className="text-xs text-slate-600">dwellings</span>
                            </div>
                          )}
                          <Badge variant="outline" className="text-slate-600">
                            {stageLabel(site.stage)}
                          </Badge>
                          {site.stage !== "allocate" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-2xl border-slate-200"
                              onClick={() => advanceStage(site.id)}
                            >
                              <ChevronRight className="h-4 w-4 mr-1" />
                              Advance
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="map">
          <div className="space-y-4">
            <ShellHeader title="Policy map" subtitle="Spatial representation of policies and allocations" />
            
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                  Policy layers
                </CardTitle>
                <CardDescription>Define map layers for spatial policies.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {policies.map((pol) => (
                  <div key={pol.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ background: pol.color }} />
                      <Input value={pol.code} className="w-20 h-8 text-xs font-mono" readOnly />
                      <Input value={pol.title} className="flex-1 font-semibold" readOnly />
                      <Button variant="outline" size="sm" className="rounded-2xl border-slate-200">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full rounded-2xl border-slate-200 bg-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add layer
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                  Map preview
                </CardTitle>
                <CardDescription>Interactive map (placeholder).</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="rounded-2xl border border-slate-200 bg-slate-100 h-96 flex items-center justify-center">
                  <div className="text-slate-500 text-sm">Map canvas (integrate GIS)</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="environment">
          <div className="space-y-4">
            <ShellHeader title="Environment" subtitle="Assessments, mitigations, and monitoring" />
            
            <Card className="border-slate-200 bg-white/70">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base" style={{ color: BRAND.navy }}>
                      Task tracker
                    </CardTitle>
                    <CardDescription>Environmental assessments and technical studies.</CardDescription>
                  </div>
                  <Button className="rounded-2xl" style={{ background: BRAND.navy }} onClick={addTask}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-800">{task.title}</div>
                        <div className="text-xs text-slate-600 mt-1">{task.owner}</div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          task.status === "done"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : task.status === "in_progress"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "text-slate-600"
                        }
                      >
                        {task.status === "done" ? "Done" : task.status === "in_progress" ? "In progress" : "Not started"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
