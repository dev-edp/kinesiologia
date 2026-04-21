/* Kinesiología Terapéutica GM — static site JS */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // --- Header state on scroll ---------------------------------
  const header = $("#site-header");
  const rule = $("#header-rule");
  const logo = $("#logo");
  const nav = header ? header.querySelector("nav") : null;
  const hero = document.body.firstElementChild
    ? document.querySelector("section:first-of-type")
    : null;
  let overHero = true;

  function setHeaderState() {
    if (!header) return;
    const scrolled = window.scrollY > 60;
    // When over hero: text stays paper/white. When scrolled past, switch to ink
    if (scrolled) {
      header.classList.add("bg-paper/95", "backdrop-blur");
      header.classList.remove("text-paper");
      header.classList.add("text-ink");
      if (logo) logo.classList.remove("text-paper");
      if (logo) logo.classList.add("text-ink");
      rule && rule.classList.remove("opacity-0");
      // Nav and side items inherit text-ink from header
      $$("#site-header a, #site-header button").forEach((el) => {
        if (el.id === "logo") return;
        el.classList.remove("text-paper");
      });
    } else {
      header.classList.remove("bg-paper/95", "backdrop-blur", "text-ink");
      header.classList.add("text-paper");
      if (logo) {
        logo.classList.remove("text-ink");
        logo.classList.add("text-paper");
      }
      rule && rule.classList.add("opacity-0");
    }
  }
  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();

  // --- Hero carousel ------------------------------------------
  const carousel = $("[data-hero-carousel]");
  const dots = $$("[data-hero-dots] [data-dot]");
  if (carousel) {
    const slides = $$("[data-slide]", carousel);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let i = 0;
    let timer = null;
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach((el, k) => {
        el.classList.toggle("opacity-100", k === i);
        el.classList.toggle("opacity-0", k !== i);
      });
      dots.forEach((d, k) => {
        const on = k === i;
        d.classList.toggle("bg-paper/80", on);
        d.classList.toggle("bg-paper/30", !on);
      });
    }
    function start() {
      if (reduced) return;
      stop();
      timer = window.setInterval(() => go(i + 1), 6500);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    dots.forEach((d, k) =>
      d.addEventListener("click", () => { go(k); start(); })
    );
    carousel.addEventListener("pointerenter", stop);
    carousel.addEventListener("pointerleave", start);
    go(0);
    start();
  }

  // --- Mobile menu --------------------------------------------
  const menu = $("#mobile-menu");
  const openBtn = $("#menu-toggle");
  const closeBtn = $("#menu-close");
  function openMenu() {
    if (!menu) return;
    menu.classList.remove("translate-y-full");
    document.body.style.overflow = "hidden";
    openBtn && openBtn.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    if (!menu) return;
    menu.classList.add("translate-y-full");
    document.body.style.overflow = "";
    openBtn && openBtn.setAttribute("aria-expanded", "false");
  }
  openBtn && openBtn.addEventListener("click", openMenu);
  closeBtn && closeBtn.addEventListener("click", closeMenu);
  $$("#mobile-menu [data-close]").forEach((a) =>
    a.addEventListener("click", closeMenu)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // --- Scroll reveal ------------------------------------------
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  // --- Smooth anchor scroll w/ header offset ------------------
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y =
        target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  // --- Gallery lightbox ---------------------------------------
  const lightboxes = $$("[data-lightbox] img");
  if (lightboxes.length) {
    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 z-[70] bg-ink/95 opacity-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center p-6";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.innerHTML = `
      <button class="absolute top-5 right-6 text-paper/80 hover:text-paper" aria-label="Close" data-close-lb>
        <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M6 6l12 12M6 18L18 6"/></svg>
      </button>
      <button class="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 text-paper/70 hover:text-paper" aria-label="Previous" data-lb-prev>
        <svg viewBox="0 0 24 24" class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M15 6l-6 6 6 6"/></svg>
      </button>
      <button class="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 text-paper/70 hover:text-paper" aria-label="Next" data-lb-next>
        <svg viewBox="0 0 24 24" class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M9 6l6 6-6 6"/></svg>
      </button>
      <figure class="max-w-6xl w-full">
        <img alt="" class="max-h-[85vh] w-auto mx-auto" data-lb-img>
        <figcaption class="text-paper/70 text-sm mt-4 text-center" data-lb-caption></figcaption>
      </figure>`;
    document.body.appendChild(overlay);
    const lbImg = overlay.querySelector("[data-lb-img]");
    const lbCap = overlay.querySelector("[data-lb-caption]");
    let idx = 0;
    const items = lightboxes.map((img) => ({
      src: img.getAttribute("src"),
      alt: img.getAttribute("alt") || "",
      caption:
        (img.closest("figure") || {}).querySelector
          ? img.closest("figure").querySelector("figcaption")?.textContent || ""
          : "",
    }));
    function show(i) {
      idx = (i + items.length) % items.length;
      lbImg.src = items[idx].src;
      lbImg.alt = items[idx].alt;
      lbCap.textContent = items[idx].caption;
    }
    function open(i) {
      show(i);
      overlay.classList.remove("opacity-0", "pointer-events-none");
      document.body.style.overflow = "hidden";
    }
    function close() {
      overlay.classList.add("opacity-0", "pointer-events-none");
      document.body.style.overflow = "";
    }
    lightboxes.forEach((img, i) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => open(i));
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    overlay.querySelector("[data-close-lb]").addEventListener("click", close);
    overlay
      .querySelector("[data-lb-prev]")
      .addEventListener("click", () => show(idx - 1));
    overlay
      .querySelector("[data-lb-next]")
      .addEventListener("click", () => show(idx + 1));
    document.addEventListener("keydown", (e) => {
      if (overlay.classList.contains("pointer-events-none")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  // --- Leaflet map --------------------------------------------
  const mapEl = document.getElementById("map");
  function initMap() {
    if (!mapEl || !window.L || mapEl.dataset.inited) return;
    mapEl.dataset.inited = "1";
    const L = window.L;
    const coords = [28.3991721, -16.5837597]; // Los Realejos
    const map = L.map(mapEl, {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    }).setView(coords, 15);

    // Clean grayscale tiles — Carto Positron
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> · <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);
    // Label layer on top (only streets/places, no base)
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
      { subdomains: "abcd", maxZoom: 19, opacity: 0.9 }
    ).addTo(map);

    // Custom marker
    const icon = L.divIcon({
      className: "kt-marker",
      html: `
        <div style="position:relative; width:56px; height:56px; transform:translate(-50%,-100%);">
          <div style="width:54px;height:54px;background:#243f38;border:3px solid #fafaf8;border-radius:50%;box-shadow:0 6px 24px rgba(22,32,28,0.35);display:flex;align-items:center;justify-content:center;color:#fafaf8;font-family:Fraunces,Georgia,serif;font-style:italic;font-size:22px;font-weight:500;">GM</div>
          <div style="position:absolute;left:50%;top:calc(100% - 4px);width:2px;height:14px;background:#243f38;"></div>
        </div>`,
      iconSize: [56, 70],
      iconAnchor: [28, 70],
    });
    L.marker(coords, { icon })
      .addTo(map)
      .bindPopup(
        '<div style="font-family:Fraunces,Georgia,serif;font-size:15px;margin-bottom:4px">Kinesiología Terapéutica GM</div>' +
          '<div style="opacity:0.8">C/ Las Hiedras 23 · 38418 Los Realejos</div>' +
          '<div style="margin-top:10px"><a href="https://www.google.com/maps/dir/?api=1&destination=28.3991721,-16.5837597" target="_blank" rel="noopener" style="color:#d88562;text-decoration:underline">Cómo llegar</a></div>'
      );
  }
  if (document.readyState === "complete") initMap();
  else window.addEventListener("load", initMap);
})();
