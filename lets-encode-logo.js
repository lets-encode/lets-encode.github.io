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

  // Only the hands are hot zones; each still animates its companion element
  // (apostrophe / note) via the .hover-* CSS, but hovering those does nothing.
  var ZONES = {
    orange: ["orange-hand"],
    blue: ["blue-hand"],
    green: ["green-hand"]
  };
  var HOVER_CLASSES = ["hover-orange", "hover-blue", "hover-green"];

  function initLetsEncodeLogo(svg) {
    svg = svg || document.getElementById("svg1");
    if (!svg) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return; // honour the user's motion preference

    var timer = null;
    var leaveTimer = null;
    var activeZone = null;

    function pauseAuto() {
      if (timer) {
        window.clearTimeout(timer);
        timer = null;
      }
    }

    function scheduleNext() {
      pauseAuto();
      var gap = MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS);
      timer = window.setTimeout(playOnce, SEQUENCE_MS + gap);
    }

    function playOnce() {
      if (activeZone) return; // don't auto-play over an active hover
      svg.classList.remove("play");
      // force reflow so re-adding the class restarts the animations cleanly
      void svg.getBoundingClientRect();
      svg.classList.add("play");
      scheduleNext();
    }

    function setZone(zone) {
      if (leaveTimer) {
        window.clearTimeout(leaveTimer);
        leaveTimer = null;
      }
      activeZone = zone;
      pauseAuto();
      svg.classList.remove("play"); // stop any in-progress auto animation
      HOVER_CLASSES.forEach(function (c) {
        svg.classList.toggle(c, c === "hover-" + zone);
      });
    }

    function clearZone() {
      // Defer slightly: moving between two members of the same zone
      // (e.g. orange hand -> apostrophe) crosses empty space, so we get a
      // mouseleave then a mouseenter. The grace period avoids a flicker.
      if (leaveTimer) window.clearTimeout(leaveTimer);
      leaveTimer = window.setTimeout(function () {
        leaveTimer = null;
        activeZone = null;
        HOVER_CLASSES.forEach(function (c) {
          svg.classList.remove(c);
        });
        scheduleNext(); // resume the automatic loop
      }, 80);
    }

    // Wire up hover zones.
    Object.keys(ZONES).forEach(function (zone) {
      ZONES[zone].forEach(function (id) {
        var el = svg.querySelector("#" + id);
        if (!el) return;
        el.addEventListener("mouseenter", function () {
          setZone(zone);
        });
        el.addEventListener("mouseleave", clearZone);
      });
    });

    // Pause the loop while the tab is hidden; resume when visible again.
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        pauseAuto();
      } else if (!activeZone) {
        playOnce();
      }
    });

    playOnce();
  }

  // Expose for manual init, and auto-run on DOM ready for the default #svg1.
  window.initLetsEncodeLogo = initLetsEncodeLogo;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initLetsEncodeLogo();
    });
  } else {
    initLetsEncodeLogo();
  }
})();
