import { initPetalsEngine } from './petals.js';

/**
 * Horimiya Memorial Experience - Master Controller
 * Updated per 2026-10-02 · Ultra-lightweight, High-Fidelity & Zero-Jank
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Ultra-lightweight Sakura & Leaves Canvas Engine
  initPetalsEngine();

  // 2. Cinematic Hero Camera Director with 100% Accurate Readiness Detection (3.5s Camera Sequence)
  initHeroCameraDirector();

  // 3. High-Performance Horizontal Scrolling & Slide Navigation Controller (Zero-Clutch)
  initHorizontalScrolling();

  // 4. Symmetrical 1-Position Morph Chamber & Dual-Selectable Slider (Izumi Miyamura)
  initMorphChamber();

  // 5. Symmetrical 1-Position Morph Chamber & Dual-Selectable Slider (Hanako-kun)
  initHanakoChamber();

  // 6. Ambient Romance Audio Synthesizer
  initAudioEngine();

  // 7. Persistent Memorial Guestbook
  initGuestbook();
});

/* ==========================================================================
   BERANDA ASSET READINESS DETECTOR & DEFERRED MEDIA CACHE
   - Prioritas Utama: Hanya load & decode gambar beranda hingga 100% siap
   - Menampilkan "Loading Animation" sampai gambar utama beranda siap
   - Media slide lain di-load secara deferred setelah beranda tampil
   ========================================================================== */
function waitForBerandaReady() {
  const heroImg = document.querySelector('.hero-cinematic-img');
  const loadingScreen = document.getElementById('beranda-loading-screen');
  const progressBar = document.getElementById('beranda-loading-bar');

  return new Promise((resolve) => {
    if (!heroImg) {
      if (loadingScreen) loadingScreen.classList.add('loaded');
      resolve();
      return;
    }

    let isResolved = false;
    const finalizeReady = () => {
      if (isResolved) return;
      isResolved = true;
      if (progressBar) progressBar.style.width = '100%';

      requestAnimationFrame(() => {
        setTimeout(() => {
          if (loadingScreen) {
            loadingScreen.classList.add('loaded');
          }
          resolve();
        }, 90);
      });
    };

    // Modern browser standard: HTMLImageElement.prototype.decode
    // Memastikan gambar ter-download DAN ter-decode sempurna ke GPU texture buffer
    if (heroImg.complete && heroImg.naturalWidth > 0) {
      if ('decode' in heroImg) {
        heroImg.decode().then(finalizeReady).catch(finalizeReady);
      } else {
        finalizeReady();
      }
      return;
    }

    if (progressBar) progressBar.style.width = '45%';

    const handleLoad = () => {
      if (progressBar) progressBar.style.width = '85%';
      if ('decode' in heroImg) {
        heroImg.decode().then(finalizeReady).catch(finalizeReady);
      } else {
        finalizeReady();
      }
    };

    heroImg.addEventListener('load', handleLoad, { once: true });
    heroImg.addEventListener('error', finalizeReady, { once: true });

    // Safety timeout: 4s maximum
    setTimeout(finalizeReady, 4000);
  });
}

function initDeferredSecondaryMedia() {
  const SECONDARY_MEDIA = [
    '/assets/horimiya/horimiya-romance-duo-clean.webp',
    '/assets/horimiya/horimiya-hero-bg.webp',
    '/assets/horimiya/miyamura-fullbody.webp',
    '/assets/horimiya/katagiri-hallway.webp',
    '/assets/horimiya/miyamura-early.webp',
    '/assets/horimiya/miyamura-adult.webp',
    '/assets/horimiya/miyamura-rooftop.webp',
    '/assets/horimiya/miyamura-rings.webp',
    '/assets/horimiya/katagiri-sunset.webp',
    '/assets/horimiya/katagiri-town.webp',
    '/assets/horimiya/miyamura-portrait.webp',
    '/assets/horimiya/horimiya-romance-duo.webp',
    '/assets/horimiya/sakura-tree-left.webp',
    '/assets/horimiya/sakura-tree-right.webp',
    '/assets/horimiya/roblox-miyamura-grad.webp',
    '/assets/horimiya/roblox-miyamura-early.webp',
    '/assets/horimiya/roblox-miyamura-adult.webp',
    '/assets/horimiya/hanako-anime-classic.webp',
    '/assets/horimiya/hanako-anime-amane.webp',
    '/assets/horimiya/hanako-anime-latest.webp',
    '/assets/horimiya/hanako-roblox-classic.webp',
    '/assets/horimiya/hanako-roblox-amane.webp',
    '/assets/horimiya/hanako-roblox-latest.webp',
    '/assets/horimiya/kamome-rooftop-bg.webp'
  ];

  const schedulePreload = () => {
    window._horimiyaSecondaryTextures = SECONDARY_MEDIA.map((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      return img;
    });

    if ('caches' in window) {
      caches.open('horimiya-media-cache-v1').then((cache) => {
        cache.addAll(SECONDARY_MEDIA).catch(() => {});
      });
    }
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(schedulePreload, { timeout: 3000 });
  } else {
    setTimeout(schedulePreload, 1500);
  }
}

