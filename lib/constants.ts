import type { ShellKey, StageKey } from "@/types";
import {
  Sparkles,
  GanttChartSquare,
  BookOpen,
  Map,
  Folder,
  Megaphone,
  Users,
  BarChart3,
  CheckCircle2,
  CircleDot,
  Circle,
  Lightbulb,
} from "lucide-react";

export const BRAND = {
  accent: "#f5c315",
  navy: "#2a3a60",
  bg: "#e6e6ef",
  teal: "#329c85",
  text: "#545c6d",
};

export const SHELLS: Array<{ key: ShellKey; label: string; icon: React.ElementType }> = [
  { key: "home", label: "Home", icon: Sparkles },
  { key: "programme", label: "Programme", icon: GanttChartSquare },
  { key: "policies", label: "Policies", icon: BookOpen },
  { key: "places", label: "Places", icon: Map },
  { key: "evidence", label: "Evidence", icon: Folder },
  { key: "engage", label: "Engage", icon: Megaphone },
  { key: "decisions", label: "Scenarios", icon: Lightbulb },
  { key: "monitoring", label: "Monitoring", icon: BarChart3 },
];

export const STAGES: Array<{ key: StageKey; label: string }> = [
  { key: "scoping", label: "Scoping" },
  { key: "g1", label: "G1" },
  { key: "content", label: "Content & Evidence" },
  { key: "g2", label: "G2" },
  { key: "draft", label: "Draft Plan" },
  { key: "g3", label: "G3" },
  { key: "submission", label: "Submission" },
  { key: "exam", label: "Exam" },
  { key: "adoption", label: "Adoption" },
  { key: "monitoring", label: "Monitoring" },
];

export const STAGE_DEFAULT: Record<StageKey, { shell: ShellKey }> = {
  scoping: { shell: "engage" },
  g1: { shell: "programme" },
  content: { shell: "engage" },
  g2: { shell: "programme" },
  draft: { shell: "policies" },
  g3: { shell: "programme" },
  submission: { shell: "programme" },
  exam: { shell: "decisions" },
  adoption: { shell: "decisions" },
  monitoring: { shell: "monitoring" },
};

export const STAGE_STATUS_ICONS = {
  done: CheckCircle2,
  active: CircleDot,
  upcoming: Circle,
};
