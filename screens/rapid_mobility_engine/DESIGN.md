---
name: Rapid Mobility Engine
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464c'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#575e70'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#141b2b'
  on-primary-container: '#7d8497'
  inverse-primary: '#c0c6db'
  secondary: '#555f70'
  on-secondary: '#ffffff'
  secondary-container: '#d6e0f4'
  on-secondary-container: '#596374'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002109'
  on-tertiary-container: '#009842'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce2f7'
  primary-fixed-dim: '#c0c6db'
  on-primary-fixed: '#141b2b'
  on-primary-fixed-variant: '#404758'
  secondary-fixed: '#d9e3f7'
  secondary-fixed-dim: '#bdc7db'
  on-secondary-fixed: '#121c2a'
  on-secondary-fixed-variant: '#3d4757'
  tertiary-fixed: '#7ffc97'
  tertiary-fixed-dim: '#62df7d'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  subheading:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-otp:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: 0.15em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

The design system embodies utilitarian efficiency, trust, and frictionless navigation tailored for high-density, real-time urban transit in India. It is engineered for the fast-paced mobility commuter—prioritizing hyper-legibility under direct sunlight, single-thumb ergonomics, and instant cognitive clarity over decorative styling.

The visual direction draws strictly from contemporary precision minimalism and functional component architecture (shadcn-inspired):
- **Utilitarian & Minimal:** Zero decorative gradients, no translucent blurs or glassmorphism, and no chromatic novelty. Surface treatments are purposeful, crisp, and tactile.
- **High Information Density & Contrast:** Deep neutral foundations paired with crisp functional indicators provide split-second verification of vehicle plates, ride statuses, OTPs, and fare totals.
- **Engineered Reliability:** Clear-cut borders, structured geometric layouts, and systemic line weights evoke modern transport infrastructure, speed, and safety.

## Colors

The color system enforces a disciplined, high-contrast palette calibrated for outdoor visibility and fast transactional workflows.

- **Primary Canvas & Surfaces:** The root viewport rests on slate canvas `#F8FAFC`, while elevated surfaces (cards, sheets, headers) use pure white `#FFFFFF` anchored by 1px slate borders (`#E2E8F0`).
- **Brand & Primary Text:** `#111827` anchors primary structures, destructive states, major CTAs, and highest-priority typography. `#374151` serves secondary structural elements and inactive controls.
- **Action & Accent:** `#16A34A` (Emerald) is reserved strictly for primary affirmative user flows: ride booking triggers, active trip states, pickup confirmations, and positive transaction badges. `#15803D` handles pressed/hover states.
- **Supportive Neutrals:** `#0F172A` delivers high-contrast primary text legibility. `#64748B` applies to secondary metadata (ETA, distance, vehicle specs). `#E2E8F0` defines all element bounding boxes.
- **Alert States:** Cautionary alerts and ETA surges use `#F59E0B`. Critical emergency workflows, trip cancellations, and rider SOS rely exclusively on bold `#EF4444`.

## Typography

The typography scale utilizes **Inter** across all roles, tuned with dense line heights and subtle negative tracking on headings to maximize real estate on mobile screens.

- **Tabular Figures & Metrics:** All dynamic numerical outputs—fare estimates (`₹149`), vehicle registration plates (`KA 01 AB 1234`), speed metrics, and OTP strings—must leverage tabular numbers (`font-variant-numeric: tabular-nums`) to avoid layout jitter during real-time GPS tracking.
- **Strict Size Limits:** Headings never scale into oversized editorial dimensions. Maximum display size is capped at 30px to guarantee that map overlays and ride confirmations retain viewability above the fold.
- **Caps & Hierarchy:** Labels and badges (`label-sm`, `label-md`) use uppercase tracking for trip tags (e.g., `CASH`, `UPI`, `HELMET MANDATORY`) to maintain instant visual recognition.

## Layout & Spacing

The layout operates on a strict 4px base increment system (`4px`, `8px`, `12px`, `16px`, `24px`), optimized for mobile touch ergonomics:

- **Mobile Viewport Structure:** The standard view uses a continuous 16px lateral margin (`margin: 1rem`) with flexible single-column stacking. The interface is optimized for single-hand bottom-anchored reachability: bottom sheets, persistent action buttons, and confirmation bars hold primary focus.
- **Component Padding & Gaps:** Interior cards utilize `space-md` (12px) to `space-lg` (16px) vertical/horizontal padding to maximize touch targets while keeping vertical scrolling to a minimum.
- **Bottom Sheet Architecture:** Multi-step ride booking states (Pickup selection, Vehicle options, Driver arriving, In-trip) slide over an active vector map canvas with structural anchor steps at 25%, 55%, and 90% viewport heights.
- **Desktop/Tablet Fallback:** On viewport widths exceeding 768px, mobile ride layouts constrain inside a centered 420px maximum-width mobile frame to preserve app parity across kiosks and responsive browser previews.

