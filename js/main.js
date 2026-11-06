/**
 * NEWWAY CONSTRUCTION — ARCHITECTURAL EXPERIENCE CONTROLLER
 * Minimal, Confident, Editorial, Architectural.
 * Uses GSAP + ScrollTrigger for high-performance motion.
 */

(function () {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Global state
  const state = {
    isPageLoaded: false,
    preloaderDone: false,
    currentMethodStep: 0,
    beforeAfterPos: 50,
  };

  /* ==========================================================================
     1. PRELOADER STATE MACHINE — LETTER-BY-LETTER NEWWAY (UNTOUCHED LOGIC)
     ========================================================================== */
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    const letters = document.querySelectorAll('.preloader-letter');
    const body = document.body;

    if (!preloader || !letters.length) {
      if (body) body.classList.remove('locked');
      initHeroAnimations();
      return;
    }

    body.classList.add('locked');

    if (prefersReducedMotion) {
      letters.forEach((l) => (l.style.transform = 'translateY(0)'));
      setTimeout(() => {
        gsap.to(preloader, {
          opacity: 0,
          duration: 0.4,
          onComplete: () => {
            preloader.style.display = 'none';
            body.classList.remove('locked');
            state.preloaderDone = true;
            initHeroAnimations();
          },
        });
      }, 600);
      return;
    }

    // Set initial positions
    gsap.set(letters, { yPercent: 115 });

    function runCycle() {
      const tl = gsap.timeline();

      // 1. Letters pop up from immediately below sequentially
      tl.to(letters, {
        yPercent: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
      });

      // 2. Pause momentarily to allow user to read the word NEWWAY
      tl.to({}, { duration: 0.4 });

      // 3. Check document readiness after completion of word presentation
      tl.call(() => {
        if (!state.isPageLoaded) {
          // STATE A: Not ready yet. Animate letters upward and out of view in sequence
          const exitTl = gsap.timeline();
          exitTl.to(letters, {
            yPercent: -115,
            duration: 0.45,
            stagger: 0.07,
            ease: 'power3.in',
            onComplete: () => {
              gsap.set(letters, { yPercent: 115 });
              runCycle();
            },
          });
        } else {
          // STATE B: Page is loaded! Complete exit sequence
          exitPreloader();
        }
      });
    }

    function exitPreloader() {
      const exitTl = gsap.timeline({
        onComplete: () => {
          preloader.style.display = 'none';
          body.classList.remove('locked');
          state.preloaderDone = true;
          if (window.ScrollTrigger) {
            ScrollTrigger.refresh();
          }
          initHeroAnimations();
        },
      });

      exitTl.to(letters, {
        yPercent: -115,
        duration: 0.5,
        stagger: 0.07,
        ease: 'power3.inOut',
      });

      exitTl.to(
        preloader,
        {
          yPercent: -100,
          duration: 0.85,
          ease: 'power4.inOut',
        },
        '-=0.2'
      );
    }

    runCycle();

    window.addEventListener('load', () => {
      setTimeout(() => {
        state.isPageLoaded = true;
      }, 400);
    });

    setTimeout(() => {
      state.isPageLoaded = true;
    }, 4000);
  }

  /* ==========================================================================
     2. HERO ENTRANCE ANIMATION (CLEAN WHITE TYPOGRAPHY)
     ========================================================================== */
  function initHeroAnimations() {
    const brandLetters = document.querySelectorAll('.hero-letter');
    const heroStatement = document.querySelector('.hero-tagline-statement');
    const heroCtas = document.querySelector('.hero-cta-group');

    // Subtle individual letter hover interaction (rises 2-4px, understated, smooth)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      brandLetters.forEach((letter) => {
        letter.addEventListener('mouseenter', () => {
          gsap.to(letter, { y: -3.5, duration: 0.22, ease: 'power2.out', overwrite: 'auto' });
        });
        letter.addEventListener('mouseleave', () => {
          gsap.to(letter, { y: 0, duration: 0.28, ease: 'power2.out', overwrite: 'auto' });
        });
      });
    }

    if (prefersReducedMotion) return;

    const heroTl = gsap.timeline();

    if (brandLetters.length) {
      heroTl.fromTo(
        brandLetters,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.04,
          ease: 'power3.out',
          onComplete: () => {
            // Clear inline transform property so hover transitions work smoothly
            gsap.set(brandLetters, { clearProps: 'transform' });
          },
        },
        0.1
      );
    }

    if (heroStatement) {
      heroTl.fromTo(
        heroStatement,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
        0.35
      );
    }

    if (heroCtas) {
      heroTl.fromTo(
        heroCtas,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' },
        0.5
      );
    }
  }

  /* ==========================================================================
     3. RENOVATION SECTION — SCROLL-DRIVEN IMAGE EXPANSION & SLIDER
     ========================================================================== */
  function initBeforeAfterSlider() {
    const wrapper = document.getElementById('renovationComparison');
    const layerClipped = document.getElementById('comparisonLayerClipped');
    const divider = document.getElementById('comparisonDivider');
    const rangeInput = document.getElementById('comparisonRange');
    const expandContainer = document.getElementById('renovationExpandContainer');
    const renovationSection = document.getElementById('renovation');

    if (!wrapper || !layerClipped || !divider) return;

    // 1. Smooth Scroll-Driven Container Expansion & Stable Landing
    if (window.ScrollTrigger && expandContainer && renovationSection && !prefersReducedMotion) {
      gsap.fromTo(
        expandContainer,
        {
          width: '80%',
          scale: 0.94,
          y: 40,
        },
        {
          width: 'calc(100% - 2rem)', // ~1rem horizontal margin on both sides
          scale: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: renovationSection,
            start: 'top 92%',
            end: 'top 25%',
            scrub: 1, // Smooth, controlled continuous scroll progress
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }

    // 2. Interactive Comparison Slider (Before: Left, After: Right)
    let isDragging = false;

    function updateSlider(percent) {
      const clamped = Math.max(0, Math.min(100, percent));
      state.beforeAfterPos = clamped;

      // Update clip-path on top layer (Before on left side)
      layerClipped.style.clipPath = `polygon(0 0, ${clamped}% 0, ${clamped}% 100%, 0 100%)`;

      // Update divider position
      divider.style.left = `${clamped}%`;

      if (rangeInput && rangeInput.value !== clamped) {
        rangeInput.value = clamped;
      }
    }

    function getPositionFromEvent(e) {
      const rect = wrapper.getBoundingClientRect();
      const clientX = e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;
      const x = clientX - rect.left;
      return (x / rect.width) * 100;
    }

    wrapper.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSlider(getPositionFromEvent(e));
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(getPositionFromEvent(e));
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) isDragging = false;
    });

    wrapper.addEventListener(
      'touchstart',
      (e) => {
        isDragging = true;
        updateSlider(getPositionFromEvent(e));
      },
      { passive: true }
    );

    window.addEventListener(
      'touchmove',
      (e) => {
        if (!isDragging) return;
        updateSlider(getPositionFromEvent(e));
      },
      { passive: true }
    );

    window.addEventListener('touchend', () => {
      if (isDragging) isDragging = false;
    });

    if (rangeInput) {
      rangeInput.addEventListener('input', (e) => {
        updateSlider(parseFloat(e.target.value));
      });
    }

    wrapper.setAttribute('tabindex', '0');
    wrapper.setAttribute('role', 'slider');
    wrapper.setAttribute('aria-valuemin', '0');
    wrapper.setAttribute('aria-valuemax', '100');
    wrapper.setAttribute('aria-valuenow', '50');

    wrapper.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        updateSlider(state.beforeAfterPos - 5);
        wrapper.setAttribute('aria-valuenow', Math.round(state.beforeAfterPos));
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        updateSlider(state.beforeAfterPos + 5);
        wrapper.setAttribute('aria-valuenow', Math.round(state.beforeAfterPos));
      }
    });

    updateSlider(50);
  }

  /* ==========================================================================
     4. METHODOLOGY — FOUR OVERLAPPING INTERACTIVE CIRCLES (SKETCH AESTHETIC)
     ========================================================================== */
  function initMethodology() {
    const methodData = [
      {
        num: '01',
        title: 'Initial Discussion',
        desc: 'We talk through your plans, architectural requirements, site conditions, and budget parameters to establish the project brief.',
      },
      {
        num: '02',
        title: 'Planning & Design',
        desc: 'We examine the construction drawings, structural detailing, material schedules, and timeline logistics before ground is broken.',
      },
      {
        num: '03',
        title: 'Construction',
        desc: 'Our team brings the approved architectural plans to life, with rigorous site supervision and care taken at every structural junction.',
      },
      {
        num: '04',
        title: 'Final Handover',
        desc: 'We review the completed build in detail, conduct rigorous quality checks, and hand over a refined, enduring space ready for living.',
      },
    ];

    // Circle center coordinates in SVG viewBox (520 x 520)
    const circleCoords = [
      { cx: 260, cy: 160 }, // 01 Top
      { cx: 360, cy: 260 }, // 02 Right
      { cx: 260, cy: 360 }, // 03 Bottom
      { cx: 160, cy: 260 }, // 04 Left
    ];

    const svgGroups = document.querySelectorAll('.method-svg-group');
    const svgElement = document.querySelector('.methodology-svg');
    const arcCircles = document.querySelectorAll('.sketch-arc');
    const stepperBtns = document.querySelectorAll('.method-step-btn');
    const stepTag = document.getElementById('methodStepTag');
    const stepHeading = document.getElementById('methodStepTitle');
    const stepDesc = document.getElementById('methodStepDesc');

    function setActiveStep(index, animate = true) {
      if (index < 0 || index >= methodData.length) return;
      state.currentMethodStep = index;
      const step = methodData[index];
      const coords = circleCoords[index];

      // 1. Move radiating sketched arcs to active circle coordinates
      if (coords && arcCircles.length) {
        arcCircles.forEach((arc) => {
          arc.setAttribute('cx', coords.cx);
          arc.setAttribute('cy', coords.cy);
        });
      }

      // 2. Update SVG Groups (Active solid fill & elevation)
      svgGroups.forEach((group, idx) => {
        if (idx === index) {
          group.classList.add('active');
          group.setAttribute('aria-selected', 'true');
          // Bring active group to top of SVG render stack
          if (svgElement && group.parentElement === svgElement) {
            svgElement.appendChild(group);
          }
        } else {
          group.classList.remove('active');
          group.setAttribute('aria-selected', 'false');
        }
      });

      // 3. Update Clean Stepper List
      stepperBtns.forEach((btn, idx) => {
        if (idx === index) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // 4. Update Information Card
      if (stepTag) stepTag.textContent = `STEP ${step.num} OF 04`;
      if (stepHeading) {
        if (animate && !prefersReducedMotion) {
          gsap.fromTo(
            [stepHeading, stepDesc],
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
          );
        }
        stepHeading.textContent = step.title;
      }
      if (stepDesc) stepDesc.textContent = step.desc;
    }

    svgGroups.forEach((group) => {
      group.addEventListener('click', () => {
        const stepIndex = parseInt(group.getAttribute('data-step'), 10);
        setActiveStep(stepIndex);
      });
      group.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const stepIndex = parseInt(group.getAttribute('data-step'), 10);
          setActiveStep(stepIndex);
        }
      });
    });

    stepperBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const stepIndex = parseInt(btn.getAttribute('data-step'), 10);
        setActiveStep(stepIndex);
      });
    });

    setActiveStep(0, false);
  }

  /* ==========================================================================
     5. RECENT ARCHITECTURE — INDIVIDUAL ENTRANCE ANIMATIONS & DETAIL OVERLAY
     ========================================================================== */
  function initProjectGallery() {
    const modal = document.getElementById('projectModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDesc = document.getElementById('modalDesc');
    const modalArea = document.getElementById('modalArea');
    const modalStructure = document.getElementById('modalStructure');
    const modalMaterials = document.getElementById('modalMaterials');
    const modalTimeline = document.getElementById('modalTimeline');

    const projectData = {
      'project-1': {
        title: 'The Cantilever Villa',
        image: 'assets/project-1.jpg',
        desc: 'A horizontal composition of board-formed concrete and slender black aluminum-framed sliders hovering above a shallow basalt reflecting pool. Built with rigorous climate-responsive thermal mass.',
        area: '6,400 sq.ft',
        structure: 'Post-Tensioned Board-Formed Concrete',
        materials: 'Exposed Concrete, Teak Brise-Soleil, Basalt Stone',
        timeline: '18 Months · Completed',
      },
      'project-2': {
        title: 'The Courtyard Residence',
        image: 'assets/project-2.jpg',
        desc: 'Organized around an open skyward courtyard with a native champak tree. Perforated brick jali masonry filters equatorial daylight and promotes passive cross-ventilation across honed Kota stone floors.',
        area: '5,200 sq.ft',
        structure: 'Reinforced Masonry & Structural Steel Veranda',
        materials: 'Terracotta Jali, Honed Kota Stone, Brass Accents',
        timeline: '15 Months · Completed',
      },
      'project-3': {
        title: 'The Pavilion House',
        image: 'assets/project-3.jpg',
        desc: 'A minimalist weekend residence defined by tactile fluted Sadahalli granite stone walls, slender structural steel cantilevers, and floor-to-ceiling ultra-clear glazing blurring the boundaries of lawn and interior.',
        area: '4,100 sq.ft',
        structure: 'Structural Steel Portal Frame & Granite Masonry',
        materials: 'Chiseled Granite, Low-Iron Glazing, Teak Soffits',
        timeline: '14 Months · Completed',
      },
      'project-4': {
        title: 'The Terraced Residence',
        image: 'assets/project-4.jpg',
        desc: 'An expansive multi-generational luxury home stepping down contoured topography. Features warm timber-clad cantilevers, board-formed concrete retaining structures, and recessed sliding doors opening onto expansive granite courtyards.',
        area: '7,800 sq.ft',
        structure: 'Cast-in-Place Concrete & Engineered Timber Framing',
        materials: 'Architectural Concrete, Teak Decking, Granite Paving',
        timeline: '22 Months · Completed',
      },
    };

    // Smooth individual scroll entrance animation for each project image
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    if (window.ScrollTrigger && !prefersReducedMotion) {
      portfolioItems.forEach((item) => {
        gsap.fromTo(
          item,
          {
            y: 55,
            scale: 0.91, // Subtly reduced scale (0.88-0.94)
            opacity: 0.7,
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.95,
            ease: 'power3.out', // Smooth, controlled, natural easing with zero bounce
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              toggleActions: 'play none none none',
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }

    let modalTl = null;
    let isModalOpen = false;

    function openModal(id) {
      const data = projectData[id];
      if (!data || !modal) return;

      if (modalTitle) modalTitle.textContent = data.title;
      if (modalImage) {
        modalImage.src = data.image;
        modalImage.alt = data.title;
      }
      if (modalDesc) modalDesc.textContent = data.desc;
      if (modalArea) modalArea.textContent = data.area;
      if (modalStructure) modalStructure.textContent = data.structure;
      if (modalMaterials) modalMaterials.textContent = data.materials;
      if (modalTimeline) modalTimeline.textContent = data.timeline;

      const contentBox = modal.querySelector('.modal-content-box');

      if (modalTl) {
        modalTl.kill();
      }

      isModalOpen = true;
      document.body.classList.add('locked');
      modal.style.display = 'flex';
      modal.style.pointerEvents = 'auto';
      modal.setAttribute('aria-hidden', 'false');

      if (prefersReducedMotion) {
        gsap.set(modal, { opacity: 1 });
        if (contentBox) gsap.set(contentBox, { opacity: 1, y: 0, scale: 1 });
        if (modalCloseBtn) modalCloseBtn.focus();
        return;
      }

      modalTl = gsap.timeline({
        onComplete: () => {
          modalTl = null;
          if (modalCloseBtn) modalCloseBtn.focus();
        },
      });

      // 1. Fade in backdrop while preserving translucent frosted blur treatment
      modalTl.fromTo(
        modal,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: 'power2.out' },
        0
      );

      // 2. Bring project details into view: subtle upward movement (~22px) and gentle scale (0.97 to 1)
      if (contentBox) {
        modalTl.fromTo(
          contentBox,
          { opacity: 0, y: 22, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.42, ease: 'power3.out' },
          0.04
        );
      }
    }

    function closeModal() {
      if (!modal || !isModalOpen) return;
      isModalOpen = false;

      const contentBox = modal.querySelector('.modal-content-box');
      modal.style.pointerEvents = 'none';

      if (modalTl) {
        modalTl.kill();
      }

      if (prefersReducedMotion) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('locked');
        return;
      }

      modalTl = gsap.timeline({
        onComplete: () => {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('locked');
          modalTl = null;
        },
      });

      // 1. Move content down slightly (~18px) and reduce scale (1 to 0.97) while fading out
      if (contentBox) {
        modalTl.to(
          contentBox,
          { opacity: 0, y: 18, scale: 0.97, duration: 0.28, ease: 'power2.in' },
          0
        );
      }

      // 2. Fade out backdrop smoothly
      modalTl.to(
        modal,
        { opacity: 0, duration: 0.3, ease: 'power2.inOut' },
        0.05
      );
    }

    portfolioItems.forEach((item) => {
      item.addEventListener('click', () => {
        const projectId = item.getAttribute('data-project-id');
        openModal(projectId);
      });
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const projectId = item.getAttribute('data-project-id');
          openModal(projectId);
        }
      });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    });
  }

  /* ==========================================================================
     6. START A CONVERSATION — MAGNETIC CTA BUTTON
     ========================================================================== */
  function initMagneticButton() {
    const btn = document.querySelector('.contact-cta-btn');
    if (!btn || prefersReducedMotion) return;
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) return;

    function onMouseMove(e) {
      const rect = btn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - btnCenterX;
      const deltaY = e.clientY - btnCenterY;
      const distance = Math.hypot(deltaX, deltaY);

      const magneticRadius = 110;
      if (distance < magneticRadius) {
        const strength = (1 - distance / magneticRadius) * 12;
        const moveX = (deltaX / distance) * strength;
        const moveY = (deltaY / distance) * strength;

        gsap.to(btn, {
          x: moveX,
          y: moveY,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else {
        resetButton();
      }
    }

    function resetButton() {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.65,
        ease: 'elastic.out(1, 0.45)', // Smooth elastic bounce back
        overwrite: 'auto',
      });
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    btn.addEventListener('mouseleave', resetButton);
  }

  /* ==========================================================================
     7. NAVIGATION & MOBILE DRAWER
     ========================================================================== */
  function initNavigation() {
    const header = document.querySelector('.site-header');
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const navLinks = document.querySelectorAll('.nav-link');

    function handleHeaderScroll() {
      if (!header) return;
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    if (menuToggle && mobileNav) {
      menuToggle.addEventListener('click', () => {
        const isOpen = mobileNav.classList.contains('open');
        if (isOpen) {
          mobileNav.classList.remove('open');
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('locked');
        } else {
          mobileNav.classList.add('open');
          menuToggle.classList.add('active');
          menuToggle.setAttribute('aria-expanded', 'true');
          document.body.classList.add('locked');
        }
      });

      mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
          mobileNav.classList.remove('open');
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('locked');
        });
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    const sections = document.querySelectorAll('section[id]');
    if ('IntersectionObserver' in window && sections.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const currentId = entry.target.getAttribute('id');
              navLinks.forEach((link) => {
                if (link.getAttribute('href') === `#${currentId}`) {
                  link.classList.add('active');
                } else {
                  link.classList.remove('active');
                }
              });
            }
          });
        },
        { rootMargin: '-30% 0px -70% 0px' }
      );

      sections.forEach((s) => observer.observe(s));
    }
  }

  /* ==========================================================================
     8. RESPONSIVE WORDMARK FITTING & BACK-TO-TOP
     ========================================================================== */
  function initFooter() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Dynamic measurement ensuring NEWWAY wordmarks never wrap or clip across viewports
    function fitWordmarks() {
      function fitElement(containerSelector, elementSelector) {
        const container = document.querySelector(containerSelector);
        const element = document.querySelector(elementSelector);
        if (!container || !element) return;

        element.style.fontSize = '';
        const containerWidth = container.clientWidth;
        const wordmarkWidth = element.scrollWidth;
        if (containerWidth <= 0 || wordmarkWidth <= 0) return;

        const maxAllowed = containerWidth - 4;
        if (wordmarkWidth > maxAllowed) {
          const currentSize = parseFloat(window.getComputedStyle(element).fontSize);
          const scaleFactor = maxAllowed / wordmarkWidth;
          const targetSize = Math.floor(currentSize * scaleFactor);
          if (targetSize >= 20) {
            element.style.fontSize = `${targetSize}px`;
          }
        }
      }

      fitElement('.hero-content', '.hero-brand-name');
      fitElement('.footer-wordmark-container', '.footer-huge-wordmark');
    }

    window.addEventListener('resize', fitWordmarks, { passive: true });
    setTimeout(fitWordmarks, 200);
    setTimeout(fitWordmarks, 600);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitWordmarks);
    }
  }

  /* ==========================================================================
     INITIALIZATION ON DOM READY
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initBeforeAfterSlider();
    initMethodology();
    initProjectGallery();
    initMagneticButton();
    initNavigation();
    initFooter();
  });
})();