/* ==========================================================================
   HERO 3.5-SECOND CINEMATIC CAMERA DIRECTOR
   - Animasi kamera diawali di atas persis setara wajah kedua karakter
   - Bergerak menurun secara halus sembari zoomout dengan kecepatan yang perlahan meningkat
   - Total durasi pergerakan kamera: tepat 3.5 detik
   ========================================================================== */
export function triggerHeroCameraAnimation() {
  const heroImg = document.querySelector('.hero-cinematic-img');
  const heroFlare = document.querySelector('.hero-sky-flare');
  if (!heroImg) return;

  // Hapus class animasi untuk reset
  heroImg.classList.remove('hero-camera-active');
  if (heroFlare) heroFlare.classList.remove('hero-flare-active');

  // Trigger browser synchronous reflow untuk merestart CSS keyframe secara instan
  void heroImg.offsetWidth;

  // Jalankan ulang animasi kamera 3.5 detik
  heroImg.classList.add('hero-camera-active');
  if (heroFlare) heroFlare.classList.add('hero-flare-active');
}

function initHeroCameraDirector() {
  // Tunggu hingga gambar beranda 100% loaded dan ter-decode di GPU
  waitForBerandaReady().then(() => {
    triggerHeroCameraAnimation();

    // Baru mulai unduh media sekunder di background setelah animasi kamera selesai (3.8s)
    // agar thread CPU dan GPU 100% didedikasikan untuk kelancaran animasi tanpa interferensi
    setTimeout(() => {
      initDeferredSecondaryMedia();
    }, 3800);
  });
}

/* ==========================================================================
   HORIZONTAL SCROLLING & NAVIGATION CONTROLLER (Zero-Clutch, Silky Smooth)
   ========================================================================== */