## Elevation & Depth

This design system rejects deep blur radii and stylized colored drop shadows, adopting the restrained, utilitarian depth of modern component libraries:

- **Surface Demarcation via 1px Outlines:** Structural depth is driven primarily by razor-sharp 1px borders using `#E2E8F0`. Every card, dialog, input, and panel relies on border contrast rather than shadow separation.
- **Level 0 (Canvas):** Underlying application backplate `#F8FAFC`.
- **Level 1 (Cards, Floating Controls, Badges):** `#FFFFFF` fill with `border: 1px solid #E2E8F0` and `box-shadow: 0 1px 2px 0 rgba(15, 23, 42, 0.05)`.
- **Level 2 (Active Modals, Bottom Drawers, Notification Toasts):** `#FFFFFF` fill with `border: 1px solid #E2E8F0` and `box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.08)`.
- **Level 3 (SOS & Emergency Triggers):** Heavy 1px edge with `#DC2626` focus accents and crisp contrast against black translucent underlays (`rgba(15, 23, 42, 0.6)`).

## Shapes

The geometric framework is calibrated to roundedness level `2`:

- **Containers & Cards:** Core containers, ride selection panels, vehicle spec tiles, and address drawers utilize `rounded-lg` (8px / `0.5rem`).
- **Input Fields & Micro-Items:** OTP verification boxes, search inputs, and chips use `rounded-md` (6px / `0.375rem`) to ensure sharp rectangular precision.
- **Interactive Badges & Pill Controls:** Quick filters (`Fastest`, `Nearby`, `Work`, `Home`) and vehicle license plates use subtle rounded tags (`rounded-md`), avoiding full pill radii to maintain an architectural, technical aesthetic.
- **Touch Action Buttons:** Primary CTAs adhere strictly to `rounded-lg` (8px) for maximum thumb alignment without circular deformation.

## Components

### Buttons
- **Primary Action (Book / Confirm):** Fill `#16A34A`, text `#FFFFFF`, font weight 600, height 48px, radius 8px, hover/active `#15803D`.
- **Secondary Action (Cancel / Manage):** Fill `#FFFFFF`, border `1px solid #E2E8F0`, text `#0F172A`, height 44px, radius 8px, active `#F1F5F9`.
- **SOS / Emergency Action:** Fill `#EF4444`, text `#FFFFFF`, weight 700, radius 8px, paired with a line-art Lucide `shield-alert` icon.

### Form Inputs & Location Bars
- **Address & Waypoint Input:** Background `#FFFFFF`, border `1px solid #E2E8F0`, text `#0F172A`, placeholder `#64748B`. Focused state: border `#111827`, outline offset `0px`.
- **Route Connectors:** Minimal 2px vertical slate dotted lines linking green dot (`pickup`) to slate dot (`drop`).

### Chips & Badges
- **Status Tags:** Compact text with `padding: 2px 8px`, border `1px solid #E2E8F0`, background `#F8FAFC`, radius 4px.
- **OTP Verification Badge:** Dark inverted slate block (`#111827`), white monospace-weighted Inter digits with letter spacing `0.15em`, accompanied by `border: 1px solid #374151`.

### Lists & Transit Cards
- **Vehicle Selection Card:** White card with 1px border. Selected state swaps border to `2px solid #16A34A` with a soft green highlight tag. Displays bike category (`Hero Splendor`, `Bajaj Pulsar`), ETA estimate (`3 mins away`), and price breakdown (`₹89`).
- **Receipt & Fare Tables:** High-density breakdown rows with a 1px border separator (`border-slate-200`). Item labels in `#64748B`, values in `#0F172A` tabular figures.

### Checkboxes, Radios & Switches
- **Radios:** 18px diameter ring with `border: 1.5px solid #CBD5E1`. Selected state features an outer `#111827` stroke and centered `#111827` solid dot.
- **Checkboxes:** 18px square with radius 4px, filled `#111827` with crisp white SVG check on active.

### Driver & Trip Sheets
- Fixed-bottom layout containing driver portrait thumbnail (44px square, radius 6px), driver name, rating (`star` icon + `4.8`), vehicle registration badge (`KA 05 KM 8219`), and quick call/message button group.