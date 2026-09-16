# CLAUDE.md — Design System Reference

> **READ THIS FILE BEFORE IMPLEMENTING ANY SCREEN OR COMPONENT.**

---

## Project

**RedFoxCourier** — Next.js · TypeScript · Material UI · Mobile-first responsive web app.

---

## Tech Stack

| Layer | Package |
|-------|---------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| UI | `@mui/material` |
| Icons | `@mui/icons-material` **only** |
| Font | DM Sans via `next/font/google` |

---

## Design System Location

```
src/design-system/
├── tokens/
│   ├── colors.ts       ← all color palettes
│   ├── typography.ts   ← font family, weights, sizes, line-heights
│   ├── spacing.ts      ← 2px-grid scale + semantic tokens
│   └── radius.ts       ← border-radius tokens
├── components/
│   ├── Button/         ← Primary · Secondary · Tertiary
│   └── Input/          ← all states + password toggle
├── layouts/
│   ├── Container/      ← max-width page wrapper
│   ├── Stack/          ← MUI Stack wrapper
│   ├── Grid/           ← MUI Grid wrapper
│   ├── Flex/           ← flexbox utility box
│   └── PageSection/    ← full-width section with vertical rhythm
├── theme.ts            ← MUI theme (uses all tokens)
└── index.ts            ← single import surface
```

Import everything from:

```ts
import { Button, Input, colors, spacing, theme } from '@/design-system';
```

---

## Mandatory Rules

### 1 · No hardcoded values — ever

| ❌ Never | ✅ Always |
|----------|----------|
| `color: '#E8B20A'` | `color: colors.primaryGold[300]` |
| `padding: '16px'` | `` padding: `${spacing.s16}px` `` |
| `fontSize: 16` | `` fontSize: `${fontSize.t3}px` `` |
| `borderRadius: 8` | `` borderRadius: `${radius.radius8}px` `` |
| `fontWeight: 600` | `fontWeight: fontWeight.semiBold` |

### 2 · No shadows

Do **not** add `boxShadow`, `elevation`, or `filter: drop-shadow` unless a Figma file explicitly specifies one.

### 3 · Icons

Use **only** `@mui/icons-material`. Never import from any other icon library.

### 4 · Font loading (App Router)

Add DM Sans in `app/layout.tsx`:

```tsx
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>{children}</body>
    </html>
  );
}
```

### 5 · MUI ThemeProvider (App Router)

Create `app/providers.tsx`:

```tsx
'use client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/design-system';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
```

Then wrap `app/layout.tsx` body with `<Providers>`.

---

## Color Palette

Five palettes in `src/design-system/tokens/colors.ts`:

| Export | Steps | Purpose |
|--------|-------|---------|
| `colors.primaryGold` | 50–950 | Brand gold, buttons, highlights |
| `colors.successGreen` | 50–950 | Success states |
| `colors.forestGreen` | 50–950 | Dark backgrounds, text on gold |
| `colors.neutral` | 50–950 | Grays · neutral[50] = white |
| `colors.slate` | 50–950 | Muted green-gray for supporting text |

> **No red/danger palette is defined.** Use `'#D32F2F'` for error states (MUI default).

---

## Typography Scale

Font: **DM Sans** — loaded via CSS variable `--font-dm-sans`.

### Display

| Token | Size | Line-Height | Weight |
|-------|------|-------------|--------|
| `typography.displayLarge` | 56px | 66px | 700 |
| `typography.displayMedium` | 44px | 54px | 700 |
| `typography.displaySmall` | 36px | 44px | 700 |

### Title (T1–T4) — each has Bold / SemiBold / Medium variant

| Base | Size | Line-Height |
|------|------|-------------|
| T1 | 22px | 28.6px |
| T2 | 18px | 23.4px |
| T3 | 16px | 20.8px |
| T4 | 14px | 18.2px |

Usage: `typography.t1Bold` · `typography.t2SemiBold` · `typography.t3Medium`

### Body (B1–B4) — each has Regular / Medium / SemiBold variant

| Base | Size | Line-Height |
|------|------|-------------|
| B1 | 16px | 22.4px |
| B2 | 14px | 19.6px |
| B3 | 12px | 16.8px |
| B4 | 10px | 13px |

Usage: `typography.b1Regular` · `typography.b2Medium` · `typography.b3SemiBold`

### Font weights

```ts
fontWeight.regular   // 400
fontWeight.medium    // 500
fontWeight.semiBold  // 600
fontWeight.bold      // 700
```

---

## Spacing

Base: **2px grid.** Full scale `s2`–`s120` in `src/design-system/tokens/spacing.ts`.

### Primitive tokens (px values)

`spacing.s2` `spacing.s4` `spacing.s6` `spacing.s8` `spacing.s10` `spacing.s12` `spacing.s14` `spacing.s16` `spacing.s18` `spacing.s20` `spacing.s22` `spacing.s24` `spacing.s26` `spacing.s28` `spacing.s30` `spacing.s32` `spacing.s36` `spacing.s40` `spacing.s44` `spacing.s48` `spacing.s52` `spacing.s56` `spacing.s60` `spacing.s64` `spacing.s72` `spacing.s80` `spacing.s88` `spacing.s96` `spacing.s104` `spacing.s112` `spacing.s120`

### Semantic tokens