function initHorizontalScrolling() {
  const container = document.getElementById('horizontal-container');
  if (!container) return;

  const slides = Array.from(document.querySelectorAll('section.screen-slide'));
  const dots = Array.from(document.querySelectorAll('.horizontal-dot'));
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const btnPrev = document.getElementById('nav-btn-prev');
  const btnNext = document.getElementById('nav-btn-next');
  const counterLabel = document.getElementById('slide-counter-label');

  let currentSlideIndex = 0;
  let previousSlideIndex = -1;
  const totalSlides = slides.length;
  let isNavigating = false;
  let snapRestoreTimeout = null;

  function scrollToSlide(idx, forceReanimate = false) {
    if (idx < 0) idx = 0;
    if (idx >= totalSlides) idx = totalSlides - 1;
    const fromIdx = currentSlideIndex;
    currentSlideIndex = idx;
    isNavigating = true;

    // Jika pengguna menuju atau kembali ke Slide 1 (Beranda), jalankan animasi kamera sinematik
    if (idx === 0 && (fromIdx !== 0 || forceReanimate)) {
      triggerHeroCameraAnimation();
    }

    const targetSlide = slides[idx];
    if (targetSlide) {
      // Temporarily disable scrollSnapType to prevent compositor snap fight / clutch
      container.style.scrollSnapType = 'none';

      container.scrollTo({
        left: targetSlide.offsetLeft,
        behavior: 'smooth'
      });

      clearTimeout(snapRestoreTimeout);
      snapRestoreTimeout = setTimeout(() => {
        container.style.scrollSnapType = 'x mandatory';
        isNavigating = false;
      }, 480);
    }

    updateUI(idx);
  }

  function updateUI(idx) {
    const fromIdx = previousSlideIndex;
    previousSlideIndex = currentSlideIndex;
    currentSlideIndex = idx;

    // Jika scroll pasif (misal swipe atau wheel) kembali membuka Slide 1 (Beranda)
    if (idx === 0 && fromIdx > 0) {
      triggerHeroCameraAnimation();
    }

    // Update Counter (e.g. "01 / 06")
    if (counterLabel) {
      counterLabel.textContent = `0${idx + 1} / 0${totalSlides}`;
    }

    // Update Dots & a11y attributes
    dots.forEach((dot, i) => {
      const isCurrent = i === idx;
      dot.classList.toggle('active', isCurrent);
      dot.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });

    // Update Header Navigation Links & a11y attributes
    navLinks.forEach((link, i) => {
      const isCurrent = i === idx;
      link.classList.toggle('active', isCurrent);
      if (isCurrent) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    // Update Prev / Next Buttons state
    if (btnPrev) {
      const isStart = idx === 0;
      btnPrev.classList.toggle('disabled', isStart);
      btnPrev.setAttribute('aria-disabled', isStart ? 'true' : 'false');
    }
    if (btnNext) {
      const isEnd = idx === totalSlides - 1;
      btnNext.classList.toggle('disabled', isEnd);
      btnNext.setAttribute('aria-disabled', isEnd ? 'true' : 'false');
    }
  }

  // Prev / Next button clicks
  if (btnPrev) {
    btnPrev.addEventListener('click', () => scrollToSlide(currentSlideIndex - 1));
  }
  if (btnNext) {
    btnNext.addEventListener('click', () => scrollToSlide(currentSlideIndex + 1));
  }

  // Click dot to jump directly (re-trigger camera animation if jumping to Slide 1)
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => scrollToSlide(idx, idx === 0));
  });

  // Header links navigation with keyboard support (re-trigger camera animation if jumping to Slide 1)
  navLinks.forEach((link, idx) => {
    const handleNav = (e) => {
      e.preventDefault();
      scrollToSlide(idx, idx === 0);
    };
    link.addEventListener('click', handleNav);
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleNav(e);
      }
    });
  });

  // Smooth Discrete Desktop Mouse Wheel Controller
  let wheelAccumulator = 0;
  let wheelCooldown = false;

  container.addEventListener(
    'wheel',
    (e) => {
      // If vertical mouse wheel is dominant
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        wheelAccumulator += e.deltaY;

        if (wheelCooldown || isNavigating) return;

        if (Math.abs(wheelAccumulator) >= 30) {
          wheelCooldown = true;
          if (wheelAccumulator > 0) {
            scrollToSlide(currentSlideIndex + 1);
          } else {
            scrollToSlide(currentSlideIndex - 1);
          }
          wheelAccumulator = 0;
          setTimeout(() => {
            wheelCooldown = false;
          }, 360);
        }
      }
    },
    { passive: false }
  );

  // Keyboard navigation (ArrowLeft / ArrowRight / PageUp / PageDown)
  window.addEventListener('keydown', (e) => {
    // Avoid hijacking keys if user is typing in guestbook form inputs
    const activeTag = document.activeElement ? document.activeElement.tagName : '';
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) {
      return;
    }

    if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key)) {
      e.preventDefault();
      scrollToSlide(currentSlideIndex + 1);
    } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      scrollToSlide(currentSlideIndex - 1);
    }
  });

  // Passive, RAF-debounced scroll listener for indicator synchronization
  let scrollTicking = false;
  container.addEventListener(
    'scroll',
    () => {
      if (isNavigating) return;
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          const scrollPos = container.scrollLeft;
          const slideWidth = window.innerWidth;
          const nearestIdx = Math.round(scrollPos / slideWidth);
          if (nearestIdx !== currentSlideIndex && nearestIdx >= 0 && nearestIdx < totalSlides) {
            updateUI(nearestIdx);
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  // Initialize first slide UI state
  updateUI(0);
}

/* ==========================================================================
   3-VARIANT CHARACTER MORPH: DUAL VIEWPORTS (ANIME & ROBLOX)
   Trigger: Double-click pada kontainer untuk membuka konfigurasi slider pop-up
   ========================================================================== */
function initMorphChamber() {
  const VARIANTS = {
    graduation: {
      key: 'graduation',
      name: 'Pas Lulus (Angkatan 63)',
      animeSrc: '/assets/horimiya/miyamura-fullbody.webp',
      robloxSrc: '/assets/horimiya/roblox-miyamura-grad.webp'
    },
    early: {
      key: 'early',
      name: 'Tahun ke-1 (Awal Masuk)',
      animeSrc: '/assets/horimiya/miyamura-early.webp',
      robloxSrc: '/assets/horimiya/roblox-miyamura-early.webp'
    },
    adult: {
      key: 'adult',
      name: 'Dewasa / Bekerja',
      animeSrc: '/assets/horimiya/miyamura-adult.webp',
      robloxSrc: '/assets/horimiya/roblox-miyamura-adult.webp'
    }
  };

  let activeTarget = 'anime'; // 'anime' | 'roblox'
  let sliderModeAnime = false;
  let sliderModeRoblox = false;
  let currentPhase = 'graduation';

  // Anime DOM elements
  const layerGrad = document.getElementById('morph-layer-grad');
  const layerEarly = document.getElementById('morph-layer-early');
  const layerAdult = document.getElementById('morph-layer-adult');
  const splitBoxAnime = document.getElementById('split-slider-box-anime');
  const splitImgLeftAnime = document.getElementById('split-img-left-anime');
  const splitImgRightAnime = document.getElementById('split-img-right-anime');
  const splitDividerAnime = document.getElementById('split-divider-anime');
  const viewportAnime = document.getElementById('morph-viewport-anime');

  // Roblox DOM elements
  const robloxGrad = document.getElementById('roblox-layer-grad');
  const robloxEarly = document.getElementById('roblox-layer-early');
  const robloxAdult = document.getElementById('roblox-layer-adult');
  const splitBoxRoblox = document.getElementById('split-slider-box-roblox');
  const splitImgLeftRoblox = document.getElementById('split-img-left-roblox');
  const splitImgRightRoblox = document.getElementById('split-img-right-roblox');
  const splitDividerRoblox = document.getElementById('split-divider-roblox');
  const viewportRoblox = document.getElementById('morph-viewport-roblox');

  // Pop-up Modal elements
  const modalBackdrop = document.getElementById('slider-config-modal');
  const modalCloseBtn = document.getElementById('btn-modal-close');
  const modalTitle = document.getElementById('modal-config-title');
  const btnTargetAnime = document.getElementById('btn-target-anime');
  const btnTargetRoblox = document.getElementById('btn-target-roblox');
  const selectLeft = document.getElementById('select-slider-left');
  const selectRight = document.getElementById('select-slider-right');
  const btnToggleSlider = document.getElementById('btn-toggle-slider');
  const sliderToggleLabel = document.getElementById('slider-toggle-label');

  const tabButtons = Array.from(document.querySelectorAll('.morph-tab-btn'));

  function renderPhase(k) {
    if (!VARIANTS[k]) return;
    currentPhase = k;

    // Update active tab buttons
    tabButtons.forEach((btn) => {
      const isActive = btn.getAttribute('data-variant') === k;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update Anime Layers
    [layerGrad, layerEarly, layerAdult].forEach((l) => l && l.classList.remove('active'));
    if (k === 'graduation' && layerGrad) layerGrad.classList.add('active');
    else if (k === 'early' && layerEarly) layerEarly.classList.add('active');
    else if (k === 'adult' && layerAdult) layerAdult.classList.add('active');

    // Update Roblox Layers
    [robloxGrad, robloxEarly, robloxAdult].forEach((l) => l && l.classList.remove('active'));
    if (k === 'graduation' && robloxGrad) robloxGrad.classList.add('active');
    else if (k === 'early' && robloxEarly) robloxEarly.classList.add('active');
    else if (k === 'adult' && robloxAdult) robloxAdult.classList.add('active');
  }

  // 3 Phase Buttons Click Handlers
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      renderPhase(btn.getAttribute('data-variant'));
    });
  });

  // Modal Open / Close Logic
  function openModal(target) {
    if (!modalBackdrop) return;
    activeTarget = target || 'anime';
    syncModalUI();
    modalBackdrop.hidden = false;
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.hidden = true;
  }

  function syncModalUI() {
    const isAnime = activeTarget === 'anime';
    if (modalTitle) {
      modalTitle.textContent = isAnime
        ? 'Konfigurasi Slider · Anime (Kiri)'
        : 'Konfigurasi Slider · Roblox (Kanan)';
    }

    if (btnTargetAnime && btnTargetRoblox) {
      btnTargetAnime.classList.toggle('active', isAnime);
      btnTargetRoblox.classList.toggle('active', !isAnime);
    }

    const currentMode = isAnime ? sliderModeAnime : sliderModeRoblox;
    if (btnToggleSlider) {
      btnToggleSlider.classList.toggle('active', currentMode);
      btnToggleSlider.setAttribute('aria-pressed', currentMode ? 'true' : 'false');
    }
    if (sliderToggleLabel) {
      sliderToggleLabel.textContent = currentMode ? 'Matikan Slider' : 'Aktifkan Slider';
    }
  }

  // Double Click Triggers on Containers
  if (viewportAnime) {
    viewportAnime.addEventListener('dblclick', (e) => {
      e.preventDefault();
      openModal('anime');
    });
    // Keyboard accessibility: Enter / Space opens config
    viewportAnime.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal('anime');
      }
    });
  }

  if (viewportRoblox) {
    viewportRoblox.addEventListener('dblclick', (e) => {
      e.preventDefault();
      openModal('roblox');
    });
    viewportRoblox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal('roblox');
      }
    });
  }

  // Close modal events
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && !modalBackdrop.hidden) {
      closeModal();
    }
  });

  // Target switcher buttons inside modal
  if (btnTargetAnime) {
    btnTargetAnime.addEventListener('click', () => {
      activeTarget = 'anime';
      syncModalUI();
    });
  }

  if (btnTargetRoblox) {
    btnTargetRoblox.addEventListener('click', () => {
      activeTarget = 'roblox';
      syncModalUI();
    });
  }

  // Slider Image Synchronizers
  function updateSliderImages() {
    if (!selectLeft || !selectRight) return;
    const leftKey = selectLeft.value;
    const rightKey = selectRight.value;

    if (activeTarget === 'anime') {
      if (splitImgLeftAnime && VARIANTS[leftKey]) splitImgLeftAnime.src = VARIANTS[leftKey].animeSrc;
      if (splitImgRightAnime && VARIANTS[rightKey]) splitImgRightAnime.src = VARIANTS[rightKey].animeSrc;
    } else {
      if (splitImgLeftRoblox && VARIANTS[leftKey]) splitImgLeftRoblox.src = VARIANTS[leftKey].robloxSrc;
      if (splitImgRightRoblox && VARIANTS[rightKey]) splitImgRightRoblox.src = VARIANTS[rightKey].robloxSrc;
    }
  }

  if (selectLeft) selectLeft.addEventListener('change', updateSliderImages);
  if (selectRight) selectRight.addEventListener('change', updateSliderImages);

  // Toggle Slider Mode
  if (btnToggleSlider) {
    btnToggleSlider.addEventListener('click', () => {
      if (activeTarget === 'anime') {
        sliderModeAnime = !sliderModeAnime;
        if (splitBoxAnime) {
          splitBoxAnime.classList.toggle('active', sliderModeAnime);
          splitBoxAnime.setAttribute('aria-hidden', sliderModeAnime ? 'false' : 'true');
        }
      } else {
        sliderModeRoblox = !sliderModeRoblox;
        if (splitBoxRoblox) {
          splitBoxRoblox.classList.toggle('active', sliderModeRoblox);
          splitBoxRoblox.setAttribute('aria-hidden', sliderModeRoblox ? 'false' : 'true');
        }
      }
      updateSliderImages();
      syncModalUI();
    });
  }

  // Generic split slider drag logic
  function setupSplitDrag(divider, viewport) {
    if (!divider || !viewport) return;
    let isDragging = false;

    function setSplit(clientX) {
      const rect = viewport.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(5, Math.min(95, pct));
      viewport.style.setProperty('--split-x', pct + '%');
      divider.setAttribute('aria-valuenow', Math.round(pct).toString());
    }

    divider.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();
      e.stopPropagation();
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) setSplit(e.clientX);
    });

    // Touch support
    divider.addEventListener('touchstart', (e) => {
      isDragging = true;
      e.stopPropagation();
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches[0]) setSplit(e.touches[0].clientX);
    }, { passive: true });
  }

  setupSplitDrag(splitDividerAnime, viewportAnime);
  setupSplitDrag(splitDividerRoblox, viewportRoblox);

  // Default Init
  renderPhase('graduation');
}

