"use client";

import React from "react";
import {
  type Pressure,
  type ReadingProfile,
  type Milestone,
  type ConsultationType,
  type Consultation,
  type GatewayType,
  type GatewayState,
  type EvidenceItem,
  type MonitoringSignal,
  type Plan,
  type Option,
} from "@/types";
import { uid, todayISO, addMonths } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

export function useAppData() {
  // Plans
  const [plans] = React.useState<Plan[]>([
    { id: "p1", authority: "Example Borough Council", name: "Local Plan 2045", status: "Drafting" },
    { id: "p2", authority: "Example Borough Council", name: "Town Centre SPD", status: "Draft" },
  ]);
  const [activePlanId, setActivePlanId] = React.useState(plans[0].id);
  const activePlan = plans.find((p) => p.id === activePlanId) ?? plans[0];

  // Reading profiles
  const readingProfiles: ReadingProfile[] = [
    {
      id: "balanced",
      label: "Balanced (policy-led)",
      summary: "Treats 'significant weight' to housing need, with precaution for irreversible environmental harm.",
      emphasis: [
        { k: "Housing delivery", v: "Strong" },
        { k: "Environmental harm", v: "High (conditional)" },
        { k: "Infrastructure risk", v: "Moderate" },
        { k: "Heritage", v: "Great weight; benefits test" },
      ],
      cues: [
        { phrase: "where appropriate", meaning: "Discretion cue" },
        { phrase: "significant weight", meaning: "Presumption cue" },
        { phrase: "unless material considerations…", meaning: "Override cue" },
      ],
      sources: [
        "NPPF: 'significant weight' for housing delivery",
        "Draft plan: 'where appropriate' climate adaptation",
        "Heritage policy: 'great weight' to conservation",
      ],
    },
    {
      id: "delivery",
      label: "Delivery-leaning",
      summary: "Interprets 'significant weight' strongly and treats uncertainty as a reason to strengthen delivery evidence.",
      emphasis: [
        { k: "Housing delivery", v: "Very strong" },
        { k: "Infrastructure risk", v: "Higher tolerance" },
        { k: "Uncertainty", v: "Resolve via commitments" },
        { k: "Environmental harm", v: "High (conditional)" },
      ],
      cues: [
        { phrase: "significant weight", meaning: "Presumption cue (strong)" },
        { phrase: "should", meaning: "Expectation cue" },
        { phrase: "where possible", meaning: "Flex cue" },
      ],
      sources: ["Housing need evidence", "Delivery trajectory note", "NPPF housing paragraphs"],
    },
  ];
  const [readingId, setReadingId] = React.useState(readingProfiles[0].id);
  const reading = readingProfiles.find((r) => r.id === readingId) ?? readingProfiles[0];

  // Pressures
  const pressures: Pressure[] = [
    {
      id: "housing",
      title: "Housing delivery argument is fragile",
      severity: "High",
      accent: BRAND.accent,
      summary: "Small shifts in how 'significant' is read can change defensibility. Strengthen the evidence narrative now.",
      whyNow: ["Gateway 2 pack needs a clear story on delivery.", "Member questions focus on 'why here' and 'why now'."],
      impacts: ["Gateway 2 pack", "Option set", "Consultation narrative"],
      primaryRoute: "Policies → Vision & outcomes",
      optionsRoute: "Scenarios",
    },
    {
      id: "transport",
      title: "Transport sequencing risk needs tightening",
      severity: "Medium",
      accent: BRAND.navy,
      summary: "Current draft leaves phasing assumptions implicit. Make sequencing legible, even if provisional.",
      whyNow: ["Without a phasing story, options look arbitrary.", "Sequencing affects whether mitigation reads as credible."],
      impacts: ["Deliverability", "Gateway queries"],
      primaryRoute: "Places → Sites",
      optionsRoute: "Scenarios",
    },
  ];

  // Milestones
  const [milestones, setMilestones] = React.useState<Milestone[]>([
    { id: uid("ms"), label: "Publish timetable", date: todayISO(), kind: "programme" },
    { id: uid("ms"), label: "Publish notice", date: addMonths(todayISO(), 0), kind: "programme" },
    { id: uid("ms"), label: "Scoping consultation closes", date: addMonths(todayISO(), 1), kind: "consultation" },
    { id: uid("ms"), label: "Gateway 1 (earliest)", date: addMonths(todayISO(), 4), kind: "gateway" },
  ]);

  const [timetablePublishedAt, setTimetablePublishedAt] = React.useState<string | undefined>(undefined);
  const [noticePublishedAt, setNoticePublishedAt] = React.useState<string | undefined>(undefined);

  // Consultations
  const [consultations, setConsultations] = React.useState<Record<ConsultationType, Consultation>>({
    scoping: { id: uid("cons"), representations: [], summaryDraft: "", summaryPublishedAt: undefined },
    content: { id: uid("cons"), representations: [], summaryDraft: "", summaryPublishedAt: undefined },
    proposed: { id: uid("cons"), representations: [], summaryDraft: "", summaryPublishedAt: undefined },
  });

  const scopingEnd = undefined;

  // Gateways
  const [gateways, setGateways] = React.useState<Record<GatewayType, GatewayState>>({
    G1: { id: "G1", status: "not_started", actions: [] },
    G2: { id: "G2", status: "not_started", actions: [] },
    G3: { id: "G3", status: "not_started", actions: [] },
  });

  const g2AdvicePublished = Boolean(gateways.G2.advicePublishedAt);

  // Evidence
  const [evidence, setEvidence] = React.useState<EvidenceItem[]>([
    { id: uid("ev"), title: "Housing Needs Assessment", status: "final", tags: ["housing"], usedBy: ["Policy H1", "Gateway 2 pack"] },
    { id: uid("ev"), title: "Transport Modelling Note", status: "draft", tags: ["transport"], usedBy: ["Sites pipeline"] },
    { id: uid("ev"), title: "Landscape Sensitivity Study", status: "final", tags: ["landscape"], usedBy: ["Policy map", "Option workshop"] },
  ]);

  // Monitoring signals
  const [signals, setSignals] = React.useState<MonitoringSignal[]>([
    {
      id: uid("sig"),
      indicator: "Housing completions",
      baseline: "850 dpa",
      current: "720 dpa",
      target: "950 dpa",
      trend: "down",
      severity: "High",
      status: "watching",
      notes: "Early delivery slightly below expectation; review assumptions and pipeline.",
    },
    {
      id: uid("sig"),
      indicator: "Employment land take-up",
      baseline: "5 ha/yr",
      current: "6.2 ha/yr",
      target: "5 ha/yr",
      trend: "up",
      severity: "Low",
      status: "open",
      notes: "Performing above target. Monitor quarterly.",
    },
    {
      id: uid("sig"),
      indicator: "Biodiversity net gain",
      baseline: "8% net gain",
      current: "9.5% net gain",
      target: "10% net gain",
      trend: "stable",
      severity: "Medium",
      status: "open",
      notes: "On track to meet target. Continue monitoring.",
    },
  ]);

  // Options for decisions shell
  const [options, setOptions] = React.useState<Option[]>([
    {
      id: uid("opt"),
      label: "Option A: Dispersed growth",
      description: "Distribute development across existing settlements.",
      pros: [{ id: uid("pc"), text: "Supports vitality of smaller settlements" }],
      cons: [{ id: uid("pc"), text: "Higher per-unit infrastructure costs" }],
      variants: [],
    },
  ]);

  // Policies state
  const [visionOutcomesPublishedAt, setVisionOutcomesPublishedAt] = React.useState<string | undefined>(undefined);

  return {
    plans,
    activePlanId,
    setActivePlanId,
    activePlan,
    readingProfiles,
    readingId,
    setReadingId,
    reading,
    pressures,
    milestones,
    setMilestones,
    timetablePublishedAt,
    setTimetablePublishedAt,
    noticePublishedAt,
    setNoticePublishedAt,
    consultations,
    setConsultations,
    scopingEnd,
    gateways,
    setGateways,
    g2AdvicePublished,
    evidence,
    setEvidence,
    signals,
    setSignals,
    options,
    setOptions,
    visionOutcomesPublishedAt,
    setVisionOutcomesPublishedAt,
  };
}
