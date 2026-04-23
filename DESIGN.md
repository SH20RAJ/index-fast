# IndexFast Design Guidelines

## Overview
IndexFast follows a high-polish, minimalist aesthetic inspired by Apple's design language and modern "Vibe Coding" culture. The goal is to make technical SEO tasks feel calm, fast, and satisfying. The interface uses a warm OKLCH-based color palette that balances professional utility with artisanal craft.

## Colors (OKLCH)
IndexFast uses a custom color system that works across light and dark modes:

- **Primary**: `oklch(0.6 0.18 20)` — Deep terracotta for primary actions and active states.
- **Secondary**: `oklch(0.9 0.02 45)` — Warm amber highlights and badges.
- **Background**: `oklch(0.98 0.01 45)` — Warm off-white, reducing eye strain compared to pure white.
- **Surface**: `oklch(0.96 0.01 45)` — Cards and elevated panels.
- **Text**: `oklch(0.15 0.01 45)` — Deep charcoal-brown for high readability.
- **Border**: `oklch(0.9 0.01 45)` — Subtle warm gray borders.

## Typography
- **Headings**: `Inter` or `Geist` (Sans) with tight tracking (`-0.02em`) and bold weights.
- **Body**: `Inter` or `Geist` at `400` and `500` weights for optimal legibility.
- **Monospace**: `Fira Code` or `Geist Mono` for code snippets, API keys, and technical logs.

Scale:
- Display: 60px (Black)
- H1: 48px (ExtraBold)
- H2: 30px (Bold)
- H3: 24px (Semibold)
- Body: 16px (Regular)
- Caption: 12px (Medium)

## Layout & Spacing
- **Grid**: 12-column grid for desktop, 4-column for mobile.
- **Radius**:
  - `0.75rem` (12px) for cards and modals.
  - `0.5rem` (8px) for buttons and inputs.
  - `9999px` for badges and pills.
- **Spacing**: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64).

## Components
- **Buttons**:
  - Primary: Solid terracotta with white text. Soft glow on hover.
  - Secondary: Ghost style with 1px border.
  - Action: Icons with tooltips for rapid dashboard tasks.
- **Cards**:
  - Glassmorphism effects for dashboard panels (`backdrop-blur`).
  - Subtle borders instead of heavy shadows.
  - Hover state: 2px lift or subtle border color shift.
- **Dashboard**:
  - Sidebar: Minimalist icons with labels on hover or fixed on large screens.
  - Main Content: Focused on data visualization (Recharts) and submission logs.

## Principles
1. **Speed First**: Transitions should be fast (150ms-200ms).
2. **Visual Clarity**: Hide complexity until needed. Use progressive disclosure.
3. **Warmth**: Avoid the "sterile blue" of typical SaaS. Use earth tones to make SEO feel human.
4. **Mobile First**: All SEO tools and dashboard features must be fully functional on mobile devices.
