// Export all full-featured shell components
export { ShellHome } from "./shell-home";
export { ShellProgramme } from "./shell-programme";
export { ShellPolicies } from "./shell-policies";
export { ShellPlaces } from "./shell-places";
export { ShellEngage } from "./shell-engage";
export { ShellDecisions } from "./shell-decisions";
export { ShellMonitoring } from "./shell-monitoring";

// Evidence shell remains as placeholder
import React from "react";
import { ShellHeader } from "@/components/shell-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export function ShellEvidence({ evidence, setEvidence }: any) {
  const [query, setQuery] = React.useState("");
  const filtered = evidence.filter((e: any) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      e.title.toLowerCase().includes(q) ||
      e.tags.join(" ").toLowerCase().includes(q) ||
      e.usedBy.join(" ").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <ShellHeader title="Evidence" subtitle="A shared library used across the plan process" />
      <Card className="border-slate-200 bg-white/70">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base text-[#2a3a60]">Library</CardTitle>
              <CardDescription>Search by title, tags, or used-by links</CardDescription>
            </div>
            <Button className="rounded-2xl bg-[#2a3a60]">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search evidence…" />
          <div className="grid gap-2">
            {filtered.map((e: any) => (
              <div key={e.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="text-sm font-semibold text-slate-800">{e.title}</div>
                <div className="mt-1 text-xs text-slate-600">Tags: {e.tags.join(", ")}</div>
                <div className="text-xs text-slate-600">Status: {e.status}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
