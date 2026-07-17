/* Arkand Care — minimal vanilla JS
   Only two jobs: the mobile navigation toggle and the footer year.
   Everything else on the site works without JavaScript. */

(function () {
  "use strict";

  // Mobile navigation toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close the menu with the Escape key (keyboard users)
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  // Current year in the footer
  var yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Gentle scroll-reveal for cards and section content.
  // Only runs when the browser supports it and the user allows motion —
  // otherwise everything simply stays visible.
  var allowMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (allowMotion && "IntersectionObserver" in window) {
    var targets = document.querySelectorAll(
      ".card, .price-card, .testimonial, .panel-quote, .coming-soon, .section .gold-rule"
    );
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    targets.forEach(function (el, i) {
      el.classList.add("reveal");
      // Small stagger so grids of cards ripple in rather than pop at once
      el.style.transitionDelay = (i % 3) * 80 + "ms";
      observer.observe(el);
    });

    // Safety net: whatever happens, no content may stay hidden. A few
    // seconds after load, reveal anything the observer hasn't caught.
    setTimeout(function () {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }, 4000);
  }
})();