/* ==========================================================================
   JIBAKU SHOUNEN HANAKO-KUN MORPH CHAMBER & DUAL SELECTABLE SLIDER
   Slide 3: Symmetrical Anime vs Roblox Cosplay Showcase
   ========================================================================== */
function initHanakoChamber() {
  const HANAKO_VARIANTS = {
    classic: {
      key: 'classic',
      name: 'Hanako-kun (Tujuh Misteri No. 7)',
      animeSrc: '/assets/horimiya/hanako-anime-classic.webp',
      robloxSrc: '/assets/horimiya/hanako-roblox-classic.webp'
    },
    amane: {
      key: 'amane',
      name: 'Amane Yugi (Masa Manusia)',
      animeSrc: '/assets/horimiya/hanako-anime-amane.webp',
      robloxSrc: '/assets/horimiya/hanako-roblox-amane.webp'
    },
    latest: {
      key: 'latest',
      name: 'Hanako-kun Versi Terbaru (Roh Api)',
      animeSrc: '/assets/horimiya/hanako-anime-latest.webp',
      robloxSrc: '/assets/horimiya/hanako-roblox-latest.webp'
    }
  };

  let activeTarget = 'anime'; // 'anime' | 'roblox'
  let sliderModeAnime = false;
  let sliderModeRoblox = false;
  let currentPhase = 'classic';

  // Anime DOM elements
  const layerClassic = document.getElementById('hanako-layer-classic');
  const layerAmane = document.getElementById('hanako-layer-amane');
  const layerLatest = document.getElementById('hanako-layer-latest');
  const splitBoxAnime = document.getElementById('split-slider-box-hanako-anime');
  const splitImgLeftAnime = document.getElementById('split-img-left-hanako-anime');
  const splitImgRightAnime = document.getElementById('split-img-right-hanako-anime');
  const splitDividerAnime = document.getElementById('split-divider-hanako-anime');
  const viewportAnime = document.getElementById('hanako-viewport-anime');

  // Roblox DOM elements
  const robloxClassic = document.getElementById('hanako-roblox-classic');
  const robloxAmane = document.getElementById('hanako-roblox-amane');
  const robloxLatest = document.getElementById('hanako-roblox-latest');
  const splitBoxRoblox = document.getElementById('split-slider-box-hanako-roblox');
  const splitImgLeftRoblox = document.getElementById('split-img-left-hanako-roblox');
  const splitImgRightRoblox = document.getElementById('split-img-right-hanako-roblox');
  const splitDividerRoblox = document.getElementById('split-divider-hanako-roblox');
  const viewportRoblox = document.getElementById('hanako-viewport-roblox');

  // Pop-up Modal elements
  const modalBackdrop = document.getElementById('hanako-slider-config-modal');
  const modalCloseBtn = document.getElementById('btn-hanako-modal-close');
  const modalTitle = document.getElementById('hanako-modal-config-title');
  const btnTargetAnime = document.getElementById('btn-hanako-target-anime');
  const btnTargetRoblox = document.getElementById('btn-hanako-target-roblox');
  const selectLeft = document.getElementById('select-hanako-slider-left');
  const selectRight = document.getElementById('select-hanako-slider-right');
  const btnToggleSlider = document.getElementById('btn-hanako-toggle-slider');
  const sliderToggleLabel = document.getElementById('hanako-slider-toggle-label');

  const tabButtons = Array.from(document.querySelectorAll('.hanako-tab-btn'));

  function renderPhase(k) {
    if (!HANAKO_VARIANTS[k]) return;
    currentPhase = k;

    // Update active tab buttons
    tabButtons.forEach((btn) => {
      const isActive = btn.getAttribute('data-hanako-variant') === k;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update Anime Layers
    [layerClassic, layerAmane, layerLatest].forEach((l) => l && l.classList.remove('active'));
    if (k === 'classic' && layerClassic) layerClassic.classList.add('active');
    else if (k === 'amane' && layerAmane) layerAmane.classList.add('active');
    else if (k === 'latest' && layerLatest) layerLatest.classList.add('active');

    // Update Roblox Layers
    [robloxClassic, robloxAmane, robloxLatest].forEach((l) => l && l.classList.remove('active'));
    if (k === 'classic' && robloxClassic) robloxClassic.classList.add('active');
    else if (k === 'amane' && robloxAmane) robloxAmane.classList.add('active');
    else if (k === 'latest' && robloxLatest) robloxLatest.classList.add('active');
  }

  // 3 Phase Buttons Click Handlers
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      renderPhase(btn.getAttribute('data-hanako-variant'));
    });
  });

  // Modal Open / Close Logic
  function openModal(target) {
    if (!modalBackdrop) return;
    activeTarget = target || 'anime';
    syncModalUI();
    modalBackdrop.hidden = false;
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.hidden = true;
  }

  function syncModalUI() {
    const isAnime = activeTarget === 'anime';
    if (modalTitle) {
      modalTitle.textContent = isAnime
        ? 'Konfigurasi Slider · Hanako Anime (Kiri)'
        : 'Konfigurasi Slider · Hanako Roblox (Kanan)';
    }

    if (btnTargetAnime && btnTargetRoblox) {
      btnTargetAnime.classList.toggle('active', isAnime);
      btnTargetRoblox.classList.toggle('active', !isAnime);
    }

    const currentMode = isAnime ? sliderModeAnime : sliderModeRoblox;
    if (btnToggleSlider) {
      btnToggleSlider.classList.toggle('active', currentMode);
      btnToggleSlider.setAttribute('aria-pressed', currentMode ? 'true' : 'false');
    }
    if (sliderToggleLabel) {
      sliderToggleLabel.textContent = currentMode ? 'Matikan Slider' : 'Aktifkan Slider';
    }
  }

  // Double Click Triggers on Containers
  if (viewportAnime) {
    viewportAnime.addEventListener('dblclick', (e) => {
      e.preventDefault();
      openModal('anime');
    });
    viewportAnime.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal('anime');
      }
    });
  }

  if (viewportRoblox) {
    viewportRoblox.addEventListener('dblclick', (e) => {
      e.preventDefault();
      openModal('roblox');
    });
    viewportRoblox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal('roblox');
      }
    });
  }

  // Close modal events
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && !modalBackdrop.hidden) {
      closeModal();
    }
  });

  // Target switcher buttons inside modal
  if (btnTargetAnime) {
    btnTargetAnime.addEventListener('click', () => {
      activeTarget = 'anime';
      syncModalUI();
    });
  }

  if (btnTargetRoblox) {
    btnTargetRoblox.addEventListener('click', () => {
      activeTarget = 'roblox';
      syncModalUI();
    });
  }

  // Slider Image Synchronizers
  function updateSliderImages() {
    if (!selectLeft || !selectRight) return;
    const leftKey = selectLeft.value;
    const rightKey = selectRight.value;

    if (activeTarget === 'anime') {
      if (splitImgLeftAnime && HANAKO_VARIANTS[leftKey]) splitImgLeftAnime.src = HANAKO_VARIANTS[leftKey].animeSrc;
      if (splitImgRightAnime && HANAKO_VARIANTS[rightKey]) splitImgRightAnime.src = HANAKO_VARIANTS[rightKey].animeSrc;
    } else {
      if (splitImgLeftRoblox && HANAKO_VARIANTS[leftKey]) splitImgLeftRoblox.src = HANAKO_VARIANTS[leftKey].robloxSrc;
      if (splitImgRightRoblox && HANAKO_VARIANTS[rightKey]) splitImgRightRoblox.src = HANAKO_VARIANTS[rightKey].robloxSrc;
    }
  }

  if (selectLeft) selectLeft.addEventListener('change', updateSliderImages);
  if (selectRight) selectRight.addEventListener('change', updateSliderImages);

  // Toggle Slider Mode
  if (btnToggleSlider) {
    btnToggleSlider.addEventListener('click', () => {
      if (activeTarget === 'anime') {
        sliderModeAnime = !sliderModeAnime;
        if (splitBoxAnime) {
          splitBoxAnime.classList.toggle('active', sliderModeAnime);
          splitBoxAnime.setAttribute('aria-hidden', sliderModeAnime ? 'false' : 'true');
        }
      } else {
        sliderModeRoblox = !sliderModeRoblox;
        if (splitBoxRoblox) {
          splitBoxRoblox.classList.toggle('active', sliderModeRoblox);
          splitBoxRoblox.setAttribute('aria-hidden', sliderModeRoblox ? 'false' : 'true');
        }
      }
      updateSliderImages();
      syncModalUI();
    });
  }

  // Generic split slider drag logic
  function setupSplitDrag(divider, viewport) {
    if (!divider || !viewport) return;
    let isDragging = false;

    function setSplit(clientX) {
      const rect = viewport.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(5, Math.min(95, pct));
      viewport.style.setProperty('--split-x', pct + '%');
      divider.setAttribute('aria-valuenow', Math.round(pct).toString());
    }

    divider.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();
      e.stopPropagation();
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) setSplit(e.clientX);
    });

    divider.addEventListener('touchstart', (e) => {
      isDragging = true;
      e.stopPropagation();
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches[0]) setSplit(e.touches[0].clientX);
    }, { passive: true });
  }

  setupSplitDrag(splitDividerAnime, viewportAnime);
  setupSplitDrag(splitDividerRoblox, viewportRoblox);

  // Default Init
  renderPhase('classic');
}

