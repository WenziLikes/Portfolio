# Mobile Matrix

## Goal

The site should remain readable, stable, and easy to navigate across mobile devices commonly encountered between roughly 2018 and 2026.

## Automated Viewport Coverage

Playwright currently covers the following profiles:

| Profile | Viewport | Purpose |
| --- | --- | --- |
| `phone-320` | `320x568` | Small legacy phones and compact fallback layout |
| `phone-360` | `360x740` | Common Android baseline |
| `phone-375` | `375x667` | Older iPhone baseline |
| `phone-390` | `390x844` | Modern standard iPhone width |
| `phone-430` | `430x932` | Large modern phones |
| `tablet-768` | `768x1024` | Tablet portrait |

Desktop Chromium is covered separately.

## Manual Device Targets

Recommended manual checks before launch or after meaningful UI changes:

- iPhone SE class widths
- iPhone 11 through iPhone 16 Plus class widths
- Pixel 5 through Pixel 9 class widths
- Samsung Galaxy S9 through S24 class widths
- iPad portrait around `768px`

## Critical Behaviors

The following behaviors matter more than visual polish:

- hero content stays readable without collision or horizontal overflow
- the mobile top bar stays hidden at the top of `/home` and appears after scroll begins or when the menu opens
- the mobile top bar is visible immediately on non-home routes such as `/about`, `/projects`, and `/resume`
- the mobile menu opens, closes, and updates the active section correctly
- project cards switch into the compact stacked layout at mobile widths
- resume sections remain readable without horizontal scroll
- legal pages remain readable at compact widths
- footer actions and legal links remain tappable above safe-area insets

## Manual QA Checklist

### Navigation

- open the mobile menu
- navigate to each main section
- verify the active link state updates correctly
- verify returning to the top restores the expected home header state

### Layout

- confirm headings do not wrap into broken line stacks
- confirm project cards keep readable text overlays
- confirm the featured project still feels prominent at tablet widths
- confirm footer CTAs do not collide or overflow
- confirm resume sheets and toolbar remain readable without horizontal scroll

### Touch and viewport behavior

- verify no clipped fixed UI around notches and safe areas
- verify tap targets remain usable at `320px`
- verify scrolling remains smooth through the projects section
- verify the theme switcher and menu button remain reachable while the top bar is visible

## Safe-Area Guidance

The project already uses safe-area-aware spacing in navigation-related UI.

Any future fixed-position element should also respect:

- `env(safe-area-inset-top)`
- `env(safe-area-inset-bottom)`

## Performance Notes for Mobile

The main mobile asset risks are:

- the large home background graphic
- oversized project preview assets
- excessive layered visual effects on low-end GPUs

Current mitigation already in place:

- safe-area-aware mobile offsets
- responsive project preview assets
- compact mobile card layout
- local assets instead of third-party hotlinked images

## Release Minimum

Before a public release, confirm:

1. automated Playwright mobile tests pass
2. `320px`, `390px`, and `768px` views are manually reviewed
3. footer, resume, and legal routes remain fully usable on touch devices
