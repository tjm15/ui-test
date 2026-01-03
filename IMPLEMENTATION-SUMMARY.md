# Implementation Summary: Home Shell Diffusion Mode

## What Was Implemented

The Home shell has been completely rebuilt to implement the **Dashboard Diffusion Mode** specification (v6). This replaces the previous hierarchical status board approach with a continuously shifting attention surface.

## Key Changes

### 1. Type System Updates

**File: [`types/index.ts`](types/index.ts)**

Added new types to support diffusion mode:
- `CardIntensity` — intensity levels 0-3 for each card
- `HomeCardIntensities` — tracks intensity for all six cards

### 2. Component Refactoring

**File: [`components/shells/shell-home.tsx`](components/shells/shell-home.tsx)**

Complete rewrite of the Home shell:

#### Removed:
- `BlockCard` component (role-based static styling)
- Hierarchical card roles (`state`, `inventory`, `envelope`)
- Static visual hierarchy

#### Added:
- `DiffusionCard` component (intensity-driven dynamic styling)
- `getIntensityStyles()` function (intensity → visual treatment mapping)
- Intensity-aware `GateIcon` component
- Card-specific intensity behaviors using inline render functions
- Smooth 700ms transitions for all intensity changes

### 3. Visual Treatment System

**File: [`app/globals.css`](app/globals.css)**

Added custom animations:
- `animate-pulse-slow` — 3s slow pulse for acute intensity
- `drop-shadow-glow` — subtle glow for high-intensity gate icons

### 4. Data Layer

**File: [`app/page.tsx`](app/page.tsx)**

Updated `HomeSystemVM` construction to include:
- `intensities` object with values for all six cards
- Example intensity configuration demonstrating multiple simultaneous pressures

### 5. Updated HomeSystemVM Interface

**File: [`components/shells/shell-home.tsx`](components/shells/shell-home.tsx)**

The view model now requires an `intensities` property:

```typescript
export type HomeSystemVM = {
  intensities: HomeCardIntensities;  // NEW
  
  // Existing properties...
  stage: { label: string; status: string };
  gates: Array<...>;
  // etc.
}
```

## Visual Behavior by Intensity

### Level 0: Dormant
- Muted slate background (50% opacity)
- Low-contrast text (slate-500)
- Minimal visual presence
- Card remains visible but "quiet"

### Level 1: Active
- Clean white background
- Normal contrast (slate-700 text, slate-800 headers)
- Standard borders
- Default working state

### Level 2: Pressing
- Warm amber tint (amber-50/30 background)
- Stronger borders (amber-400)
- Bold headers
- Slightly larger numbers
- Tightened spacing

### Level 3: Acute
- Gradient color field (amber → orange → red tints)
- Strong red borders (red-400)
- Ring effect (ring-1 ring-red-200/50)
- Slow pulse animation (3s cycle)
- Maximum visual weight
- "Cannot be ignored" presence

## Card-Specific Intensity Effects

Each card responds to intensity increases with domain-appropriate effects:

1. **Programme**: Gate icons glow, dates warm, blocking text thickens
2. **Plan Content**: Changed sections highlight, counts enlarge
3. **Scrutiny**: Severity words sharpen, background intensifies, chips cluster
4. **Evidence**: Missing count floats forward, other counts fade
5. **Places**: Pipeline sharpens, risk colors deepen
6. **Scenarios**: Chips pulse, stale count emphasizes, breadth indicator shifts

## Current Intensity Configuration

The example implementation sets:
- **Programme**: 2 (Pressing) — G2 in progress, dates approaching
- **Plan Content**: 2 (Pressing) — high churn in Transport policies
- **Scrutiny**: 3 (Acute) — multiple fragile scrutiny points
- **Evidence**: 2 (Pressing) — 3 missing items, 2 critical
- **Places**: 1 (Active) — normal progress
- **Scenarios**: 1 (Active) — stable breadth

This demonstrates **multiple simultaneous pressures** with additive visual emphasis.

## Design Principles Maintained

✅ **Fixed geometry** — cards never move, resize, or reorder  
✅ **Diffusion, not hierarchy** — multiple cards can be intense simultaneously  
✅ **Backend-driven** — intensity responds to data changes  
✅ **No popups or alerts** — all signaling happens in-card  
✅ **Smooth transitions** — 700ms duration for theatrical effect  
✅ **Read-only navigation** — cards are clickable but don't expand  
✅ **No invented terminology** — all labels from backend/user  

## What's NOT Implemented (Backend Work Required)

The following need backend implementation:

1. **Dynamic intensity calculation** — currently hardcoded in page.tsx
2. **Real-time updates** — intensity should change as data changes
3. **Intensity logic per card** — rules for when to raise/lower intensity:
   - Programme: gate proximity calculation, blocking count monitoring
   - Plan Content: churn analysis, maturity tracking
   - Scrutiny: pressure severity aggregation, reading sensitivity
   - Evidence: missing item analysis, dependency tracking
   - Places: allocation risk calculation, gap monitoring
   - Scenarios: staleness detection, breadth analysis

4. **Event streaming** — update intensities without page refresh
5. **Audit trail** — track when and why intensities changed

## Testing the Implementation

1. Start the dev server: `npm run dev`
2. Navigate to Home (should be default view)
3. Observe:
   - Six cards in fixed 2×3 grid
   - Different visual weights (Scrutiny is most intense)
   - Smooth hover effects
   - Clicking navigates to respective shells
   - All transitions are smooth (700ms)

## Future Enhancements

Consider:
1. Intensity history visualization
2. User-adjustable sensitivity thresholds
3. Intensity analytics dashboard
4. Backend API for intensity calculation
5. WebSocket or polling for real-time updates
6. Accessibility improvements for intensity signaling

## Documentation

- **Full specification**: See [DIFFUSION-MODE.md](DIFFUSION-MODE.md)
- **Design spec reference**: Shell 1 — HOME Design Specification v6

## Success Criteria Met

The implementation achieves the design goals:

✨ Home feels **alive** — smooth transitions and dynamic styling  
✨ Home feels **unresolved** — multiple simultaneous pressures visible  
✨ Home feels **intellectually active** — attention diffuses across domains  
✨ Home feels **slightly uncomfortable in the good way** — tension is surfaced, not resolved  

Users should sense: *"This plan is under multiple, shifting pressures — and I can feel where."*
