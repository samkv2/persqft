# 📐 PERSQFT CONSTRUCTIONS — Frontend Architecture & Technical Documentation

This document provides a comprehensive technical overview of the **PERSQFT CONSTRUCTIONS** web application, detailing the technology stack, application architecture, component hierarchy, state workflows, and design system tokens.

---

## 🚀 1. Technology Stack & Dependencies

| Technology / Library | Version | Core Purpose |
| :--- | :--- | :--- |
| **React** | `^19.2.8` | Core UI library & functional component tree |
| **Vite** | `^8.2.2` | Next-generation frontend build tool & hot-module replacement server |
| **TypeScript** | `~6.0.2` | Static type checking and component interface enforcement |
| **Tailwind CSS** | `^4.3.3` | Utility-first CSS framework with dynamic `@theme` color bindings |
| **Lucide React** | `^1.37.0` | Modern, clean vector icon set |
| **GSAP (GreenSock)** | `^3.15.0` | High-performance timeline animations & scroll triggers |
| **Three.js** | `^0.185.1` | 3D rendering & canvas perspective background capabilities |
| **Canvas Confetti** | `^1.9.4` | Interactive celebratory visual feedback on inquiry submissions |
| **clsx & tailwind-merge**| `^2.1.1` / `^3.6.0` | Dynamic CSS class concatenation and utility conflict resolution |
| **Vercel** | Edge Network | Automated CI/CD production hosting and static CDN distribution |

---

## 📁 2. File & Directory Structure

```
persqft/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/              # High-resolution CAD renders, background videos, logos
│   │   ├── perSqftLogo.png
│   │   ├── renderWithoutWeb10s_hd.mp4
│   │   └── AboutSectionBgCip.mp4
│   ├── components/          # Modular UI components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── OurStorySection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── ProjectDetailModal.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── TeamSection.tsx
│   │   ├── EnquiryModal.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeAccentPicker.tsx
│   ├── data/                # Static data & project portfolios
│   │   └── projectsData.ts
│   ├── App.tsx              # Root application container & global state
│   ├── index.css            # Base styles, keyframe animations & theme overrides
│   └── main.tsx             # Application entry point
├── Required_Data.md         # Production data replacement checklist
├── package.json
└── vite.config.ts
```

---

## ⚙️ 3. Component Workflows & Responsibilities

### 1. `App.tsx` (Global Shell)
- **Role**: Root component coordinating global state and section assembly.
- **State Managed**:
  - `webUIVisible` (`boolean`): Controls visibility of sticky `Navbar` and floating `ThemeAccentPicker`.
  - `enquiryOpen` (`boolean`): Toggles the `EnquiryModal`.
  - `initialProject` (`string`): Passes pre-selected project names to the modal.

### 2. `Hero.tsx` (Cinematic Entrance & Video Hero)
- **Role**: Renders the architectural 3D background entrance video.
- **Key Workflow**:
  - Checks `sessionStorage.getItem('persqft_hero_played')`. If `true` (e.g. on page refresh), skips the 9-second video intro immediately to reveal the full Web UI homepage.
  - Automatically triggers `onWebUIReveal()` when video currentTime reaches `9.2s` or ends.

### 3. `Navbar.tsx` (Architectural Mega Dropdown Header)
- **Role**: Fixed top navigation header with glassmorphism backdrop.
- **Key Features**:
  - Grouped dropdown categories: **COMPANY ▾**, **SERVICES ▾**, and **SHOWCASE ▾**.
  - Mobile accordion navigation drawer for responsive touch devices.
  - Includes a direct "REPLAY INTRO" button and "GET A QUOTE" CTA button.

### 4. `OurStorySection.tsx` (Brand Story & Video Walkthrough)
- **Role**: Highlights firm legacy, 10+ years of architectural experience, and structural engineering philosophy.
- **Interactive Elements**: Embedded video player modal for video project walkthroughs.

### 5. `StatsSection.tsx` (Milestones & Achievements)
- **Role**: Visual metric counter showcasing completed square footage, turnkey projects delivered, and client satisfaction rates.

### 6. `ServicesSection.tsx` (Core Architectural Offerings)
- **Role**: Displays cards for *Custom Home Builds*, *Turnkey Villa Construction*, *Renovations*, and *Commercial Real Estate*.
- **Workflow**: Clicking "Inquire Service" pre-populates `EnquiryModal` with the specific service title.

### 7. `ContactSection.tsx` (Dedicated Dark Navy Inquiry Form)
- **Role**: Deep dark navy (`#080E1A`) contact block featuring quick contact badges, office addresses, and a responsive inline contact form.

### 8. `ProjectsSection.tsx` & `ProjectDetailModal.tsx` (Portfolio & Modal)
- **Role**: Interactive carousel showcasing ongoing & completed architectural projects.
- **Modal Workflow (`ProjectDetailModal.tsx`)**:
  - Clicking any project card opens a viewport-constrained (`max-h-[88vh]`) modal card with high-resolution CAD photography.
  - Backdrop click handler (`onClick={onClose}`) allows closing by clicking outside the modal box.

### 9. `TestimonialsSection.tsx` (Client Reviews Slider)
- **Role**: Smooth horizontal carousel displaying verified client reviews, star ratings, and project locations.

### 10. `TeamSection.tsx` (Leadership & Personnel)
- **Role**: "Meet Our Team" section utilizing a split card design strategy:
  - **Management**: Full-bleed portrait cards with glassmorphic bottom-blur overlays.
  - **Engineers & Personnel**: Clean white cards with clear role tags.

### 11. `EnquiryModal.tsx` (Get a Quote Modal)
- **Role**: Compact, sleek `#080E1A` dark navy modal for quick project cost estimation requests.
- **Workflow**: Generates a randomized reference ID (`#PSQFT-XXXXXX`) on submission with animated success confirmation.

### 12. `ThemeAccentPicker.tsx` (Live Dynamic Theme Switcher)
- **Role**: Floating widget allowing real-time switching of the site's accent color palette.
- **Palette Options**:
  - 🟠 **Architectural Orange** (`#F48033`)
  - 🔵 **Electric Blueprint** (`#0284C7`)
  - 🟢 **Structural Emerald** (`#10B981`)
  - 🟡 **Titanium Amber** (`#D97706`)
- **Workflow**: Dynamically sets `--theme-accent` and `--theme-accent-dark` CSS variables on `document.documentElement`.

---

## 🎨 4. Design System & CSS Architecture (`src/index.css`)

The project uses Tailwind CSS v4 with custom CSS variable overrides to enable dynamic color theme switching across static Tailwind utility classes:

```css
@layer base {
  :root {
    --theme-accent:      #F48033;
    --theme-accent-dark: #d96a20;
    --persqft-orange:    var(--theme-accent);
  }
}

/* Dynamic theme overrides mapping Tailwind utility classes to CSS variables */
.text-\[\#F48033\] { color: var(--theme-accent, #F48033) !important; }
.bg-\[\#F48033\]   { background-color: var(--theme-accent, #F48033) !important; }
.border-\[\#F48033\] { border-color: var(--theme-accent, #F48033) !important; }
```

---

## 🛠️ 5. Build & Deployment Commands

```bash
# Start local development server
npm run dev

# Compile TypeScript & build optimized production bundle
npm run build

# Run Oxlint linter
npm run lint

# Deploy directly to Vercel Production
npx vercel --prod --yes
```
