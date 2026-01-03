# Diffusion Mode Quick Reference

## Intensity Visual Guide

```
┌─────────────┬──────────────────────────────────────────────────────────────┐
│ Level       │ Visual Treatment                                              │
├─────────────┼──────────────────────────────────────────────────────────────┤
│ 0: Dormant  │ • bg-slate-50/40 (muted)                                     │
│             │ • opacity-70                                                  │
│             │ • text-slate-500 (low contrast)                              │
│             │ • Feels: "quiet but present"                                 │
├─────────────┼──────────────────────────────────────────────────────────────┤
│ 1: Active   │ • bg-white                                                    │
│             │ • border-slate-300                                            │
│             │ • text-slate-700                                              │
│             │ • Feels: "in play"                                           │
├─────────────┼──────────────────────────────────────────────────────────────┤
│ 2: Pressing │ • bg-amber-50/30 (warm tint)                                 │
│             │ • border-amber-400 (stronger)                                 │
│             │ • shadow-sm                                                   │
│             │ • font-bold headers                                           │
│             │ • Slightly larger numbers                                     │
│             │ • Tighter spacing (space-y-1)                                │
│             │ • Feels: "needs attention"                                   │
├─────────────┼──────────────────────────────────────────────────────────────┤
│ 3: Acute    │ • bg-gradient-to-br from-amber-100 via-orange-50 to-red-50  │
│             │ • border-red-400                                              │
│             │ • shadow-md                                                   │
│             │ • ring-1 ring-red-200/50                                      │
│             │ • animate-pulse-slow (3s cycle)                              │
│             │ • Maximum font weight                                         │
│             │ • Maximum visual emphasis                                     │
│             │ • Feels: "cannot be ignored"                                 │
└─────────────┴──────────────────────────────────────────────────────────────┘
```

## Card Layout (Fixed)

```
┌─────────────────────┬──────────────────────┬──────────────────────┐
│                     │                      │                      │
│    Programme        │   Plan Content       │  Scrutiny &          │
│                     │                      │  Exposure            │
│  • Stage label      │  • Policy status     │  • Scrutiny points   │
│  • Gateway icons    │  • Churn metrics     │  • Where it bites    │
│  • Next dates       │  • Section maturity  │  • Reading profile   │
│  • Blocking count   │                      │                      │
│  • Drift indicator  │                      │                      │
│                     │                      │                      │
├─────────────────────┼──────────────────────┼──────────────────────┤
│                     │                      │                      │
│    Evidence         │   Places             │  Scenarios           │
│                     │                      │  Snapshot            │
│  • Final count      │  • Sites pipeline    │  • Active count      │
│  • Draft count      │  • Allocation risk   │  • Stale count       │
│  • Missing count    │  • Map gaps          │  • Envelope chips    │
│  • Critical missing │                      │  • Breadth           │
│                     │                      │                      │
└─────────────────────┴──────────────────────┴──────────────────────┘

NEVER reorders, resizes, or moves — diffusion through styling only
```

## Intensity Response Rules

### Programme
```
rises with:
  ↑ gate proximity
  ↑ blocking count
  ↑ timetable drift

visual effect:
  → gate icons glow (level 3)
  → dates become warmer (amber borders)
  → blocking line thickens
  → stage label enlarges
```

### Plan Content
```
rises with:
  ↑ section churn
  ↑ maturity imbalance
  ↑ mismatch with Places/Evidence

visual effect:
  → changed sections highlighted (amber bg)
  → counts enlarge and bold
  → high churn area emphasized
```

### Scrutiny & Exposure
```
rises with:
  ↑ conflicting signals
  ↑ reading sensitivity
  ↑ gateway proximity

visual effect:
  → severity words sharpen (font weight ↑)
  → background warms (red tint ↑)
  → chips cluster tighter (gap ↓)
```

### Evidence
```
rises with:
  ↑ critical gaps
  ↑ evidence relied upon by multiple domains
  ↑ missing count

visual effect:
  → missing count enlarges (text-xl → 3xl)
  → missing items "float" forward (scale-110)
  → other counts fade (opacity-60)
```

### Places
```
rises with:
  ↑ allocation dependencies
  ↑ unresolved mitigation
  ↑ spatial-policy mismatch

visual effect:
  → pipeline segmentation sharpens (border thickens)
  → risk items gain color weight (amber → red)
  → text becomes bolder
```

### Scenarios Snapshot
```
rises with:
  ↑ scenario churn
  ↑ narrowing option space
  ↑ stale scenarios under changing state

visual effect:
  → envelope chips pulse
  → stale count dims or flashes
  → breadth indicator shifts visually
```

## Animation Timing

All transitions: `duration-700` (700ms)
- Smooth enough to feel theatrical
- Fast enough not to frustrate

Pulse animation: `3s` cycle
- Slow enough to be subtle
- Noticeable enough to draw attention

## Code Structure

```typescript
// Define intensity
intensities: {
  programme: 2,      // 0-3
  planContent: 2,
  scrutiny: 3,
  evidence: 2,
  places: 1,
  scenarios: 1,
}

// Get visual styles
const styles = getIntensityStyles(intensity);

// Apply with smooth transitions
<div className={`${styles.card} ${styles.pulse} transition-all duration-700`}>
  <span className={`${styles.header} transition-all duration-700`}>
    {text}
  </span>
</div>
```

## Key Functions

```typescript
getIntensityStyles(intensity: CardIntensity)
// Returns: { card, header, text, accent, pulse }

<DiffusionCard 
  title="Card Title"
  intensity={intensities.cardName}
  onOpen={() => navigate("shell")}
>
  {/* Card-specific content with inline intensity logic */}
</DiffusionCard>
```

## Testing Checklist

- [ ] All six cards render in fixed grid
- [ ] Different intensities show different visual weights
- [ ] Transitions are smooth (not jarring)
- [ ] Hover states work correctly
- [ ] Click navigation functions
- [ ] Level 3 cards pulse slowly
- [ ] Multiple cards can be intense simultaneously
- [ ] No layout shifts or reordering
- [ ] Text remains readable at all intensity levels
- [ ] No console errors

## Common Patterns

### Conditional sizing based on intensity
```typescript
const size = intensity >= 2 ? "text-2xl" : "text-xl";
```

### Conditional highlighting
```typescript
const highlight = intensity >= 2 ? "bg-amber-100/40 rounded" : "";
```

### Conditional weight
```typescript
const weight = intensity >= 2 ? "font-extrabold" : "font-bold";
```

### Conditional animation
```typescript
const pulse = intensity >= 3 ? "animate-pulse-slow" : "";
```

### Always use transition
```typescript
className={`${dynamicClass} transition-all duration-700`}
```

## Browser Developer Tools

To inspect intensity state:
1. Open React DevTools
2. Find `ShellHome` component
3. Look at `view.intensities` prop
4. Modify values to see visual changes

To test animations:
1. Inspect element with pulse
2. Force `:hover` state in DevTools
3. Verify smooth transitions
4. Check animation timing (should be 3s)
