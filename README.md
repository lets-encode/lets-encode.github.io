# Let's Encode — animated logo package

A self-contained animated version of the "Let's Encode" logo. Three hands animate
in a subtle, cascading sequence:

1. **Orange hand** twiddles the apostrophe (slight rotation + faint pinch).
2. **Blue hand** boops the music note (small diagonal dip).
3. **Green hand** pops the thumbs-up (small scale).

Each hand starts as the previous one reaches its midpoint, so the motion flows
continuously and finishes in just under one second, settling exactly on the
static logo. The sequence then replays automatically at a random interval
between 8 and 16 seconds.

## Files

- `lets-encode-logo.svg` — the logo with its animation CSS built in. Animations
  are gated behind a `.play` class on the root `<svg id="svg1">`, so they only
  run when triggered by the accompanying script.
- `lets-encode-logo.js` — finds the inlined SVG, plays the sequence once, then
  replays it on a random 8–16s loop. Respects `prefers-reduced-motion` (stays
  static if the user prefers reduced motion) and pauses while the tab is hidden.
- `example.html` — a minimal working integration.

## How to use

The SVG must be **inlined** into the page so the script can toggle its `.play`
class. An `<img src="...svg">` or CSS `background-image` will display the logo
but cannot animate it.

1. Paste the contents of `lets-encode-logo.svg` directly into your HTML where the
   logo should appear (e.g. inside a sized container).
2. Include the script: `<script src="lets-encode-logo.js" defer></script>`.
3. Size the logo by sizing its container; the SVG scales to fit.

The script auto-initialises on DOM ready for the default `#svg1`. If your
framework inlines the SVG later (e.g. after a fetch), call
`window.initLetsEncodeLogo(svgElement)` once the SVG is in the DOM.

## Notes & constraints

- The animation lives entirely in the SVG's internal `<style>` block; the JS only
  toggles the `.play` class to start/restart it.
- The "pinch" on the orange hand is a subtle faked squash — the hand artwork is a
  single path, so it is not an articulated thumb-to-finger pinch.
- The static (non-playing) logo is pixel-identical to the original source artwork.

---

## Prompt for Claude Code

Copy the text below to hand this package to Claude Code:

> I'm adding an animated logo to a project website. This package contains:
>
> - `lets-encode-logo.svg` — the logo with built-in CSS animations, gated behind
>   a `.play` class on the root `<svg id="svg1">`.
> - `lets-encode-logo.js` — plays the animation once, then replays it on a random
>   8–16 second loop; respects `prefers-reduced-motion` and pauses on hidden tabs.
> - `example.html` — a reference integration.
>
> Please integrate the logo into the site as a featured element (e.g. the hero or
> header). Requirements:
>
> 1. Inline the SVG into the markup (do NOT use `<img>` or a CSS background — the
>    animation needs the SVG in the DOM so the script can toggle its `.play`
>    class). Match the project's component conventions (if it's React/Vue/etc.,
>    create an appropriate component; if it's static HTML, inline it directly).
> 2. Wire up `lets-encode-logo.js` so it initialises after the SVG is in the DOM.
>    If the framework renders the SVG asynchronously, call
>    `window.initLetsEncodeLogo(svgEl)` with the mounted element instead of
>    relying on the auto-init.
> 3. Make the logo responsive: size it via its container so it scales cleanly on
>    mobile and desktop. Keep its aspect ratio.
> 4. Ensure it degrades gracefully: the static logo must render correctly with JS
>    disabled and when `prefers-reduced-motion` is set.
> 5. Don't alter the animation timing or the artwork. If you need to restyle, do it
>    through the surrounding layout, not by editing the SVG's internal CSS.
>
> Tell me where you placed it and how to adjust its size, and flag anything about
> the project's setup that affects how the SVG should be inlined.
