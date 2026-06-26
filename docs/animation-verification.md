# Animation Verification Report

| Animation Module | File Location | Technology | Trigger | Normal Mode | Reduced Motion | Status |
|---|---|---|---|---|---|---|
| Hero title reveal | GrimoireHero.tsx | Framer Motion | Page load | Fade+blur in 1.1s | Instant display | Implemented |
| SVG magic circle draw | MagicCircle.tsx | CSS stroke-dashoffset | Page load | 2s staggered draw | Static complete | Implemented |
| Stardust Canvas | StardustCanvas.tsx | Canvas RAF | Always | 35 particles float | 8-10 static dots | Implemented |
| Scroll indicator | ScrollIndicator.tsx | CSS keyframes | Page load | Float 6px cycle | Hidden | Implemented |
| Journey route draw | JourneyMapOverlay.tsx | CSS + IntersectionObserver | Scroll into view | Path draws in | Static path | Implemented |
| Journey node expand | Journey.tsx | CSS max-height | Click/Enter/Space | Smooth expand | Instant | Implemented |
| Skills constellation | SkillsGrid.tsx | Framer Motion SVG | Hover/Focus | Gold lines 350ms | Instant lines | Implemented |
| Project card scroll flip | ProjectCardGrid.tsx | CSS keyframes | Hover/Focus | 600ms unroll | Instant flip | Implemented |
| Draw a Spell shuffle | FeaturedDeck.tsx | Framer Motion | Click | Spring animation | Instant | Implemented |
| Publications tome hover | PublicationsList.tsx | CSS transition | Hover | Gold border glow | No animation | Implemented |
| Awards seal expand | CardPage.tsx | CSS sealStamp | Click/Enter/Space | Stamp animation | Instant | Implemented |
| Contact portal/raven | HomeContact.tsx | Framer Motion + CSS | In view / Hover | Pulse + raven fly | Static | Implemented |
| Clock ripple | ClockRipple.tsx | CSS rippleExpand | Timer (6-10s) | 4 ripples expand | Static rings | Implemented |
| Lantern breathe | LanternGlow.tsx | CSS lanternBreathe | Always | 6s pulse cycle | Static glow | Implemented |
