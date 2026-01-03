# Home Shell — Diffusion Mode Implementation

## Overview

The Home shell has been updated to implement **Diffusion Mode** — a continuously shifting attention surface that surfaces multiple, overlapping signals whose visual prominence rises and falls as backend conditions evolve.

## Core Principle

Home does **NOT**:
- Pick a single dominant card
- Resolve attention into one primary message
- Behave like a summary report

Home **DOES**:
- Allow multiple areas to intensify simultaneously
- Let attention diffuse across cards
- Surface tension through overlap, not ranking

**Visual emphasis is additive, not exclusive.**

## Architecture

### 1. Fixed Layout Geometry

The Home layout is ALWAYS a 2×3 grid:

```
┌──────────────────┬───────────────────────────┬───────────────────────────────┐
│ Programme         │ Plan Content               │ Scrutiny & Exposure           │
├──────────────────┼───────────────────────────┼───────────────────────────────┤
│ Evidence          │ Places                     │ Scenarios Snapshot            │
└──────────────────┴───────────────────────────┴───────────────────────────────┘
```

Cards **NEVER** resize, move, or reorder. Diffusion happens through visual treatment only.

### 2. Intensity Model

Each card receives an independent intensity value:

```typescript
type CardIntensity = 0 | 1 | 2 | 3;

type HomeCardIntensities = {
  programme: CardIntensity;
  planContent: CardIntensity;
  scrutiny: CardIntensity;
  evidence: CardIntensity;
  places: CardIntensity;
  scenarios: CardIntensity;
};
```

**Intensity Levels:**
- **0 (Dormant)**: Muted background, low-contrast text, minimal accent
- **1 (Active)**: Normal contrast, standard borders, numbers and chips visible
- **2 (Pressing)**: Warmer background tint, stronger borders, numbers slightly larger, keywords bolded
- **3 (Acute)**: Distinct colour field (amber/red/teal), subtle animated texture, tightened spacing, slow pulse animation

Multiple cards may be at level 2–3 simultaneously.

### 3. Visual Treatment System

The `getIntensityStyles()` function returns consistent styling for each intensity level:

```typescript
{
  card: string;      // Card background and border classes
  header: string;    // Header text styling
  text: string;      // Body text styling  
  accent: string;    // Accent element styling
  pulse: string;     // Animation class (empty except at level 3)
}
```

All transitions use `duration-700` for smooth, theatrical shifts.

## Card-Specific Behaviours

### Programme
**Intensity rises with:** gate proximity, unresolved blocking, timetable drift

**Visual effects:**
- Gate icons glow independently (at level 3)
- Dates become warmer (border color shifts to amber)
- Blocking text becomes bold
- Stage label enlarges

### Plan Content
**Intensity rises with:** uneven section maturity, high churn, mismatch with Places or Evidence

**Visual effects:**
- Changed sections highlighted (amber background overlay)
- Incomplete counts visually heavier
- Count numbers enlarge and bold

### Scrutiny & Exposure
**Intensity rises with:** conflicting signals, reading sensitivity, gateway proximity

**Visual effects:**
- Severity words sharpen visually (font weight increase)
- Background warms (red tint increases)
- Chips cluster tighter (gap reduces from `gap-1` to `gap-0.5`)

### Evidence
**Intensity rises with:** critical gaps, evidence relied upon by multiple domains

**Visual effects:**
- Missing count enlarges dramatically (text-xl → text-2xl → text-3xl)
- Missing items visually "float" forward (scale-110 transform)
- Other counts fade (opacity-60)

### Places
**Intensity rises with:** allocation dependencies, unresolved mitigation, spatial-policy mismatch

**Visual effects:**
- Pipeline segmentation sharpens (border thickens)
- Risk items gain color weight (amber → red)
- Text becomes bolder

### Scenarios Snapshot
**Intensity rises with:** scenario churn, narrowing option space, stale scenarios under changing state

**Visual effects:**
- Envelope chips pulse
- Stale count changes color (slate → red) and pulses
- Breadth indicator color shifts (amber → red)

## Animation System

### Slow Pulse
Applied at intensity level 3 for theatrical effect:

```css
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Drop Shadow Glow
Applied to gate icons at intensity level 3:

```css
.drop-shadow-glow {
  filter: drop-shadow(0 0 2px currentColor);
}
```

## Setting Intensity Values

Intensity values are calculated in the application layer (see [page.tsx](app/page.tsx)) based on:

1. **Programme**: Gate status, blocking count, drift level, date proximity
2. **Plan Content**: Churn metrics, section maturity, policy completion
3. **Scrutiny**: Pressure severity, reading sensitivity, gate proximity
4. **Evidence**: Missing count, critical missing items
5. **Places**: Allocation risk, pipeline progression, gap count
6. **Scenarios**: Active vs stale ratio, breadth indicator, option space

These calculations should be **backend-driven** and respond to:
- Policy edits
- Site stage changes
- Evidence status updates
- Consultation summaries
- Reading changes
- Time passage near gates

## Interaction Model

- Home is **read-only**
- Cards link outward (entire card is clickable) but do not expand
- No CTAs, no "fix" buttons, no "generate" actions
- Interaction is navigation only

## Success Criteria

Home should feel:
- **Restless** — never fully resolved
- **Intellectually active** — multiple pressures visible
- **Resistant to closure** — tension is the point

A user should sense: *"This plan is under multiple, shifting pressures — and I can feel where."*

## Implementation Notes

1. **No popups or global alerts** — all signalling happens in-card
2. **No invented terminology** — all labels are backend- or user-defined
3. **Transitions are smooth** — 700ms duration for all intensity changes
4. **Multiple simultaneous intensities** — emphasis is additive, not exclusive
5. **Cards never disappear** — dormant (level 0) cards remain visible but muted

## Future Enhancements

Consider implementing:
1. **Real-time intensity calculation** — compute intensity from live data changes
2. **Intensity history tracking** — show when a card last changed intensity
3. **User intensity overrides** — allow manual attention prioritization
4. **Intensity analytics** — track which cards remain at high intensity longest
5. **Backend event streaming** — update intensities without full page refresh