| Token | Value | Use |
|-------|-------|-----|
| `semanticSpacing.inlineSm` | 8px | Tight component padding |
| `semanticSpacing.inlineLg` | 16px | Standard component padding |
| `semanticSpacing.gapSm` | 8px | Element gap |
| `semanticSpacing.gapXl` | 24px | Section gap |
| `semanticSpacing.pageMobile` | 16px | Horizontal page padding — xs |
| `semanticSpacing.pageTablet` | 24px | Horizontal page padding — sm |
| `semanticSpacing.pageDesktop` | 32px | Horizontal page padding — md |
| `semanticSpacing.sectionMd` | 48px | Standard section padding |
| `semanticSpacing.sectionLg` | 64px | Large section padding |

---

## Border Radius

```ts
radius.radius2    // 2px
radius.radius4    // 4px
radius.radius6    // 6px
radius.radius8    // 8px   ← default for buttons, inputs, cards
radius.radius12   // 12px
radius.radius16   // 16px
radius.radius20   // 20px
radius.radius24   // 24px
radius.radius32   // 32px
radius.radiusFull // 9999px ← pills, avatars
```

---

## Button Component

```tsx
import { Button } from '@/design-system';

// Variants
<Button variant="primary">Label</Button>
<Button variant="secondary">Label</Button>
<Button variant="tertiary">Label</Button>

// Sizes (default: md)
<Button size="sm">Label</Button>    // h=36px
<Button size="md">Label</Button>    // h=44px
<Button size="lg">Label</Button>    // h=52px

// States
<Button loading>Label</Button>
<Button disabled>Label</Button>

// With icons
<Button startIcon={<SomeIcon />}>Label</Button>
<Button endIcon={<SomeIcon />}>Label</Button>

// Icon-only square button
<Button iconOnly startIcon={<SomeIcon />} />

// Full width
<Button fullWidth>Label</Button>
```

### Button colour spec

| Variant | Bg | Text | Hover Bg | Disabled Bg | Disabled Text |
|---------|----|------|----------|-------------|---------------|
| primary | `primaryGold[300]` | `forestGreen[800]` | `primaryGold[400]` | `neutral[400]` | `neutral[700]` |
| secondary | transparent | `primaryGold[300]` | `primaryGold[50]` | transparent | `neutral[600]` |
| tertiary | transparent | `primaryGold[300]` | `primaryGold[50]` | transparent | `neutral[600]` |

---

## Input Component

```tsx
import { Input } from '@/design-system';

// Default
<Input label="Email" placeholder="you@example.com" />

// States
<Input label="Email" />                                    // default
<Input label="Email" value="filled@email.com" />          // filled
<Input label="Email" error errorMessage="Invalid email" /> // error
<Input label="Email" disabled />                           // disabled
<Input label="Email" readOnly value="Read only" />        // read-only

// Icons
<Input label="Search" startIcon={<SearchIcon />} />
<Input label="Amount" endIcon={<InfoIcon />} />

// Password with toggle
<Input label="Password" type="password" showPasswordToggle />
```

### Input state spec

| State | Border | Label color | Bg |
|-------|--------|-------------|-----|
| default | `neutral[400]` 1px | `neutral[700]` | `neutral[50]` |
| hover | `neutral[600]` 1px | — | — |
| focus | `primaryGold[300]` 1.5px | `primaryGold[400]` | — |
| filled | `neutral[400]` 1px | — | — |
| error | `#D32F2F` 1.5px | `#D32F2F` | — |
| disabled | `neutral[400]` 1px | `neutral[600]` | `neutral[200]` |
| read-only | same as default | — | `neutral[50]` |

---

## Layout Primitives

```tsx
import { Container, Stack, Grid, Flex, PageSection } from '@/design-system';

// Responsive max-width wrapper with page padding
<Container>…</Container>
<Container noPadding>…</Container>

// Vertical / horizontal stack (MUI Stack)
<Stack spacing={2} direction="column">…</Stack>

// MUI Grid system
<Grid container spacing={2}>
  <Grid item xs={12} md={6}>…</Grid>
</Grid>

// Flexbox utility
<Flex align="center" justify="space-between" gap={`${spacing.s16}px`}>…</Flex>
<Flex direction="column" gap={`${spacing.s24}px`}>…</Flex>

// Full-width section with vertical rhythm
<PageSection verticalPadding="lg">…</PageSection>
```

---

## Screen Implementation Workflow

When given a Figma URL:

1. **Fetch** — call `mcp__claude_ai_Figma__get_design_context` with the node ID + file key
2. **Audit** — list which design-system components can be reused directly
3. **Mobile first** — implement the exact mobile layout (xs breakpoint)
4. **Tablet** — adapt at sm (≥600px)
5. **Desktop** — adapt at md (≥900px)
6. **Token check** — grep for any hardcoded hex/px/font values and replace with tokens

### Breakpoints

| Name | Width | Target |
|------|-------|--------|
| xs | 0px | Mobile |
| sm | 600px | Tablet |
| md | 900px | Small desktop |
| lg | 1200px | Desktop |
| xl | 1536px | Wide |

---

## Checklist Before Submitting Any Screen

- [ ] All colours use `colors.*` tokens
- [ ] All spacing uses `spacing.*` or `semanticSpacing.*` tokens
- [ ] All typography uses `fontSize.*`, `lineHeight.*`, `fontWeight.*` tokens
- [ ] All border radii use `radius.*` tokens
- [ ] No `boxShadow` or `elevation` added without Figma spec
- [ ] No icons from libraries other than `@mui/icons-material`
- [ ] Mobile layout implemented first
- [ ] Tablet and desktop responsive adaptations present
- [ ] No screen-specific one-off components (reused design-system components)
