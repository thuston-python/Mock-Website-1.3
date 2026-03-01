/* =========================================
   Precision Works Detailing - Unified Script
   Smooth, minimal, works across ALL pages.
   ========================================= */

(function () {
  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  // 2) Footer Year (if #yr exists)
  // ---------------------------
  (function setYear() {
    const yr = document.getElementById("yr");
    if (yr) yr.textContent = new Date().getFullYear();
  })();

  // ---------------------------
  // 3) Smooth Scroll Anchors
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
      if (prefersReduced) target.scrollIntoView();
      else target.scrollIntoView({ behavior: "smooth", block: "start" });

      history.replaceState(null, "", id);
    });
  })();

  // ---------------------------
  // 4) Page Enter Animation
  // ---------------------------
  (function pageEnter() {
    if (prefersReduced) return;

    document.documentElement.classList.add("js");
    const style = document.createElement("style");
    style.textContent = `
      .js body { opacity: 0; transform: translateY(6px); }
      .js body.is-ready { opacity: 1; transform: translateY(0); transition: opacity 420ms ease, transform 420ms ease; }
    `;
    document.head.appendChild(style);

    requestAnimationFrame(() => {
      document.body.classList.add("is-ready");
    });
  })();

  // ---------------------------
  // 5) Reveal on scroll (optional)
  // Add data-reveal on any element
  // ---------------------------
  (function revealOnScroll() {
    if (prefersReduced) return;

    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!els.length) return;

    const style = document.createElement("style");
    style.textContent = `
      [data-reveal] { opacity: 0; transform: translateY(10px); transition: opacity 500ms ease, transform 500ms ease; }
      [data-reveal].is-visible { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(style);

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
  // 6) Safe target=_blank links
  // ---------------------------
  (function safeBlankTargets() {
    document.querySelectorAll('a[target="_blank"]').forEach((a) => {
      const rel = (a.getAttribute("rel") || "").toLowerCase();
      if (!rel.includes("noopener")) a.setAttribute("rel", (rel + " noopener").trim());
      if (!rel.includes("noreferrer")) a.setAttribute("rel", (a.getAttribute("rel") + " noreferrer").trim());
    });
  })();

  // ---------------------------
  // 7) Pricing Calculator (index)
  // Works only if pricing elements exist
  // ---------------------------
  (function pricingCalc() {
    const vehicleSize = document.getElementById("vehicleSize");
    const condition = document.getElementById("condition");
    const cards = Array.from(document.querySelectorAll(".priceCard[data-base]"));
    const addOns = Array.from(document.querySelectorAll(".addonCheck[data-add]"));

    if (!vehicleSize || !condition || !cards.length) return;

    function getAddonTotal() {
      return addOns.reduce((sum, el) => sum + (el.checked ? Number(el.dataset.add || 0) : 0), 0);
    }

    function update() {
      const sizeAdd = Number(vehicleSize.value || 0);
      const conditionAdd = Number(condition.value || 0);
      const addonAdd = getAddonTotal();

      cards.forEach((card) => {
        const base = Number(card.dataset.base || 0);
        const total = Math.max(0, base + sizeAdd + conditionAdd + addonAdd);

        const out = card.querySelector(".priceValue");
        if (out) out.textContent = String(total);
      });
    }

    vehicleSize.addEventListener("change", update);
    condition.addEventListener("change", update);
    addOns.forEach((a) => a.addEventListener("change", update));

    update();
  })();

})();
