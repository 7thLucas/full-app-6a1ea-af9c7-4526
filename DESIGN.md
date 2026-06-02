# EventFlow — Design Guidelines

## Design Philosophy
Clean, structured, and professional. Inspired by high-end project management tools and hospitality industry aesthetics. Every element should feel deliberate and refined.

## Color Palette
- **Primary:** Deep Emerald / Forest Green `#1B4332` — conveys trust, growth, elegance
- **Primary Accent:** Sage Green `#52B788` — interactive elements, highlights
- **Background:** Off-white `#F8F9FA` — soft and easy on the eyes
- **Surface:** White `#FFFFFF` — cards and panels
- **Text Primary:** Charcoal `#1C1C1E` — main body text
- **Text Secondary:** Muted Gray `#6B7280` — labels, captions, secondary info
- **Border:** Light Gray `#E5E7EB` — dividers and card outlines
- **Destructive:** `#DC2626` — errors and deletions
- **Warning:** `#D97706` — alerts and caution states
- **Success:** `#16A34A` — confirmations and positive states

## Typography
- **Font Family:** Inter (system fallback: sans-serif)
- **Heading 1:** 28px / 700 weight / tight tracking
- **Heading 2:** 22px / 600 weight
- **Heading 3:** 18px / 600 weight
- **Body:** 14px / 400 weight / relaxed line height
- **Caption / Label:** 12px / 500 weight / uppercase tracking for labels

## Elevation & Shadows
- **Card:** `box-shadow: 0 1px 3px rgba(0,0,0,0.08)` — subtle lift
- **Dropdown/Popover:** `box-shadow: 0 4px 12px rgba(0,0,0,0.12)`
- **Modal:** `box-shadow: 0 8px 32px rgba(0,0,0,0.16)`

## Component Guidelines
- **Buttons:** Rounded corners (`border-radius: 8px`). Primary uses emerald fill. Secondary uses white with border.
- **Cards:** White background, 1px `#E5E7EB` border, 12px border-radius, 16–24px padding.
- **Inputs:** 8px border-radius, `#E5E7EB` border, focus ring in sage green.
- **Sidebar:** Deep Emerald background with white/sage text. Active items highlighted with sage accent.
- **Badges/Tags:** Pill-shaped, color-coded by status (confirmed = green, pending = amber, cancelled = red).
- **Tables:** Alternating subtle row shading, sticky header, sortable columns.
- **Navigation:** Left-side vertical navigation for admin/dashboard views.

## Spacing System
- Base unit: 4px
- Common spacing: 8, 12, 16, 24, 32, 48px
- Page padding: 24–32px

## Icon Set
- Use Lucide React icons — consistent stroke width, 20px default size.

## Responsive Behavior
- Desktop-first design (primary use case is desktop planners).
- Sidebar collapses to icon-only on medium screens.
- Tables scroll horizontally on small screens.
