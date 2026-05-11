---
name: Exam Prep AI
colors:
  surface: '#f5faff'
  surface-dim: '#d6dae0'
  surface-bright: '#f5faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4fa'
  surface-container: '#eaeef4'
  surface-container-high: '#e4e9ee'
  surface-container-highest: '#dee3e8'
  on-surface: '#171c20'
  on-surface-variant: '#3e4850'
  inverse-surface: '#2c3135'
  inverse-on-surface: '#ecf1f7'
  outline: '#6e7881'
  outline-variant: '#bdc8d1'
  surface-tint: '#00658d'
  primary: '#00658d'
  on-primary: '#ffffff'
  primary-container: '#00aeef'
  on-primary-container: '#003e58'
  inverse-primary: '#82cfff'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e2'
  on-secondary-container: '#646464'
  tertiary: '#5d5f5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#a2a3a3'
  on-tertiary-container: '#37393a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c6e7ff'
  primary-fixed-dim: '#82cfff'
  on-primary-fixed: '#001e2d'
  on-primary-fixed-variant: '#004c6b'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f5faff'
  on-background: '#171c20'
  surface-variant: '#dee3e8'
typography:
  h1:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  button:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  grid-columns: '12'
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
The design system for Exam Prep AI is built on the pillars of **precision, clarity, and technological advancement**. It targets high-stakes learners who require an environment free of distractions, fostering a sense of professional reliability and intellectual focus. 

The aesthetic is rooted in **Minimalism** with a **Corporate Modern** finish. It leverages heavy whitespace to reduce cognitive load and uses high-precision typography to communicate intelligence. The interface feels lightweight and responsive, using subtle depth markers to guide the user’s eye through complex study materials without visual clutter.

## Colors
The palette is hyper-focused on the primary "Electric Blue" to signify AI-driven energy and digital intelligence. 

In **Light Mode**, we prioritize a "Paper" feel using absolute White for the canvas and Light Gray for secondary containers to maintain a sterile, academic environment. In **Dark Mode**, the system shifts to "Deep Space," utilizing a pure Black background with a Dark Navy (Deep Sea) surface color for UI elements like cards and sidebars. This transition ensures that the primary blue remains vibrant and legible across both spectrums, maintaining high contrast for accessibility in long study sessions.

## Typography
This design system employs a dual-font strategy. **Manrope** is used for headlines to provide a modern, geometric, and authoritative feel. Its slightly wider character set offers a premium tech-focused look that stands out in dashboard environments. 

**Inter** is the workhorse for all body text, labels, and inputs. It is chosen for its exceptional legibility at small sizes and its neutral, systematic appearance, which is critical for reading long-form exam questions and explanations. Text should generally be "Text-Primary" for maximum readability, with "Text-Secondary" reserved for metadata and less critical UI labels.

## Layout & Spacing
The design system utilizes a **Fixed Grid** model on desktop (centered content area) and a fluid model on mobile. A strict 8px base unit (linear scale) ensures harmony across all components.

Layouts should favor high-density information but maintain "breathing room" through large outer margins (`xl`). Content modules (like quiz cards) should be separated by `lg` spacing, while internal elements like labels and inputs should use `sm` or `md` increments. The 12-column grid provides flexibility for sidebar-heavy dashboards (3-9 split) or centered focus modes (8-column center).

## Elevation & Depth
To maintain the minimalist aesthetic, depth is communicated through **Tonal Layers** supplemented by **Ambient Shadows**. 

- **Level 0 (Floor):** Primary background color.
- **Level 1 (Card):** Uses `background-surface` with a 1px border (`border-subtle`).
- **Level 2 (Hover/Active):** Elements lift slightly using a soft, diffused shadow (0px 10px 20px rgba(0,0,0, 0.05) in light mode).

In Dark Mode, shadows are replaced by subtle inner glows or slightly lighter surface tints to avoid the "muddy" look of dark shadows on black backgrounds. This creates a "layered glass" effect without full glassmorphism transparency.

## Shapes
The shape language is consistently **Rounded**, striking a balance between approachable and professional. 

- **Small (sm):** Used for checkboxes, radio buttons, and small tags.
- **Medium (md):** The default for buttons and input fields.
- **Large (lg):** Reserved for containers, cards, and modal windows.

This tiered approach ensures that as elements get larger, their corners feel proportionately soft, maintaining the tech-focused minimalist vibe.

## Components

- **Buttons:** Primary buttons use a solid `#00AEEF` fill with white text. Hover states should feature a subtle brightness increase (+10%). Secondary buttons use a ghost style with a 1px border and an inset hover effect.
- **Input Fields:** Use a white or dark-navy background depending on the mode. Active states must feature a 2px stroke of the Primary Blue. Labels should always sit above the field in `label-sm`.
- **Cards:** Cards are the primary container for exam questions. They should have a `radius-lg` and a `border-subtle`. No shadow in the default state; apply a "soft shadow" on hover to indicate interactivity.
- **Chips/Badges:** Used for difficulty levels (Easy, Medium, Hard). These should be pill-shaped with a light tint of the primary color or semantic colors (green, amber, red).
- **Progress Indicators:** Use the Primary Blue for active progress. Background tracks should use `border-subtle` colors to remain unobtrusive.
- **Toggle Switches:** Clean, tactile switches with the Primary Blue for the 'on' state. Transitions between Light and Dark mode should be animated with a 300ms ease-in-out curve.