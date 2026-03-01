/* =========================================
   Precision Works Detailing - Core Script
   Minimal, smooth, lag-free.
   ========================================= */

(function () {
  // Respect reduced motion preferences
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------------------------
  // 1) Active Nav Highlight
  // ---------------------------
  (function setActiveNav() {
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();

    document.querySelectorAll("[data-nav]").forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      const isActive = href === path;
      a.classList.toggle("active", isActive);
      if (isActive) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  })();

  // ---------------------------
  // 2) Smooth Scroll Anchors
  // ---------------------------
  (function smoothAnchors() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const id = link.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      if (prefersReduced) {
        target.scrollIntoView();
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      history.replaceState(null, "", id);
    });
  })();

  // ---------------------------
  // 3) Page Enter Animation
  // (subtle, fast, safe)
  // ---------------------------
  (function pageEnter() {
    if (prefersReduced) return;

    // Add a tiny class to body for a fade-in
    document.documentElement.classList.add("js");

    // Inline style injection (keeps styles.css unchanged)
    const style = document.createElement("style");
    style.textContent = `
      .js body { opacity: 0; transform: translateY(6px); }
      .js body.is-ready { opacity: 1; transform: translateY(0); transition: opacity 420ms ease, transform 420ms ease; }
    `;
    document.head.appendChild(style);

    // Mark ready after first paint
    requestAnimationFrame(() => {
      document.body.classList.add("is-ready");
    });
  })();

  // ---------------------------
  // 4) Reveal on scroll (optional)
  // Add data-reveal to any element you want animated.
  // Example: <div class="card" data-reveal>...</div>
  // ---------------------------
  (function revealOnScroll() {
    if (prefersReduced) return;

    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!els.length) return;

    // Inject reveal styles (no need to edit CSS file)
    const style = document.createElement("style");
    style.textContent = `
      [data-reveal] { opacity: 0; transform: translateY(10px); transition: opacity 500ms ease, transform 500ms ease; }
      [data-reveal].is-visible { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(style);

    // Intersection Observer
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    els.forEach((el) => io.observe(el));
  })();

  // ---------------------------
  // 5) Small UX: external links safety
  // If you ever add target="_blank", ensure rel is safe.
  // ---------------------------
  (function safeBlankTargets() {
    document.querySelectorAll('a[target="_blank"]').forEach((a) => {
      const rel = (a.getAttribute("rel") || "").toLowerCase();
      if (!rel.includes("noopener")) a.setAttribute("rel", (rel + " noopener").trim());
      if (!rel.includes("noreferrer")) a.setAttribute("rel", (a.getAttribute("rel") + " noreferrer").trim());
    });
  })();

})();
