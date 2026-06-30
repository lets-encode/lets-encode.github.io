/*
 * lets-encode-logo.js
 * Drives the "Let's Encode" animated logo.
 *
 * Requirements:
 *   - The logo SVG must be INLINED into the page (not loaded via <img>),
 *     so its internal CSS animations can be triggered. The root <svg> has id="svg1".
 *   - This script finds that <svg>, plays the hand sequence once, then
 *     replays it automatically at a random interval between 7 and 12 seconds.
 *   - Respects prefers-reduced-motion: if set, the logo stays static.
 *
 * Interactivity:
 *   - Three hover zones, one per hand (only the hands are hot — not the
 *     apostrophe or note). Each hand still drags its companion element along:
 *       orange hand -> orange hand + apostrophe
 *       blue hand   -> blue hand + note
 *       green hand  -> green hand
 *   - While the cursor is over a hand, that zone's transform eases to the
 *     "peak" of its animation (the bottom of the boop, etc.) and holds there;
 *     when the cursor leaves, it eases back (the return leg). This is driven by
 *     CSS transitions on the .hover-* classes (see the SVG's inline styles).
 *   - The automatic-random-animation timer is paused while a zone is hovered
 *     and resumes once the cursor is off all zones.
 *
 * Usage:
 *   <script src="lets-encode-logo.js" defer></script>
 *   (or import and call initLetsEncodeLogo() yourself after the SVG is in the DOM)
 */
(function () {
  "use strict";

  // Full sequence length in ms: green hand starts at 0.525s and runs 0.45s.
  var SEQUENCE_MS = 975;
  var MIN_GAP_MS = 7000;
  var MAX_GAP_MS = 12000;

  // Individual hover zones: each hand plus the glyph it tweaks. Hovering any of
  // these replays that hand's own gesture once (a full loop, not a hold).
  var ZONES = {
    orange: ["orange-hand", "apostrophe"],
    blue:   ["blue-hand", "note"],
    green:  ["green-hand"]
  };
  var ZONE_MS = 650; // a touch longer than the longest single gesture (~0.55s)

  function initLetsEncodeLogo(svg) {
    svg = svg || document.getElementById("svg1");
    if (!svg) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return; // honour the user's motion preference

    var timer = null;
    var comboPlaying = false;
    var zoneBusy = {};

    function pauseAuto() {
      if (timer) { window.clearTimeout(timer); timer = null; }
    }

    function scheduleNext() {
      pauseAuto();
      var gap = MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS);
      timer = window.setTimeout(playCombo, SEQUENCE_MS + gap);
    }

    // Automated combo: the full staggered orange -> blue -> green sequence.
    // .play is removed once the sequence ends so it can't keep an identical
    // animation applied to the hands and shadow the per-hand hover replays.
    function playCombo() {
      svg.classList.remove("play");
      void svg.getBoundingClientRect(); // reflow so the animation restarts cleanly
      svg.classList.add("play");
      comboPlaying = true;
      window.setTimeout(function () {
        svg.classList.remove("play");
        comboPlaying = false;
      }, SEQUENCE_MS + 50);
      scheduleNext();
    }

    // One hand's own gesture, played once when its zone is hovered.
    function playZone(zone) {
      if (zoneBusy[zone]) return; // don't restart mid-gesture
      var cls = "play-" + zone;
      svg.classList.remove(cls);
      void svg.getBoundingClientRect();
      svg.classList.add(cls);
      zoneBusy[zone] = true;
      window.setTimeout(function () {
        svg.classList.remove(cls);
        zoneBusy[zone] = false;
      }, ZONE_MS);
    }

    Object.keys(ZONES).forEach(function (zone) {
      ZONES[zone].forEach(function (id) {
        var el = svg.querySelector("#" + id);
        if (el) el.addEventListener("mouseenter", function () { playZone(zone); });
      });
    });

    // Pause the auto-combo while the tab is hidden; resume when visible again.
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { pauseAuto(); }
      else if (!comboPlaying) { playCombo(); }
    });

    playCombo();
  }

  // Expose for manual init, and auto-run on DOM ready for the default #svg1.
  window.initLetsEncodeLogo = initLetsEncodeLogo;

  // Guard so a logo-init error can never abort the script before the
  // header-hands initialiser (below) runs.
  function safeInitLogo() {
    try { initLetsEncodeLogo(); } catch (e) { /* logo stays static; hands still load */ }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", safeInitLogo);
  } else {
    safeInitLogo();
  }
})();

/* ---------------------------------------------------------------------------
 * Header hands
 *
 * Each section <h2> carries a small cartoon hand that "tweaks" a glyph in the
 * heading (see styles.css — the .gx / .hand / .hpic mechanic). This driver
 * plays each hand's animation once, then replays at a random 6–10s interval,
 * staggered so they don't move in unison. Hovering anywhere on a heading
 * replays its hand immediately and suspends that hand's auto-timer so the two
 * never collide; leaving resumes the loop. Honours prefers-reduced-motion.
 * ------------------------------------------------------------------------- */
(function () {
  "use strict";

  function initHeaderHands() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    Array.prototype.forEach.call(document.querySelectorAll(".gx"), function (el, idx) {
      var timer = null;
      function play() {
        el.classList.remove("go");
        void el.offsetWidth; // force reflow so the animation restarts cleanly
        el.classList.add("go");
      }
      function schedule() {
        timer = window.setTimeout(function () { play(); schedule(); }, 6000 + Math.random() * 4000);
      }
      el._play = play;
      el._pause = function () { if (timer) { window.clearTimeout(timer); timer = null; } };
      el._resume = schedule;
      window.setTimeout(function () { play(); schedule(); }, 800 + idx * 850);
    });

    // One trigger mechanism only: hover on devices that have it, touch on those
    // that don't. We never bind "click", so a tap doesn't double-fire and a
    // mouse click on desktop stays inert.
    var canHover = window.matchMedia("(hover: hover)").matches;
    Array.prototype.forEach.call(document.querySelectorAll("h2"), function (h2) {
      var gx = h2.querySelector(".gx");
      if (!gx) return;
      if (canHover) {
        h2.addEventListener("mouseenter", function () { gx._pause(); gx._play(); });
        h2.addEventListener("mouseleave", function () { gx._pause(); gx._resume(); });
      } else {
        // Touch screens: replay once on tap, then restart the auto-loop clock.
        h2.addEventListener("touchstart", function () {
          gx._pause(); gx._play(); gx._resume();
        }, { passive: true });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeaderHands);
  } else {
    initHeaderHands();
  }
})();
