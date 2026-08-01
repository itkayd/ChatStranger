/* Arkand Care — vanilla JS enhancements (no libraries, no build step)
   Progressive enhancement: every effect is optional. With JS off, or under
   "prefers-reduced-motion", the site is fully usable and all content shows.

   Jobs:
     1. Mobile navigation toggle
     2. Footer year
     3. Header condense + gold scroll-progress bar
     4. Hero entrance sequence
     5. Gold-dust particle canvas in the hero
     6. Scroll-reveal for cards / sections (with a safety net)
     7. 3D pointer tilt + light sheen on cards
     8. Animated number counters in the trust strip
*/

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var allowMotion = !reduceMotion;
  var docEl = document.documentElement;

  // Signal to CSS that JS is active (used for the hero entrance)
  document.body.classList.add("js-on");

  /* ---------- 1. Mobile navigation toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- 2. Footer year ---------- */
  var yearEl = document.getElementById("footer-year");
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ---------- 3. Header condense + scroll progress ---------- */
  var header = document.querySelector(".site-header");
  var progress = document.querySelector(".scroll-progress");

  /* ---------- Pinned "Threshold" scene + parallax (set up here) ---------- */
  var pinScene = document.getElementById("pin-scene");
  var pinWords = pinScene ? pinScene.querySelectorAll(".pin-word") : [];
  var parallaxEls = document.querySelectorAll("[data-parallax]");

  // Switch on the tall pinned scroll effect only when motion is allowed
  if (pinScene && allowMotion) { pinScene.classList.add("pin-active"); }

  function updateScrollScenes() {
    var vh = window.innerHeight;

    // Pinned scene: progress 0→1 as the section travels through the viewport
    if (pinScene && allowMotion) {
      var rect = pinScene.getBoundingClientRect();
      var total = rect.height - vh;
      var p = total > 0 ? (-rect.top) / total : 0;
      p = Math.max(0, Math.min(1, p));
      pinScene.style.setProperty("--p", p.toFixed(3));

      // Light each word in sequence across the first ~70% of the scroll
      var lit = Math.floor(p / 0.7 * pinWords.length);
      for (var i = 0; i < pinWords.length; i++) {
        pinWords[i].classList.toggle("lit", i < lit);
        // The final word "doorstep." glows gold once reached
        if (i === pinWords.length - 1) {
          pinWords[i].classList.toggle("gold", i < lit);
        }
      }
    }

    // Parallax layers
    for (var j = 0; j < parallaxEls.length; j++) {
      var el = parallaxEls[j];
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0.2;
      var r = el.getBoundingClientRect();
      var offset = (r.top + r.height / 2 - vh / 2) * -speed;
      el.style.setProperty("--shift", offset.toFixed(1) + "px");
    }
  }

  var ticking = false;
  function onScroll() {
    var y = window.pageYOffset || docEl.scrollTop;
    if (header) { header.classList.toggle("scrolled", y > 24); }
    if (progress) {
      var h = docEl.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateScrollScenes();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();
  updateScrollScenes();

  /* ---------- 4. Hero entrance sequence ---------- */
  var hero = document.querySelector(".hero");
  if (hero) {
    // Next frame so the initial (hidden) state paints first
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.add("hero-ready");
      });
    });
  }

  /* ---------- 5. Gold-dust particle canvas ---------- */
  var canvas = document.querySelector(".hero-canvas");
  if (canvas && hero && allowMotion) {
    var ctx = canvas.getContext("2d");
    var particles = [];
    var raf = null;
    var w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    function size() {
      w = hero.clientWidth;
      h = hero.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Particle count scales with area but stays modest for performance
      var count = Math.min(70, Math.round((w * h) / 22000));
      particles = [];
      for (var i = 0; i < count; i++) { particles.push(makeParticle()); }
    }

    function makeParticle() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.5,
        vy: -(Math.random() * 0.35 + 0.08),
        vx: (Math.random() - 0.5) * 0.25,
        a: Math.random() * 0.5 + 0.15,
        tw: Math.random() * 0.02 + 0.005
      };
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.y += p.vy;
        p.x += p.vx;
        p.a += p.tw;
        if (p.a > 0.7 || p.a < 0.12) { p.tw *= -1; }
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        if (p.x < -5) { p.x = w + 5; } else if (p.x > w + 5) { p.x = -5; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(204, 160, 64, " + p.a.toFixed(3) + ")";
        ctx.shadowColor = "rgba(204, 160, 64, 0.6)";
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    size();
    frame();

    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(size, 200);
    });

    // Pause the animation when the hero is off-screen (saves battery/CPU)
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            if (!raf) { frame(); }
          } else if (raf) {
            cancelAnimationFrame(raf);
            raf = null;
          }
        });
      }, { threshold: 0 }).observe(hero);
    }
  }

  /* ---------- 6. Scroll-reveal ---------- */
  if (allowMotion && "IntersectionObserver" in window) {
    var targets = document.querySelectorAll(
      ".card, .price-card, .testimonial, .panel-quote, .coming-soon, " +
      ".section .gold-rule, .trust-item, [data-reveal]"
    );
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    targets.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 3) * 80 + "ms";
      revealObs.observe(el);
    });

    // Safety net: never leave content hidden
    setTimeout(function () {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
    }, 4000);
  }

  /* ---------- 7. Card 3D tilt + pointer sheen ---------- */
  if (allowMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var cards = document.querySelectorAll(".card");
    cards.forEach(function (card) {
      // Inject the sheen layer once
      var sheen = document.createElement("span");
      sheen.className = "card-sheen";
      card.appendChild(sheen);

      card.addEventListener("mouseenter", function () {
        card.classList.add("is-tilting");
      });

      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var rx = (py - 0.5) * -7;   // rotateX
        var ry = (px - 0.5) * 7;    // rotateY
        card.style.transform =
          "rotateX(" + rx.toFixed(2) + "deg) rotateY(" +
          ry.toFixed(2) + "deg) translateY(-6px)";
        sheen.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        sheen.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      });

      card.addEventListener("mouseleave", function () {
        card.classList.remove("is-tilting");
        card.style.transform = "";
      });
    });
  }

  /* ---------- 8. Contact form: AJAX submit (stay on page) ---------- */
  var form = document.getElementById("contact-form");
  if (form && window.fetch) {
    var successPanel = document.getElementById("form-success");
    var errorNote = document.getElementById("form-error");
    var submitBtn = form.querySelector(".btn-submit");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (errorNote) { errorNote.hidden = true; }
      if (submitBtn) { submitBtn.classList.add("is-loading"); }

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      })
        .then(function (response) {
          if (response.ok) {
            // Swap the form out for the animated success panel
            form.hidden = true;
            if (successPanel) {
              successPanel.hidden = false;
              // next frame so the .show animation actually runs
              requestAnimationFrame(function () {
                successPanel.classList.add("show");
              });
              // Bring the confirmation into view gently
              successPanel.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "center"
              });
            }
            form.reset();
          } else {
            showFormError();
          }
        })
        .catch(showFormError)
        .then(function () {
          if (submitBtn) { submitBtn.classList.remove("is-loading"); }
        });
    });

    function showFormError() {
      if (errorNote) {
        errorNote.hidden = false;
        errorNote.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "center"
        });
      }
    }
  }

  /* ---------- 9. Animated counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var decimals = (target % 1 !== 0) ? 1 : 0;
      if (!allowMotion) {
        el.textContent = target.toFixed(decimals) + suffix;
        return;
      }
      var start = null, dur = 1500;
      var step = function (ts) {
        if (!start) { start = ts; }
        var t = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (t < 1) { requestAnimationFrame(step); }
        else { el.textContent = target.toFixed(decimals) + suffix; }
      };
      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      var countObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            runCount(e.target);
            countObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { countObs.observe(el); });
    } else {
      counters.forEach(runCount);
    }
  }
})();