/* ==========================================================================
   AMBIENT AUDIO SYNTHESIZER (WEB AUDIO API)
   ========================================================================== */
function initAudioEngine() {
  let ctx = null;
  let isPlaying = false;
  let timer = null;
  let chordIndex = 0;

  const dock = document.getElementById('audio-dock');
  const btn = document.getElementById('audio-play-btn');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');

  const CHORDS = [
    [174.61, 220.0, 261.63, 329.63, 392.0], // Fmaj9
    [196.0, 246.94, 293.66, 329.63, 392.0], // G6
    [164.81, 196.0, 246.94, 293.66, 329.63], // Em7
    [220.0, 261.63, 329.63, 392.0, 440.0],  // Am9
    [146.83, 174.61, 220.0, 261.63, 329.63] // Dm9
  ];

  function ensureCtx() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  function playNote(freq, delay, dur) {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

    const t = ctx.currentTime + delay;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.06, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.1);
  }

  function tick() {
    if (!isPlaying) return;
    const chord = CHORDS[chordIndex];
    chordIndex = (chordIndex + 1) % CHORDS.length;

    chord.forEach((n, i) => playNote(n, i * 0.25, 2.4));
    timer = setTimeout(tick, 2400);
  }

  if (btn) {
    btn.addEventListener('click', () => {
      ensureCtx();
      isPlaying = !isPlaying;
      if (isPlaying) {
        if (dock) dock.classList.add('playing');
        if (iconPlay) iconPlay.style.display = 'none';
        if (iconPause) iconPause.style.display = 'block';
        chordIndex = 0;
        tick();
      } else {
        if (dock) dock.classList.remove('playing');
        if (iconPlay) iconPlay.style.display = 'block';
        if (iconPause) iconPause.style.display = 'none';
        if (timer) clearTimeout(timer);
      }
    });
  }

  // Gracefully pause audio when tab is backgrounded
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isPlaying) {
      if (ctx && ctx.state === 'running') ctx.suspend();
    } else if (!document.hidden && isPlaying) {
      if (ctx && ctx.state === 'suspended') ctx.resume();
    }
  });
}

