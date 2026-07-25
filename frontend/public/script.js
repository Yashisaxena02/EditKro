(function () {
  "use strict";
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const MP4 = "videos/";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const PROJECTS = [
    { cat: "short-form", tag: "Short-Form", title: "3-Second Hook Reel", client: "Instagram Reels", duo: "d1", big: "Reel", v: "sf1.mp4", wide: true },
    { cat: "song-edits", tag: "Song Edits", title: "Jab Tak — Song Edit", client: "Reels · Music Video", duo: "d9", big: "Song", v: "song1.mp4", sound: true },
    { cat: "song-edits", tag: "Song Edits", title: "Kaun Tujhe — Song Edit", client: "Reels · Music Video", duo: "d5", big: "Beat", v: "song2.mp4", sound: true },
    { cat: "gaming", tag: "Gaming", title: "RGB Setup Montage", client: "YouTube", duo: "d3", big: "Frag", v: "gaming1.mp4" },
    { cat: "cricket", tag: "Cricket Edit", title: "Match Day Highlights", client: "Instagram Reels", duo: "d4", big: "Six", v: "cricket1.mp4" },
    { cat: "anime", tag: "Anime", title: "AMV Transition Edit", client: "TikTok / Shorts", duo: "d8", big: "AMV", v: "anime1.mp4" },
    { cat: "love-stories", tag: "Love Stories", title: "Cinematic Wedding Film", client: "Wedding Film", duo: "d5", big: "Vows", v: "love1.mp4", wide: true },
    { cat: "documentary", tag: "Documentary", title: "Interview Feature", client: "YouTube", duo: "d7", big: "Doc", v: "doc1.mp4" },
    { cat: "travelling", tag: "Travelling", title: "Travel Montage", client: "Reels", duo: "d2", big: "Trip", v: "travel1.mp4" },
    { cat: "long-form", tag: "Long-Form", title: "YouTube Episode Edit", client: "Podcast / Vlog", duo: "d6", big: "Ep.", v: "lf1.mp4", wide: true },
    { cat: "short-form", tag: "Short-Form", title: "Trend Remix Reel", client: "Reels / Shorts", duo: "d1", big: "Loop", v: "sf2.mp4" },
    { cat: "short-form", tag: "Short-Form", title: "Fashion Reel", client: "Instagram", duo: "d1", big: "Style", v: "sf3.mp4" },
    { cat: "cricket", tag: "Cricket Edit", title: "Stadium Story", client: "Reels", duo: "d4", big: "Cover", v: "cricket2.mp4" },
    { cat: "long-form", tag: "Long-Form", title: "Talking-Head Cut", client: "YouTube", duo: "d6", big: "Talk", v: "lf2.mp4" }
  ];

  const grid = $("#grid");
  function cardHTML(p, i) {
    return `
    <article class="card reveal ${p.wide ? "wide" : ""}" data-cat="${p.cat}" data-video="${MP4 + p.v}"
      data-title="${p.title}" data-tag="${p.tag}" data-client="${p.client}" data-sound="${p.sound ? "1" : ""}"
      data-testid="work-card-${i}" style="transition-delay:${(i % 3) * 80}ms">
      <div class="card-media">
        <div class="card-poster ${p.duo}"><span class="pbig">${p.big}</span></div>
        <video muted loop playsinline preload="metadata" poster="${MP4}posters/${p.v.replace(".mp4", ".jpg")}" src="${MP4 + p.v}#t=0.1"></video>
      </div>
      <div class="card-grad"></div>
      ${p.sound ? `<span class="card-sound" data-testid="sound-badge"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>Sound on</span>` : ""}
      <button class="card-play" aria-label="Play preview" data-testid="card-play-${i}">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </button>
      <div class="card-info">
        <span class="card-tag">${p.tag}</span>
        <h3 class="card-title">${p.title}</h3>
        <p class="card-client">${p.client}</p>
      </div>
    </article>`;
  }
  grid.innerHTML = PROJECTS.map(cardHTML).join("");

  $$(".card").forEach((card) => {
    const vid = $("video", card);
    const hasSound = card.dataset.sound === "1";
    let t;
    const play = () => {
      clearTimeout(t);
      card.classList.add("playing");
      if (hasSound) {
        vid.muted = false; vid.volume = 1;
        vid.play().catch(() => { vid.muted = true; vid.play().catch(() => {}); });
      } else {
        vid.play().catch(() => {});
      }
    };
    const stop = () => {
      card.classList.remove("playing");
      t = setTimeout(() => { vid.pause(); if (hasSound) vid.muted = true; try { vid.currentTime = 0.1; } catch (e) {} }, 300);
    };
    card.addEventListener("mouseenter", play);
    card.addEventListener("mouseleave", stop);
    card.addEventListener("click", () => openLightbox(card));
  });

  const filters = $$(".filter");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      $$(".card").forEach((card, i) => {
        const match = f === "all" || card.dataset.cat === f;
        card.classList.toggle("hide", !match);
        if (match) {
          card.style.transitionDelay = (i % 3) * 60 + "ms";
          card.classList.remove("in");
          requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add("in")));
        }
      });
    });
  });

  const lb = $("#lightbox"), lbVideo = $("#lbVideo"), lbClose = $("#lbClose");

  function playInLightbox({ src, tag, title, client }) {
    lbVideo.src = src;
    lbVideo.muted = false;
    $("#lbTag").textContent = tag;
    $("#lbTitle").textContent = title;
    $("#lbClient").textContent = client;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    lbVideo.play().catch(() => {});
  }
  const openLightbox = (card) => playInLightbox({
    src: card.dataset.video, tag: card.dataset.tag,
    title: card.dataset.title, client: card.dataset.client
  });
  function closeLightbox() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    lbVideo.pause();
  }
  lbClose.addEventListener("click", closeLightbox);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

  const heroReel = $("#heroReel");
  if (heroReel) {
    heroReel.addEventListener("click", () => playInLightbox({
      src: "videos/clip-sintel.mp4", tag: "Full Reel",
      title: "Editkaro.in — 2025 Reel", client: "A cut of our best work"
    }));
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach((el) => io.observe(el));

  function animateStat(el) {
    const h = el.querySelector("[data-count]");
    const target = +h.dataset.count, suffix = h.dataset.suffix || "";
    const dur = 1500, t0 = performance.now();
    const tick = (now) => {
      if (!el.dataset.animating) return;
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      h.innerHTML = `<span class="accent">${Math.round(eased * target)}</span>${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const statsIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const el = en.target, h = el.querySelector("[data-count]");
      if (en.isIntersecting) {
        if (!el.dataset.animating) { el.dataset.animating = "1"; animateStat(el); }
      } else {
        delete el.dataset.animating;
        h.innerHTML = `<span class="accent">0</span>${h.dataset.suffix || ""}`;
      }
    });
  }, { threshold: 0.5 });
  $$(".stat").forEach((s) => statsIO.observe(s));

  const nav = $("#nav"), progress = $("#progress");
  const heroVideo = $(".hero-video-wrap video");
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 40);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (y / h) * 100 + "%";
    if (heroVideo && y < window.innerHeight && !reduce) {
      heroVideo.style.transform = `translateY(${y * 0.25}px) scale(1.1)`;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = $("#burger"), mobile = $("#mobileMenu");
  burger.addEventListener("click", () => { mobile.classList.toggle("open"); burger.classList.toggle("active"); });
  $$("#mobileMenu a").forEach((a) => a.addEventListener("click", () => { mobile.classList.remove("open"); }));

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const el = $(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
  });

  const cur = $(".cursor"), dot = $(".cursor-dot"), curLabel = $("#cursorLabel");
  if (cur && window.matchMedia("(hover:hover)").matches) {
    let mx = 0, my = 0, cx = 0, cy = 0;
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    (function loop() {
      cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
      cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    $$('a,button,.filter,.cl-item').forEach((el) => {
      el.addEventListener("mouseenter", () => cur.classList.add("grow"));
      el.addEventListener("mouseleave", () => cur.classList.remove("grow"));
    });
    $$('.card').forEach((el) => {
      el.addEventListener("mouseenter", () => { cur.classList.add("label"); if (curLabel) curLabel.textContent = "Play"; });
      el.addEventListener("mouseleave", () => cur.classList.remove("label"));
    });
    $$('.magnetic').forEach((el) => {
      const strength = 0.34;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * strength}px,${dy * strength}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  const form = $("#quoteForm"), ok = $("#formOk");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const name = $("#name").value.trim();
    const email = $("#email").value.trim();
    const phone = $("#phone").value.trim();
    const type = $("#type").value.trim();
    const message = $("#message").value.trim();
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, project_type: type || null, message })
      });
    } catch (err) { }
    form.reset();
    ok.classList.add("show");
    setTimeout(() => ok.classList.remove("show"), 6000);
  });

  const newsletterForm = $("#newsletterForm"), newsletterOk = $("#newsletterOk");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const emailInput = $("#newsletterEmail");
      const email = emailInput.value.trim();
      if (!email) return;
      newsletterOk.textContent = "Subscribing…";
      newsletterOk.classList.add("show");
      try {
        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        newsletterOk.textContent = "✦ " + (data.message || "Subscribed!");
        emailInput.value = "";
      } catch (err) {
        newsletterOk.textContent = "✦ Something went wrong. Please try again.";
      }
      setTimeout(() => newsletterOk.classList.remove("show"), 5000);
    });
  }

  const ba = $("#ba");
  if (ba) {
    let dragging = false;
    const setPos = (clientX) => {
      const r = ba.getBoundingClientRect();
      let p = ((clientX - r.left) / r.width) * 100;
      p = Math.max(2, Math.min(98, p));
      ba.style.setProperty("--pos", p + "%");
    };
    const getX = (e) => (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX);
    const down = (e) => { dragging = true; setPos(getX(e)); };
    const move = (e) => { if (dragging) setPos(getX(e)); };
    const up = () => { dragging = false; };
    ba.addEventListener("mousedown", down);
    ba.addEventListener("touchstart", down, { passive: true });
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
  }

  $("#year").textContent = new Date().getFullYear();

  const num = $("#loaderNum");
  if (!reduce && num) {
    let n = 0;
    const iv = setInterval(() => {
      n += Math.floor(Math.random() * 16) + 9;
      if (n >= 100) { n = 100; clearInterval(iv); }
      num.textContent = String(n).padStart(2, "0");
    }, 120);
  } else if (num) {
    num.textContent = "100";
  }
  const loaderEl = $("#loader");
  if (loaderEl) {
    window.addEventListener("load", () => setTimeout(() => loaderEl.classList.add("done"), 400));
    setTimeout(() => loaderEl.classList.add("done"), 2600);
  }
})();
