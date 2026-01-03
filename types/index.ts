export type ShellKey =
  | "home"
  | "programme"
  | "policies"
  | "places"
  | "evidence"
  | "engage"
  | "decisions"
  | "monitoring";

export type CardIntensity = 0 | 1 | 2 | 3;

export type StageKey =
  | "scoping"
  | "g1"
  | "content"
  | "g2"
  | "draft"
  | "g3"
  | "submission"
  | "exam"
  | "adoption"
  | "monitoring";

export type Severity = "High" | "Medium" | "Low";

export type Pressure = {
  id: string;
  title: string;
  severity: Severity;
  accent: string;
  summary: string;
  whyNow: string[];
  impacts: string[];
  primaryRoute: string;
  optionsRoute?: string;
};

export type ReadingProfile = {
  id: string;
  label: string;
  summary: string;
  emphasis: { k: string; v: string }[];
  cues: { phrase: string; meaning: string }[];
  sources: string[];
};

export type Milestone = {
  id: string;
  label: string;
  date: string;
  kind: "programme" | "consultation" | "gateway" | "decision";
};

export type ConsultationType = "scoping" | "content" | "proposed";

export type Consultation = {
  id: string;
  representations: Representation[];
  summaryDraft?: string;
  summaryPublishedAt?: string;
};

export type Representation = {
  id: string;
  respondent: string;
  receivedAt: string;
  summary: string;
  status: "unread" | "triaged" | "summarized";
};

export type GatewayType = "G1" | "G2" | "G3";

export type GatewayState = {
  id: GatewayType;
  status: "not_started" | "drafting" | "submitted" | "advice_received" | "passed" | "not_passed";
  publishedAt?: string;
  submittedAt?: string;
  adviceReceivedAt?: string;
  advicePublishedAt?: string;
  actions: { id: string; title: string; status: "open" | "done" }[];
};

export type Option = {
  id: string;
  label: string;
  description: string;
  pros: { id: string; text: string }[];
  cons: { id: string; text: string }[];
  variants: Variant[];
};

export type Variant = {
  id: string;
  label: string;
  tweaks: string;
  outcomes: string;
};

export type EvidenceItem = {
  id: string;
  title: string;
  status: "commissioned" | "draft" | "final" | "iterative";
  tags: string[];
  usedBy: string[];
};

export type MonitoringSignal = {
  id: string;
  indicator: string;
  baseline: string;
  current: string;
  target: string;
  trend: "up" | "down" | "stable";
  severity: Severity;
  status: "open" | "watching" | "closed";
  notes: string;
};

export type Plan = {
  id: string;
  authority: string;
  name: string;
  status: string;
};

export type HomeCardIntensities = {
  programme: CardIntensity;
  planContent: CardIntensity;
  scrutiny: CardIntensity;
  evidence: CardIntensity;
  places: CardIntensity;
  scenarios: CardIntensity;
};
