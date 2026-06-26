# Baseline Audit — Before Grimoire Animation Enhancement

## Git Baseline

- **Branch:** `main` → new branch `feat/grimoire-animation-enhancement`
- **Tag:** `before-grimoire-animation-enhancement`
- **HEAD commit:** `f413ef9025081548368539aaee11ba238bf22a3e`
- **Remote:** `https://github.com/Jinger-ui/Jinger-ui.github.io.git`

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.3.3 |
| UI Library | React | 19.0.0 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | v4 |
| CSS Build | PostCSS + @tailwindcss/postcss | v4 |
| Animations | Framer Motion | 12.18.1 |
| UI Components | @headlessui/react | 2.2.4 |
| Icons | @heroicons/react, lucide-react | 2.2.0, 0.515.0 |
| Content | TOML (smol-toml) + BibTeX | — |
| State | Zustand | 5.0.5 |
| Themes | Custom (Zustand + class toggle) | — |
| Build Output | Static export (`output: 'export'`) | → `out/` |
| Deploy | GitHub Pages | via Actions |
| Node | >= 22.0.0 | — |

## Startup & Build Commands

```bash
npm run dev    # next dev --turbopack
npm run build  # next build (static export to out/)
npm run start  # next start
npm run lint   # next lint
```

## Home Page Section Order (HomePageClient.tsx)

| # | Section | Component | id |
|---|---------|-----------|-----|
| 1 | Hero / Profile | `Profile.tsx` | `home-intro` |
| 2 | Journey | `Journey.tsx` | `journey` |
| 3 | Skills | `SkillsGrid.tsx` | `skills` |
| 4 | Selected Projects | `ProjectCardGrid.tsx` | `selected-projects` |
| 5 | Playground | `PlaygroundSection.tsx` | `playground` |
| 6 | Publications | `PublicationsList.tsx` | `publications` |
| 7 | Awards | `CardPage.tsx` | `awards` |
| 8 | Contact | `HomeContact.tsx` | `contact` |

## Routing & Project Detail Pages

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/app/page.tsx` | Home |
| `/about` | `src/app/[slug]/page.tsx` | About page |
| `/awards` | `src/app/[slug]/page.tsx` | Awards full page |
| `/projects-by-year` | `src/app/[slug]/page.tsx` | Projects by year |
| `/projects/[slug]` | `src/app/projects/[slug]/page.tsx` | Portfolio project detail |
| `/playground/[slug]` | `src/app/playground/[slug]/page.tsx` | Playground project detail |

## Project Data Source

- **Primary:** `content/projects.toml` (16 `[[items]]` blocks)
- **Category mapping:** `src/lib/playgroundProjects.ts` (`CATEGORY_BY_TITLE`)
- **Portfolio enrichment:** `src/lib/portfolioProjects.ts`
- **Playground enrichment:** `src/lib/playgroundProjects.ts`

## 16 Projects

| # | Title | Date | Tags (first 3) |
|---|-------|------|----------------|
| 1 | EcoGo — Sustainability Capstone | 2026 | React, Kotlin, Spring Boot |
| 2 | Codex Code Book Web Platform | 2025 | React, Spring Boot, SQL |
| 3 | Flip Card Memory Game | 2025 | Android Studio, Java, XML |
| 4 | GetFreshFood Application | 2025 | Figma, PlantUML, UML |
| 5 | CI/CD Workflow Automation | 2025 | Git, GitHub, CI/CD |
| 6 | Fruit Image Classification | 2025 | TensorFlow, Keras, CNN |
| 7 | Machine Learning Model Evaluation | 2025 | Python, Pandas, Scikit-learn |
| 8 | Classroom Behavior Analytics | 2024 | YOLOv8, ByteTrack, MySQL |
| 9 | Multimodal Attention Analysis | 2024 | YOLOv8, Gaze tracking |
| 10 | Defect Detection Power Transmission | 2024 | CSG-YOLO, YOLOv8 |
| 11 | Parallelism for HPC | 2024 | M1, H100, Colab |
| 12 | Privacy-Preserving Financial | 2023 | SecretFlow, SPU, PSI |
| 13 | Credit Card Fraud Analysis | 2023 | ML, Feature engineering |
| 14 | BERT Car Reviews | 2023 | BERT, NLP |
| 15 | Campus Digital Twin | 2023 | Unity, LOD |
| 16 | ROP Mitigation Framework | 2023 | ASLR, DEP, LBR |

## Existing Animations & Interactions

- **Framer Motion:** Profile entrance, Journey hover, SkillsGrid stagger, ProjectCardGrid flip (3D rotateY), FeaturedDeck draw/shuffle, PlaygroundMasonry filter transitions, HomeContact entrance
- **CSS keyframes:** `fadeInUp`, `subtlePulse`, `gradientShift` (in globals.css)
- **CSS transitions:** Card hover glow, scroll-card hover, overlay transitions
- **Reduced motion:** Global `@media (prefers-reduced-motion: reduce)` in globals.css
- **Playground filters:** All / Built / Designed / Researched / Explored
- **Playground shuffle:** FeaturedDeck with draw + shuffle buttons

## Existing CSS / Component Files

### Styles
- `src/app/globals.css` — 639 lines (theme tokens, Tailwind, animations, scroll-card)

### Components (home)
- `Profile.tsx`, `HomeContact.tsx`, `HomePageClient.tsx`, `SkillsGrid.tsx`
- `News.tsx`, `About.tsx`, `SelectedPublications.tsx`, `ProfileCompact.tsx`

### Components (layout)
- `Navigation.tsx`, `Footer.tsx`, `Journey.tsx`, `NavContactLinks.tsx`, `VisitorCount.tsx`

### Components (projects)
- `ProjectCardGrid.tsx`, `ProjectDetailPage.tsx`, `ProjectDetailModal.tsx`

### Components (playground)
- `PlaygroundSection.tsx`, `FeaturedDeck.tsx`, `PlaygroundMasonry.tsx`, `PlaygroundCardGrid.tsx`, `PlaygroundDetailPage.tsx`

### Components (publications)
- `PublicationsList.tsx`, `FormattedBibTeXText.tsx`

### Components (ui)
- `ThemeProvider.tsx`, `ThemeToggle.tsx`, `LanguageToggle.tsx`, `LocaleProvider.tsx`

## What Must Be Preserved

- All 16 projects and their data
- All navigation routes and page structure
- Profile/Hero content (name, title, institution, social links, avatar)
- Journey timeline items and interaction
- Skills categories and items
- Playground filter + shuffle functionality
- Publications with BibTeX parsing and DOI links
- Awards data and display
- Contact links (email, GitHub, LinkedIn, location)
- Theme toggle (light/dark)
- Responsive design breakpoints
- Accessibility features (skip link, ARIA, focus styles)
- Static export build for GitHub Pages

## What May Be Enhanced

- Visual theme (add quiet fantasy tokens, fonts, textures)
- Hero section (add grimoire decorations, magic circle)
- Journey (add adventure map SVG path animations)
- Skills (add constellation layout for desktop)
- Project cards (add scroll/grimoire card styling)
- Playground (enhance Draw a Spell animation)
- Publications (add research tome visual treatment)
- Awards (add expandable achievement cards)
- Contact (add portal/raven decoration)
- Ambient effects (stardust particles, clock ripple, lantern glow)
- Reduced motion handling (enhance existing)
