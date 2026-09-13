(() => {
  "use strict";

  /* ============================================================
     DATA — the nine plates, in journal order.
     Layout alternates for an editorial, non-grid feel.
     ============================================================ */
  const PLATES = [
    {
      src: "images/plate-01.jpg",
      alt: "A pale sky scattered with cloud, seen past the silhouette of a rooftop antenna and cable wires.",
      caption: "I wield the flail of the lashing hail, and whiten the green plains under…",
      layout: "b"
    },
    {
      src: "images/plate-02.jpg",
      alt: "The sun veiled behind a wide sweep of cloud above a city rooftop line and garden path.",
      caption: "I bind the Sun's throne with a burning zone…",
      layout: "b"
    },
    {
      src: "images/plate-03.jpg",
      alt: "Power lines cutting diagonally across a sky heavy with grey and white cloud.",
      caption: "I bring fresh showers for the thirsting flowers, from the seas and the streams…",
      layout: "b"
    },
    {
      src: "images/plate-04.jpg",
      alt: "A temple chariot carried through a gathered crowd under a pale evening sky.",
      caption: "And then again I dissolve it in rain, and laugh as I pass in thunder.",
      layout: "b"
    },
    {
      src: "images/plate-05.jpg",
      alt: "A temple spire and flag silhouetted against a sky streaked pink and blue at dusk.",
      caption: "Sublime on the towers of my skiey bowers, lightning my pilot sits…",
      layout: "b"
    },
    {
      src: "images/plate-06.jpg",
      alt: "A tree-lined road at dusk, riders heading home under a glowing orange sky.",
      caption: "The sanguine Sunrise, with his meteor eyes, and his burning plumes outspread…",
      layout: "b"
    },
    {
      src: "images/plate-07.jpg",
      alt: "Clouds catching the last pink and gold light of the day over rooftops.",
      caption: "Leaps on the back of my sailing rack, when the morning star shines dead…",
      layout: "b"
    },
    {
      src: "images/plate-08.jpg",
      alt: "The sun sinking behind silhouetted trees, the sky fading from gold to grey-blue.",
      caption: "As on the jag of a mountain crag, which an earthquake rocks and swings…",
      layout: "b"
    },
    {
      src: "images/plate-09.jpg",
      alt: "The moon glowing white behind the dark fronds of a palm tree at night.",
      caption: "That orbed maiden with white fire laden, whom mortals call the Moon…",
      layout: "b"
    }
  ];

  const toRoman = (n) => {
    const map = ["I","II","III","IV","V","VI","VII","VIII","IX","X"];
    return map[n - 1] || String(n);
  };

  /* ============================================================
     RENDER PLATES
     ============================================================ */
  const platesContainer = document.getElementById("platesContainer");
  const frag = document.createDocumentFragment();

  PLATES.forEach((p, i) => {
    const article = document.createElement("article");
    article.className = `plate plate--${p.layout}`;
    article.dataset.index = i;

    article.innerHTML = `
      <div class="plate-photo" tabindex="0" role="button" aria-label="Open photograph ${toRoman(i + 1)} in fullscreen">
        <img src="${p.src}" alt="${p.alt}" loading="lazy">
      </div>
      <div class="plate-caption">
        <span class="plate-num">${toRoman(i + 1)}</span>
        <p class="plate-text">${p.caption}</p>
      </div>
    `;
    frag.appendChild(article);
  });
  platesContainer.appendChild(frag);

  /* ============================================================
     LOADER SEQUENCE
     ============================================================ */
  const loader = document.getElementById("loader");
  const loaderCount = document.getElementById("loaderCount");
  const loaderFill = document.getElementById("loaderFill");
  const total = PLATES.length;
  let step = 0;

  function pad(n) { return String(n).padStart(2, "0"); }

  const tickInterval = setInterval(() => {
    step++;
    if (step > total) {
      clearInterval(tickInterval);
      finishLoad();
      return;
    }
    loaderCount.textContent = pad(step);
    loaderFill.style.width = `${(step / total) * 100}%`;
  }, 220);

  function finishLoad() {
    window.setTimeout(() => {
      loader.classList.add("hide");
      document.body.style.overflow = "";
      loader.addEventListener("transitionend", () => loader.remove(), { once: true });
    }, 260);
  }

  document.body.style.overflow = "hidden";
  window.addEventListener("load", () => {
    // ensure a minimum, unhurried loading moment even on fast connections
  });

  /* ============================================================
     SCROLL PROGRESS + NAV STATE
     ============================================================ */
  const scrollBar = document.getElementById("scrollBar");
  const siteNav = document.getElementById("siteNav");

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollBar.style.width = pct + "%";
    siteNav.classList.toggle("scrolled", scrollTop > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  document.getElementById("scrollCue")?.addEventListener("click", () => {
    document.getElementById("plates")?.scrollIntoView({ behavior: "smooth" });
  });

  /* ============================================================
     SCROLL-TRIGGERED REVEALS
     ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

  document.querySelectorAll(".plate").forEach((el) => revealObserver.observe(el));

  /* ============================================================
     SUBTLE HERO PARALLAX
     ============================================================ */
  const heroImg = document.querySelector(".hero-photo img");
  if (heroImg && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroImg.style.transform = `translateY(${y * 0.12}px) scale(1.06)`;
      }
    }, { passive: true });
  }

  /* ============================================================
     CUSTOM CURSOR
     ============================================================ */
  const cursorRing = document.getElementById("cursorRing");
  if (window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("mousemove", (e) => {
      cursorRing.classList.add("active");
      cursorRing.style.left = e.clientX + "px";
      cursorRing.style.top = e.clientY + "px";
    });
    document.querySelectorAll(".plate-photo, .hero-photo").forEach((el) => {
      el.addEventListener("mouseenter", () => cursorRing.classList.add("on-photo"));
      el.addEventListener("mouseleave", () => cursorRing.classList.remove("on-photo"));
    });
    document.addEventListener("mouseleave", () => cursorRing.classList.remove("active"));
  }

  /* ============================================================
     FULLSCREEN VIEWER
     ============================================================ */
  const viewer = document.getElementById("viewer");
  const viewerImg = document.getElementById("viewerImg");
  const viewerNumber = document.getElementById("viewerNumber");
  const viewerCaption = document.getElementById("viewerCaption");
  const viewerClose = document.getElementById("viewerClose");
  const viewerPrev = document.getElementById("viewerPrev");
  const viewerNext = document.getElementById("viewerNext");
  let currentIndex = 0;
  let lastFocused = null;

  function openViewer(index) {
    currentIndex = (index + PLATES.length) % PLATES.length;
    const p = PLATES[currentIndex];
    viewerImg.src = p.src;
    viewerImg.alt = p.alt;
    viewerNumber.textContent = `Plate ${toRoman(currentIndex + 1)} of ${toRoman(PLATES.length)}`;
    viewerCaption.textContent = p.caption;
    lastFocused = document.activeElement;
    viewer.hidden = false;
    requestAnimationFrame(() => viewer.classList.add("open"));
    document.body.style.overflow = "hidden";
    viewerClose.focus();
  }

  function closeViewer() {
    viewer.classList.remove("open");
    document.body.style.overflow = "";
    viewer.addEventListener("transitionend", function handler() {
      viewer.hidden = true;
      viewer.removeEventListener("transitionend", handler);
    }, { once: true });
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll(".plate-photo").forEach((el) => {
    const idx = () => Number(el.closest(".plate").dataset.index);
    el.addEventListener("click", () => openViewer(idx()));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openViewer(idx());
      }
    });
  });

  viewerClose.addEventListener("click", closeViewer);
  viewerPrev.addEventListener("click", () => openViewer(currentIndex - 1));
  viewerNext.addEventListener("click", () => openViewer(currentIndex + 1));
  viewer.addEventListener("click", (e) => { if (e.target === viewer) closeViewer(); });

  document.addEventListener("keydown", (e) => {
    if (viewer.hidden) return;
    if (e.key === "Escape") closeViewer();
    if (e.key === "ArrowRight") openViewer(currentIndex + 1);
    if (e.key === "ArrowLeft") openViewer(currentIndex - 1);
  });

  // mobile swipe
  let touchStartX = 0;
  viewer.addEventListener("touchstart", (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  viewer.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) openViewer(currentIndex + 1);
      else openViewer(currentIndex - 1);
    }
  }, { passive: true });

  /* ============================================================
     RETURN TO SKY interaction
     ============================================================ */
  document.getElementById("returnToSky")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("hero").scrollIntoView({ behavior: "smooth" });
  });

  /* ============================================================
     EASTER EGG — the sky symbol slowly becomes night
     ============================================================ */
  const skySymbol = document.getElementById("skySymbol");
  const starsCanvas = document.getElementById("starsCanvas");
  const nightMessage = document.getElementById("nightMessage");
  const ctx = starsCanvas.getContext("2d");
  let clicks = 0;
  let stars = [];

  function resizeCanvas() {
    starsCanvas.width = window.innerWidth * devicePixelRatio;
    starsCanvas.height = window.innerHeight * devicePixelRatio;
    starsCanvas.style.width = window.innerWidth + "px";
    starsCanvas.style.height = window.innerHeight + "px";
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function seedStars(count) {
    const w = window.innerWidth, h = window.innerHeight;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.2,
        tw: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.015 + 0.005
      });
    }
  }

  let rafId = null;
  function drawStars() {
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    stars.forEach((s) => {
      s.tw += s.speed;
      const alpha = 0.4 + Math.sin(s.tw) * 0.4;
      ctx.beginPath();
      ctx.fillStyle = `rgba(237,235,226,${Math.max(0, alpha)})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    rafId = requestAnimationFrame(drawStars);
  }

  skySymbol.addEventListener("click", () => {
    clicks++;
    skySymbol.style.transform = `scale(${1 + Math.min(clicks, 5) * 0.05})`;
    if (clicks === 5 && !document.body.classList.contains("night-mode")) {
      document.body.classList.add("night-mode");
      seedStars(140);
      drawStars();
      window.setTimeout(() => nightMessage.classList.add("show"), 1800);
      window.setTimeout(() => nightMessage.classList.remove("show"), 8000);
    } else if (clicks >= 10) {
      // a gentle way back, for anyone who found it
      document.body.classList.remove("night-mode");
      if (rafId) cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      stars = [];
      clicks = 0;
      skySymbol.style.transform = "scale(1)";
    }
  });

})();