/* ==========================================================================
   GUESTBOOK
   ========================================================================== */
function initGuestbook() {
  const PRESET = [
    { sender: 'Kyoko Hori (堀 京子)', msg: 'Terima kasih sudah datang ke dalam hidupku, Miyamura. Mulai hari ini dan seterusnya, kita akan selalu melangkah bersama.', time: 'Wisuda Angkatan 63' },
    { sender: 'Toru Ishikawa (石川 透)', msg: 'Selamat atas kelulusan kita, kawan! Miyamura Bakery tetap jadi markas utama kita!', time: 'Wisuda Angkatan 63' },
    { sender: 'Yuki Yoshikawa (吉川 由紀)', msg: 'Kalian berdua adalah pasangan paling serasi di SMA Katagiri!', time: 'Wisuda Angkatan 63' },
    { sender: 'Kakeru Sengoku (仙石 翔)', msg: 'Meskipun kita berawal canggung, aku sangat menghargai ketulusanmu. Sukses untuk masa depanmu.', time: 'Wisuda Angkatan 63' }
  ];

  const form = document.getElementById('guestbook-form');
  const inputName = document.getElementById('input-name');
  const inputMsg = document.getElementById('input-msg');
  const container = document.getElementById('guestbook-list');

  function render() {
    if (!container) return;
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem('horimiya_wishes_v3')) || [];
    } catch (_) {}
    const list = [...PRESET, ...saved].reverse();

    container.innerHTML = '';
    list.forEach((item) => {
      const chip = document.createElement('div');
      chip.className = 'wish-chip';
      chip.innerHTML = `
        <p>"${escapeHtml(item.msg)}"</p>
        <span>
          <strong>${escapeHtml(item.sender)}</strong>
          <em>${escapeHtml(item.time || 'Baru saja')}</em>
        </span>
      `;
      container.appendChild(chip);
    });
  }

  if (form && inputName && inputMsg) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const sender = inputName.value.trim();
      const msg = inputMsg.value.trim();
      if (!sender || !msg) return;

      let saved = [];
      try {
        saved = JSON.parse(localStorage.getItem('horimiya_wishes_v3')) || [];
      } catch (_) {}
      saved.push({ sender, msg, time: '2 Oktober 2026' });
      try {
        localStorage.setItem('horimiya_wishes_v3', JSON.stringify(saved));
      } catch (_) {}

      inputName.value = '';
      inputMsg.value = '';
      render();
    });
  }

  render();
}

/**
 * Robust HTML Escaping Utility
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[m]));
}
