/* ============================================================
   SPIDER-MAN: BRAND NEW DAY — Main Script
   ============================================================ */
(function () {
  'use strict';

  /* ---- Sound System ---- */
  var soundEnabled = false;
  var sounds = {
    bgMusic: new Audio('assets/sounds/bg-music.mp3'),
    lightning: new Audio('assets/sounds/lightning.mp3'),
    webShoot: new Audio('assets/sounds/web-shoot.mp3'),
  };
  Object.keys(sounds).forEach(function (key) {
    sounds[key].preload = 'auto';
    sounds[key].volume = 0.6;
  });
  sounds.bgMusic.loop = true;

  function playSound(name) {
    if (!soundEnabled || !sounds[name]) return;
    var s = sounds[name];
    s.currentTime = 0;
    s.play().catch(function () {});
  }
  function stopSound(name) {
    if (!sounds[name]) return;
    sounds[name].pause();
    sounds[name].currentTime = 0;
  }

  /* ---- Wait for GSAP & Three.js ---- */
  function waitForDeps(cb) {
    if (window.gsap && window.THREE) {
      cb();
    } else {
      setTimeout(function () { waitForDeps(cb); }, 50);
    }
  }

  waitForDeps(init);

  function init() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    initLenis();
    initLoader();
    initCursor();
    initNavbar();
    initMobileMenu();
    initHero();
    initThreeBackground();
    initWebParticles();
    initSuits();
    initVillains();
    initTimeline();
    initGallery();
    initScrollAnimations();
    initThemeToggle();
    initSoundToggle();
    initRainToggle();
    initEasterEggs();
    initLightning();
    initOscorpTerminal();
  }

  /* ============================================================
     LENIS SMOOTH SCROLL
     ============================================================ */
  var lenis;
  function initLenis() {
    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.querySelector(a.getAttribute('href'));
        if (target) {
          lenis.scrollTo(target, { offset: -72 });
          closeMobileMenu();
        }
      });
    });
  }

  /* ============================================================
     LOADER
     ============================================================ */
  function initLoader() {
    var bar = document.querySelector('.loader__bar');
    var progress = 0;
    var interval = setInterval(function () {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(function () {
          document.getElementById('loader').classList.add('hidden');
          animateHeroContent();
        }, 400);
      }
      bar.style.width = progress + '%';
    }, 200);
  }

  /* ============================================================
     HERO CONTENT ANIMATION
     ============================================================ */
  function animateHeroContent() {
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero__image', { opacity: 0, x: 80, scale: 0.95, duration: 1.4, ease: 'power2.out' }, 0)
      .from('.hero__image-glow', { opacity: 0, scale: 0.5, duration: 1.2 }, 0.2)
      .to('.hero__marvel-badge', { opacity: 1, y: 0, duration: 0.8 })
      .to('.hero__title-line--1', { opacity: 1, y: 0, duration: 1 }, '-=0.3')
      .to('.hero__title-line--2', { opacity: 1, y: 0, duration: 1 }, '-=0.5')
      .to('.hero__subtitle', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
      .to('.hero__cta', { opacity: 1, y: 0, duration: 0.8 }, '-=0.3');
  }

  /* ============================================================
     CUSTOM CURSOR
     ============================================================ */
  function initCursor() {
    var cursor = document.getElementById('cursor');
    var trail = document.getElementById('cursor-trail');
    var mouseX = 0, mouseY = 0;
    var cursorX = 0, cursorY = 0;
    var isShooting = false;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      createTrailDot(e.clientX, e.clientY);
    });

    function createTrailDot(x, y) {
      var dot = document.createElement('div');
      dot.className = 'cursor-trail__dot';
      dot.style.left = x + 'px';
      dot.style.top = y + 'px';
      trail.appendChild(dot);
      setTimeout(function () { dot.remove(); }, 800);
    }

    function updateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    /* Hover detection */
    var hoverElements = document.querySelectorAll('a, button, .suit-card, .villain-card, .gallery__item');
    hoverElements.forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('hovering'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('hovering'); });
    });

    /* Click = web shot */
    document.addEventListener('click', function (e) {
      if (isShooting) return;
      isShooting = true;
      cursor.classList.add('shooting');
      playSound('webShoot');
      shootWeb(cursorX, cursorY, e.clientX, e.clientY);
      setTimeout(function () {
        cursor.classList.remove('shooting');
        isShooting = false;
      }, 600);
    });
  }

  function shootWeb(fromX, fromY, toX, toY) {
    var svg = document.getElementById('web-shot');
    var line = document.getElementById('web-shot-line');
    line.setAttribute('x1', fromX);
    line.setAttribute('y1', fromY);
    line.setAttribute('x2', fromX);
    line.setAttribute('y2', fromY);
    line.setAttribute('opacity', '0.8');
    line.setAttribute('stroke', 'white');
    line.setAttribute('stroke-width', '2');

    gsap.to(line, {
      attr: { x2: toX, y2: toY },
      duration: 0.15,
      ease: 'power2.out',
      onComplete: function () {
        gsap.to(line, {
          attr: { x1: toX, y1: toY },
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: function () {
            line.setAttribute('opacity', '0');
            createWebImpact(toX, toY);
          }
        });
      }
    });
  }

  function createWebImpact(x, y) {
    var ring = document.createElement('div');
    ring.style.cssText = 'position:fixed;width:20px;height:20px;border:2px solid rgba(255,255,255,0.6);border-radius:50%;left:' + x + 'px;top:' + y + 'px;transform:translate(-50%,-50%);pointer-events:none;z-index:9996;';
    document.body.appendChild(ring);
    gsap.to(ring, { width: 60, height: 60, opacity: 0, duration: 0.5, ease: 'power2.out', onComplete: function () { ring.remove(); } });
  }

  /* ============================================================
     NAVBAR
     ============================================================ */
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    var sections = document.querySelectorAll('.section, .hero, .footer');
    var links = document.querySelectorAll('.navbar__link');

    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 50);

      var scrollPos = window.scrollY + 200;
      sections.forEach(function (section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
          links.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === id) {
              link.classList.add('active');
            }
          });
        }
      });
    });
  }

  /* ============================================================
     MOBILE MENU
     ============================================================ */
  function initMobileMenu() {
    var toggle = document.getElementById('menu-toggle');
    var menu = document.getElementById('mobile-menu');
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });
    menu.querySelectorAll('.mobile-menu__link').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }
  function closeMobileMenu() {
    document.getElementById('menu-toggle').classList.remove('active');
    document.getElementById('mobile-menu').classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ============================================================
     HERO
     ============================================================ */
  function initHero() {
    gsap.to('.hero__stars', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: -100,
      opacity: 0,
    });
    gsap.to('.hero__image-wrap', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: -60,
      opacity: 0.3,
    });
  }

  /* ============================================================
     THREE.JS BACKGROUND
     ============================================================ */
  function initThreeBackground() {
    var container = document.getElementById('hero-canvas');
    if (!container) return;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    /* Floating web lines */
    var linesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 });
    var linesGroup = new THREE.Group();
    for (var i = 0; i < 30; i++) {
      var points = [];
      var x1 = (Math.random() - 0.5) * 20;
      var y1 = (Math.random() - 0.5) * 20;
      var z1 = (Math.random() - 0.5) * 10;
      points.push(new THREE.Vector3(x1, y1, z1));
      points.push(new THREE.Vector3(x1 + (Math.random() - 0.5) * 4, y1 + (Math.random() - 0.5) * 4, z1 + (Math.random() - 0.5) * 2));
      var geometry = new THREE.BufferGeometry().setFromPoints(points);
      var line = new THREE.Line(geometry, linesMaterial);
      linesGroup.add(line);
    }
    scene.add(linesGroup);

    /* Particles */
    var particleCount = 200;
    var particleGeo = new THREE.BufferGeometry();
    var positions = new Float32Array(particleCount * 3);
    for (var j = 0; j < particleCount; j++) {
      positions[j * 3] = (Math.random() - 0.5) * 30;
      positions[j * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[j * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    var particleMat = new THREE.PointsMaterial({ color: 0xe23636, size: 0.05, transparent: true, opacity: 0.6 });
    var particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    camera.position.z = 8;

    var mouseX3D = 0, mouseY3D = 0;
    document.addEventListener('mousemove', function (e) {
      mouseX3D = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY3D = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
      requestAnimationFrame(animate);
      linesGroup.rotation.y += 0.0005;
      linesGroup.rotation.x += 0.0003;
      particles.rotation.y += 0.0003;
      particles.rotation.x += 0.0002;
      camera.position.x += (mouseX3D * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY3D * 0.5 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function () {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      onLeave: function () { renderer.domElement.style.opacity = '0'; },
      onEnterBack: function () { renderer.domElement.style.opacity = '1'; },
    });
  }

  /* ============================================================
     WEB PARTICLES
     ============================================================ */
  function initWebParticles() {
    var container = document.getElementById('web-particles');
    for (var i = 0; i < 25; i++) {
      var p = document.createElement('div');
      p.className = 'web-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (Math.random() * 8 + 6) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      p.style.width = (Math.random() * 3 + 1) + 'px';
      p.style.height = p.style.width;
      container.appendChild(p);
    }
  }

  /* ============================================================
     RAIN
     ============================================================ */
  function initRainToggle() {
    var rainContainer = document.getElementById('rain-container');
    var btn = document.getElementById('rain-toggle');
    var active = false;

    btn.addEventListener('click', function () {
      active = !active;
      btn.classList.toggle('active', active);
      rainContainer.classList.toggle('active', active);
      if (active) {
        createRaindrops();
      } else {
        rainContainer.innerHTML = '';
      }
    });

    function createRaindrops() {
      rainContainer.innerHTML = '';
      for (var i = 0; i < 100; i++) {
        var drop = document.createElement('div');
        drop.className = 'raindrop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.height = (Math.random() * 20 + 10) + 'px';
        drop.style.animationDuration = (Math.random() * 0.5 + 0.3) + 's';
        drop.style.animationDelay = (Math.random() * 2) + 's';
        rainContainer.appendChild(drop);
      }
    }
  }

  /* ============================================================
     LIGHTNING
     ============================================================ */
  function initLightning() {
    var el = document.getElementById('lightning');
    function strike() {
      if (!document.getElementById('rain-container').classList.contains('active')) {
        setTimeout(strike, Math.random() * 15000 + 10000);
        return;
      }
      el.style.opacity = '0.8';
      playSound('lightning');
      setTimeout(function () { el.style.opacity = '0'; }, 80);
      setTimeout(function () {
        el.style.opacity = '0.4';
        setTimeout(function () { el.style.opacity = '0'; }, 60);
      }, 150);
      setTimeout(strike, Math.random() * 15000 + 8000);
    }
    setTimeout(strike, 5000);
  }

  /* ============================================================
     SUITS
     ============================================================ */
  function initSuits() {
    var cards = document.querySelectorAll('.suit-card');
    cards.forEach(function (card) {
      var fills = card.querySelectorAll('.suit-stat__fill');
      fills.forEach(function (fill) {
        fill.style.setProperty('--level', fill.getAttribute('data-level'));
      });

      ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        onEnter: function () { card.classList.add('revealed'); },
      });

      /* 3D tilt on mouse */
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        var inner = card.querySelector('.suit-card__inner');
        if (!card.matches(':hover')) return;
      });
    });
  }

  /* ============================================================
     VILLAINS — Broken Glass
     ============================================================ */
  function initVillains() {
    var cards = document.querySelectorAll('.villain-card');
    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        var glass = card.querySelector('.villain-card__glass');
        /* Create crack lines */
        for (var i = 0; i < 5; i++) {
          var crack = document.createElement('div');
          var angle = Math.random() * 360;
          var len = Math.random() * 60 + 30;
          crack.style.cssText = 'position:absolute;width:' + len + 'px;height:1px;background:rgba(255,255,255,0.12);top:50%;left:50%;transform-origin:0 0;transform:rotate(' + angle + 'deg);z-index:1;pointer-events:none;';
          glass.appendChild(crack);
          gsap.from(crack, { scaleX: 0, duration: 0.4, delay: i * 0.05, ease: 'power2.out' });
        }
      });
      card.addEventListener('mouseleave', function () {
        var cracks = card.querySelectorAll('.villain-card__glass div');
        cracks.forEach(function (c) { c.remove(); });
      });
    });
  }

  /* ============================================================
     TIMELINE
     ============================================================ */
  function initTimeline() {
    var items = document.querySelectorAll('.timeline__item');
    var fill = document.querySelector('.timeline__line-fill');

    items.forEach(function (item) {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 80%',
        onEnter: function () {
          item.classList.add('visible');
        },
      });
    });

    /* Line fill on scroll */
    ScrollTrigger.create({
      trigger: '.timeline__track',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: true,
      onUpdate: function (self) {
        fill.style.height = (self.progress * 100) + '%';
      },
    });
  }

  /* ============================================================
     GALLERY
     ============================================================ */
  function initGallery() {
    var items = document.querySelectorAll('.gallery__item');
    items.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        gsap.to(item, { scale: 1.03, duration: 0.3, ease: 'power2.out' });
      });
      item.addEventListener('mouseleave', function () {
        gsap.to(item, { scale: 1, duration: 0.3, ease: 'power2.out' });
      });
    });
  }

  /* ============================================================
     SCROLL ANIMATIONS (GSAP)
     ============================================================ */
  function initScrollAnimations() {
    /* Section headers */
    gsap.utils.toArray('.section__tag').forEach(function (el) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        opacity: 0, y: 20, duration: 0.6,
      });
    });
    gsap.utils.toArray('.section__title').forEach(function (el) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        opacity: 0, y: 30, duration: 0.8,
      });
    });
    gsap.utils.toArray('.section__desc').forEach(function (el) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        opacity: 0, y: 20, duration: 0.6, delay: 0.2,
      });
    });

    /* Suit cards stagger */
    gsap.from('.suit-card', {
      scrollTrigger: { trigger: '.suits__grid', start: 'top 80%' },
      opacity: 0, y: 60, rotateY: -15, duration: 0.8, stagger: 0.15, ease: 'power3.out',
    });

    /* Villain cards */
    gsap.from('.villain-card', {
      scrollTrigger: { trigger: '.villains__grid', start: 'top 80%' },
      opacity: 0, y: 60, scale: 0.9, duration: 0.8, stagger: 0.12, ease: 'power3.out',
    });
    /* Animate stat bars when villains section enters */
    ScrollTrigger.create({
      trigger: '.villains__grid',
      start: 'top 80%',
      onEnter: function () {
        document.querySelectorAll('.villain-card__bar-fill').forEach(function (bar) {
          bar.style.transform = 'scaleX(1)';
        });
      },
    });

    /* Gallery items */
    gsap.from('.gallery__item', {
      scrollTrigger: { trigger: '.gallery__grid', start: 'top 80%' },
      opacity: 0, scale: 0.85, duration: 0.6, stagger: 0.08, ease: 'power3.out',
    });

    /* Contact section */
    gsap.from('.contact__card', {
      scrollTrigger: { trigger: '.contact__info', start: 'top 80%' },
      opacity: 0, x: -40, duration: 0.6, stagger: 0.12, ease: 'power3.out',
    });

    /* Footer */
    gsap.from('.footer__top', {
      scrollTrigger: { trigger: '.footer', start: 'top 90%' },
      opacity: 0, y: 40, duration: 0.8,
    });
    gsap.from('.footer__social-link', {
      scrollTrigger: { trigger: '.footer__social', start: 'top 90%' },
      opacity: 0, y: 20, duration: 0.5, stagger: 0.1,
    });

    /* Parallax on hero elements */
    gsap.to('.hero__moon', {
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      y: -150,
    });
    gsap.to('.hero__clouds', {
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      y: -80,
    });
    gsap.to('.hero__skyline', {
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      y: 50,
    });
  }

  /* ============================================================
     THEME TOGGLE (Day/Night)
     ============================================================ */
  function initThemeToggle() {
    var btn = document.getElementById('theme-toggle');
    var html = document.documentElement;
    btn.addEventListener('click', function () {
      var current = html.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      btn.classList.toggle('active', next === 'light');
      showToast(next === 'light' ? 'Day Mode activated' : 'Night Mode activated');
    });
  }

  /* ============================================================
     SOUND TOGGLE
     ============================================================ */
  function initSoundToggle() {
    var btn = document.getElementById('sound-toggle');
    btn.addEventListener('click', function () {
      soundEnabled = !soundEnabled;
      btn.classList.toggle('active', soundEnabled);
      if (soundEnabled) {
        playSound('bgMusic');
      } else {
        stopSound('bgMusic');
      }
      showToast(soundEnabled ? 'Sound ON' : 'Sound OFF');
    });
  }

  /* ============================================================
     EASTER EGGS
     ============================================================ */
  function initEasterEggs() {
    var konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    var konamiIndex = 0;

    document.addEventListener('keydown', function (e) {
      /* Press "S" to swing */
      if (e.key === 's' || e.key === 'S') {
        triggerSpiderSwing();
      }

      /* Konami Code */
      if (e.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          activateSymbioteMode();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    });
  }

  function triggerSpiderSwing() {
    var spidey = document.getElementById('spiderman-swing');
    gsap.killTweensOf(spidey);
    gsap.set(spidey, { left: '-100px', bottom: '50%' });
    gsap.to(spidey, {
      left: 'calc(100vw + 100px)',
      bottom: '65%',
      rotation: -15,
      duration: 3,
      ease: 'power2.inOut',
      onComplete: function () {
        gsap.set(spidey, { left: '-100px', bottom: '50%' });
        gsap.to(spidey, {
          left: 'calc(100vw + 100px)',
          bottom: '50%',
          duration: 3,
          ease: 'power2.inOut',
        });
      },
    });
    showToast('Spider-Sense tingling!');
  }

  function activateSymbioteMode() {
    document.body.classList.toggle('symbiote-mode');
    var isSymbiote = document.body.classList.contains('symbiote-mode');
    showToast(isSymbiote ? 'SYMBIOTE MODE ACTIVATED' : 'Symbiote Mode deactivated');
    if (isSymbiote) {
      var veins = document.createElement('div');
      veins.className = 'symbiote-veins';
      document.body.appendChild(veins);
      gsap.fromTo(document.body, { filter: 'brightness(0.3) contrast(1.5)' }, { filter: 'brightness(1) contrast(1)', duration: 1.5, ease: 'power2.out' });
    } else {
      var veins = document.querySelector('.symbiote-veins');
      if (veins) veins.remove();
      gsap.fromTo(document.body, { filter: 'brightness(1.5) contrast(0.5)' }, { filter: 'brightness(1) contrast(1)', duration: 1, ease: 'power2.out' });
    }
  }

  /* ============================================================
     OSCORP LAB TERMINAL
     ============================================================ */
  function initOscorpTerminal() {
    var output = document.getElementById('terminal-output');
    var input = document.getElementById('terminal-input');
    var screen = output ? output.closest('.oscorp-terminal__screen') : null;
    if (!output || !input || !screen) return;

    var commandHistory = [];
    var historyIndex = -1;
    var isTyping = false;

    var bootLines = [
      { text: '> OSCORP INDUSTRIES — SECURE ACCESS TERMINAL', cls: 'terminal-line--system' },
      { text: '> Firmware v3.7.1 | Clearance: LEVEL 5', cls: 'terminal-line--system' },
      { text: '> Initializing neural link...', cls: 'terminal-line--info' },
      { text: '> Scanning biometrics... [OK]', cls: 'terminal-line--success' },
      { text: '> Connection encrypted. Session ID: #SM-' + Math.floor(Math.random() * 9000 + 1000), cls: 'terminal-line--info' },
      { text: '> Type "help" to view available commands.', cls: 'terminal-line--divider' },
      { text: '─────────────────────────────────────────────', cls: 'terminal-line--divider' },
    ];

    var commands = {
      help: function () {
        return [
          { text: '  AVAILABLE COMMANDS:', cls: 'terminal-line--info' },
          { text: '  ─────────────────────────────────────', cls: 'terminal-line--divider' },
          { text: '  help      — Show this help menu', cls: '' },
          { text: '  suits     — List Spider-Man suits database', cls: '' },
          { text: '  villains  — Access rogues gallery files', cls: '' },
          { text: '  oscorp    — Oscorp Industries profile', cls: '' },
          { text: '  venom     — Symbiote threat alert', cls: '' },
          { text: '  clear     — Clear terminal screen', cls: '' },
          { text: '  logout    — Terminate session', cls: '' },
          { text: '  ─────────────────────────────────────', cls: 'terminal-line--divider' },
        ];
      },

      suits: function () {
        return [
          { text: '> LOADING SUITS DATABASE...', cls: 'terminal-line--info' },
          { text: '', cls: '' },
          { text: '  ┌──────────────────────────────────────────────┐', cls: 'terminal-line--divider' },
          { text: '  │            SPIDER-MAN SUIT ARCHIVE            │', cls: 'terminal-line--system' },
          { text: '  ├──────────────────────────────────────────────┤', cls: 'terminal-line--divider' },
          { text: '  │ CLASSIC SUIT                                  │', cls: 'terminal-line--success' },
          { text: '  │   Defense: ████████░░ 80%                     │', cls: '' },
          { text: '  │   Agility: █████████░ 95%                     │', cls: '' },
          { text: '  │   Web:     ████████░░ 85%                     │', cls: '' },
          { text: '  ├──────────────────────────────────────────────┤', cls: 'terminal-line--divider' },
          { text: '  │ IRON SPIDER                                    │', cls: 'terminal-line--warning' },
          { text: '  │   Defense: █████████░ 95%                     │', cls: '' },
          { text: '  │   Agility: ████████░░ 80%                     │', cls: '' },
          { text: '  │   Web:     ██████████ 100%                    │', cls: '' },
          { text: '  ├──────────────────────────────────────────────┤', cls: 'terminal-line--divider' },
          { text: '  │ SYMBIOTE SUIT                                  │', cls: 'terminal-line--glitch' },
          { text: '  │   Defense: █████████░ 90%                     │', cls: '' },
          { text: '  │   Agility: ██████████ 100% [!] UNSTABLE       │', cls: 'terminal-line--warning' },
          { text: '  │   Web:     ██████████ 100% [!] ORGANIC        │', cls: 'terminal-line--warning' },
          { text: '  ├──────────────────────────────────────────────┤', cls: 'terminal-line--divider' },
          { text: '  │ NO WAY HOME                                   │', cls: 'terminal-line--info' },
          { text: '  │   Defense: ███████░░░ 70%                     │', cls: '' },
          { text: '  │   Agility: █████████░ 90%                     │', cls: '' },
          { text: '  │   Web:     ████████░░ 80%                     │', cls: '' },
          { text: '  └──────────────────────────────────────────────┘', cls: 'terminal-line--divider' },
          { text: '> 4 suits found in database.', cls: 'terminal-line--success' },
        ];
      },

      villains: function () {
        return [
          { text: '> ACCESSING ROGUES GALLERY...', cls: 'terminal-line--info' },
          { text: '', cls: '' },
          { text: '  ┌──────────────────────────────────────────────┐', cls: 'terminal-line--divider' },
          { text: '  │         VILLAIN THREAT ASSESSMENT             │', cls: 'terminal-line--system' },
          { text: '  ├──────────────────────────────────────────────┤', cls: 'terminal-line--divider' },
          { text: '  │ GREEN GOBLIN — Norman Osborn                 │', cls: 'terminal-line--success' },
          { text: '  │   STR: ███████░░░  INT: █████████░           │', cls: '' },
          { text: '  │   Threat Level: S  [STATUS: ACTIVE]          │', cls: 'terminal-line--system' },
          { text: '  ├──────────────────────────────────────────────┤', cls: 'terminal-line--divider' },
          { text: '  │ DOCTOR OCTOPUS — Otto Octavius               │', cls: 'terminal-line--success' },
          { text: '  │   STR: ████████░░  INT: █████████░           │', cls: '' },
          { text: '  │   Threat Level: S  [STATUS: ARRESTED]        │', cls: 'terminal-line--info' },
          { text: '  ├──────────────────────────────────────────────┤', cls: 'terminal-line--divider' },
          { text: '  │ VENOM — Eddie Brock                           │', cls: 'terminal-line--glitch' },
          { text: '  │   STR: █████████░  INT: ██████░░░            │', cls: '' },
          { text: '  │   Threat Level: A+ [STATUS: AT LARGE]        │', cls: 'terminal-line--system' },
          { text: '  ├──────────────────────────────────────────────┤', cls: 'terminal-line--divider' },
          { text: '  │ ELECTRO — Max Dillon                          │', cls: 'terminal-line--warning' },
          { text: '  │   STR: ████████░░  INT: █████░░░░            │', cls: '' },
          { text: '  │   Threat Level: A  [STATUS: ACTIVE]          │', cls: 'terminal-line--system' },
          { text: '  └──────────────────────────────────────────────┘', cls: 'terminal-line--divider' },
          { text: '> WARNING: All targets should be considered armed.', cls: 'terminal-line--system' },
        ];
      },

      oscorp: function () {
        return [
          { text: '> OSCORP INDUSTRIES — CLASSIFIED PROFILE', cls: 'terminal-line--system' },
          { text: '', cls: '' },
          { text: '  ╔══════════════════════════════════════════════╗', cls: 'terminal-line--divider' },
          { text: '  ║  OSCORP INDUSTRIES                           ║', cls: 'terminal-line--system' },
          { text: '  ║  Founded: 1962 | HQ: New York City           ║', cls: '' },
          { text: '  ║  CEO: Norman Osborn (CURRENT STATUS: ???)    ║', cls: 'terminal-line--warning' },
          { text: '  ╚══════════════════════════════════════════════╝', cls: 'terminal-line--divider' },
          { text: '', cls: '' },
          { text: '  Oscorp Industries is a leading biotechnology', cls: '' },
          { text: '  and defense contractor specializing in:', cls: '' },
          { text: '', cls: '' },
          { text: '  • Genetic engineering & bio-enhancement', cls: '' },
          { text: '  • Military-grade weaponry systems', cls: '' },
          { text: '  • Cross-species genetics research', cls: '' },
          { text: '  • Performance-enhancing pharmaceuticals', cls: '' },
          { text: '', cls: '' },
          { text: '  [CLASSIFIED] Project Goblin — terminated.', cls: 'terminal-line--system' },
          { text: '  [CLASSIFIED] Symbiote research — ONGOING.', cls: 'terminal-line--glitch' },
          { text: '  [WARNING]    Spider-sense dampening — FAILED.', cls: 'terminal-line--warning' },
          { text: '', cls: '' },
          { text: '> "The future is ours to create." — N. Osborn', cls: 'terminal-line--info' },
        ];
      },

      venom: function () {
        return [
          { text: '> ⚠  SYMBIOTE CONTAINMENT ALERT  ⚠', cls: 'terminal-line--glitch' },
          { text: '', cls: '' },
          { text: '  ████████████████████████████████████████', cls: 'terminal-line--glitch' },
          { text: '  ██  VENOM SYMBIOTE — THREAT LEVEL: MAX  ██', cls: 'terminal-line--glitch' },
          { text: '  ████████████████████████████████████████', cls: 'terminal-line--glitch' },
          { text: '', cls: '' },
          { text: '  Host: Eddie Brock', cls: '' },
          { text: '  Bond Status: STABLE [UNWILLING HOST]', cls: 'terminal-line--warning' },
          { text: '', cls: '' },
          { text: '  "We are Venom.', cls: 'terminal-line--glitch' },
          { text: '   We know what you did.', cls: 'terminal-line--glitch' },
          { text: '   We can taste your fear."', cls: 'terminal-line--glitch' },
          { text: '', cls: '' },
          { text: '  ABILITIES:', cls: 'terminal-line--info' },
          { text: '  • Superhuman strength (EXCEEDS Spider-Man)', cls: '' },
          { text: '  • Shape-shifting organic mass', cls: '' },
          { text: '  • Immune to Spider-Sense detection', cls: '' },
          { text: '  • Rapid regeneration & healing', cls: '' },
          { text: '  • Weakness: SONIC FREQUENCIES / HEAT', cls: 'terminal-line--warning' },
          { text: '', cls: '' },
          { text: '> CONTAINMENT PROTOCOL: CODE RED', cls: 'terminal-line--system' },
        ];
      },

      clear: function () {
        output.innerHTML = '';
        return [];
      },

      logout: function () {
        return [
          { text: '', cls: '' },
          { text: '> Terminating secure session...', cls: 'terminal-line--info' },
          { text: '> Encrypting session logs...', cls: 'terminal-line--info' },
          { text: '> Disconnecting neural link...', cls: 'terminal-line--warning' },
          { text: '', cls: '' },
          { text: '  ╔══════════════════════════════════════════╗', cls: 'terminal-line--divider' },
          { text: '  ║   SESSION TERMINATED                      ║', cls: 'terminal-line--system' },
          { text: '  ║   Thank you, Agent.                       ║', cls: 'terminal-line--divider' },
          { text: '  ╚══════════════════════════════════════════╝', cls: 'terminal-line--divider' },
          { text: '', cls: '' },
        ];
      },
    };

    function scrollToBottom() {
      screen.scrollTop = screen.scrollHeight;
    }

    function addLine(text, cls) {
      var line = document.createElement('div');
      line.className = 'terminal-line' + (cls ? ' ' + cls : '');
      line.textContent = text;
      output.appendChild(line);
      scrollToBottom();
    }

    function addCommandEcho(cmd) {
      var line = document.createElement('div');
      line.className = 'terminal-line';
      line.innerHTML = '<span style="color:#e23636">oscorp@lab:~$</span> <span style="color:#00ff88">' + escapeHtml(cmd) + '</span>';
      output.appendChild(line);
    }

    function escapeHtml(str) {
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    function typeLines(lines, index, callback) {
      if (index >= lines.length) {
        isTyping = false;
        input.disabled = false;
        input.focus();
        if (callback) callback();
        return;
      }
      var line = lines[index];
      addLine(line.text, line.cls);
      var delay = Math.min(line.text.length * 12, 400);
      if (line.text === '') delay = 50;
      setTimeout(function () {
        typeLines(lines, index + 1, callback);
      }, delay);
    }

    function processCommand(cmd) {
      var trimmed = cmd.trim().toLowerCase();
      if (trimmed === '') return;

      commandHistory.push(trimmed);
      historyIndex = commandHistory.length;

      addCommandEcho(cmd);

      if (commands[trimmed]) {
        var result = commands[trimmed]();
        if (trimmed === 'clear') {
          return;
        }
        isTyping = true;
        input.disabled = true;
        typeLines(result, 0, function () {
          if (trimmed === 'logout') {
            setTimeout(function () {
              output.innerHTML = '';
              typeLines(bootLines, 0);
            }, 3000);
          }
        });
      } else {
        addLine('> Unknown command: "' + escapeHtml(trimmed) + '"', 'terminal-line--system');
        addLine('> Type "help" for available commands.', 'terminal-line--divider');
      }
    }

    input.addEventListener('keydown', function (e) {
      if (isTyping) {
        e.preventDefault();
        return;
      }
      if (e.key === 'Enter') {
        processCommand(input.value);
        input.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0 && historyIndex > 0) {
          historyIndex--;
          input.value = commandHistory[historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          input.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          input.value = '';
        }
      }
    });

    screen.addEventListener('click', function () {
      if (!isTyping) input.focus();
    });

    /* Boot sequence when terminal scrolls into view */
    var booted = false;
    ScrollTrigger.create({
      trigger: '#oscorp-lab',
      start: 'top 80%',
      onEnter: function () {
        if (booted) return;
        booted = true;
        input.disabled = true;
        typeLines(bootLines, 0, function () {
          input.disabled = false;
          input.focus();
        });
      },
    });
  }

  /* ============================================================
     TOAST
     ============================================================ */
  function showToast(msg) {
    var toast = document.getElementById('easter-egg-toast');
    toast.querySelector('.toast__text').textContent = msg;
    toast.classList.add('visible');
    setTimeout(function () { toast.classList.remove('visible'); }, 3000);
  }

})();
