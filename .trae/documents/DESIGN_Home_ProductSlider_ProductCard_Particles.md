# Page Design Specification — Home: Product Slider + Product Card + Particles

## Global Styles (desktop-first)
- Layout system: CSS Grid for page sections; Flexbox inside cards and slider track.
- Base grid: 12-column container, max-width 1200–1440px (match reference), outer padding 24–32px.
- Typography: match existing site tokens; ensure price uses tabular numerals if the reference shows aligned digits.
- Colors: use existing theme variables; particle colors must match reference accent/neutral palette.
- Interactions:
  - Hover: card elevation/outline/transform exactly per reference.
  - Focus: visible focus ring that does not break pixel alignment (use outline-offset).
  - Reduced motion: no particle animation; minimal slider motion.

## Meta Information
- Title: Home
- Description: Browse featured products
- Open Graph: reuse site defaults; no new OG requirements.

## Page Structure
Stacked sections; the slider section is a full-width band within the content container.

---

## Section: Product Slider
### Layout
- Container: centered with fixed max-width; aligns to page grid.
- Header row: left-aligned section title; optional right-aligned controls if present in reference.
- Slider viewport: overflow hidden; contains track.
- Track: horizontal flex row with fixed gap; supports snap points if reference indicates snapping.

### Components
1. Slider Header
   - Title text exactly as reference (size/weight/spacing).
   - Optional “View all” link/button only if present in your current UI reference.

2. Slider Controls
   - Left/Right arrows:
     - Positioned as in reference (inside viewport edges or outside container).
     - States: default, hover, disabled.
   - Pagination indicators (dots/progress) if present:
     - Reflect current index/scroll position.
     - Clickable if present in reference.

3. Slider Viewport + Drag
   - Pointer behavior:
     - Mouse drag allowed if reference indicates; otherwise arrows + wheel/trackpad.
     - Trackpad horizontal scroll supported.
   - Keyboard behavior:
     - Tab to controls and cards.
     - Arrow keys optional only if already used elsewhere in your UI.

---

## Component: Product Card
### Visual anatomy (match reference)
- Card wrapper:
  - Background, border radius, shadow, and border must match.
  - Padding must match (define per reference measurements).
- Media block:
  - Fixed aspect ratio (e.g., 1:1 or 4:5); image uses `object-fit: cover`.
  - Optional badge (sale/new) only if present in reference.
- Content block:
  - Title: single or two-line clamp per reference; overflow with ellipsis.
  - Price row:
    - Current price emphasized.
    - Compare-at price struck-through if present.
- Primary action:
  - Button/link styling matches reference (radius, height, typography).

### States
- Default
- Hover: elevation/scale/outline per reference; cursor pointer.
- Focus: consistent ring; do not shift layout.
- Loading: skeleton card shape matching final layout.

---

## Interaction Layer: Mouse-Interactive Particles (over slider)
### Placement
- One absolute-positioned overlay covering the slider viewport.
- Overlay does not block clicks/drag: `pointer-events: none`.

### Behavior
- Trigger: pointer moves within slider bounds.
- Emission: spawn rate tied to pointer speed (cap at max particles).
- Motion: subtle drift and fade; optional parallax toward pointer if reference shows attraction.
- Lifespan: particles fade out smoothly; remove/reuse after TTL.

### Accessibility & performance
- `prefers-reduced-motion`: show no particles (or a static decorative background only).
- Ensure stable 60fps target on desktop; cap particle count and avoid expensive blurs.

---

## Responsive behavior (desktop-first)
- ≥1280px: show most cards per view (per reference), largest gaps.
- 768–1279px: reduce cards per view; keep card aspect ratio.
- <768px: stack section title and controls; allow touch swipe; reduce particle density or disable by default for performance.
