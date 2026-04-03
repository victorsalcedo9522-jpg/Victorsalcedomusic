  // Navbar scroll
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Mobile menu
  function toggleMenu() {
    document.getElementById('mobile-menu').classList.toggle('open');
  }
  window.addEventListener('scroll', () => {
    document.getElementById('mobile-menu').classList.remove('open');
  });

  // Scroll animations
  const animated = document.querySelectorAll('.fade-up, .fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(entry.target.parentElement.children)
        .filter(el => el.classList.contains('fade-up') || el.classList.contains('fade-in'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), Math.min(idx * 70, 280));
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  animated.forEach(el => observer.observe(el));

  // ── Courses Slider ──
  (function() {
    const track    = document.getElementById('coursesTrack');
    const dotsWrap = document.getElementById('sliderDots');
    const btnPrev  = document.querySelector('.slider-prev');
    const btnNext  = document.querySelector('.slider-next');
    if (!track) return;
    const slides = track.querySelectorAll('.course-slide');
    let current = 0;

    function perPage() {
      if (window.innerWidth >= 860) return 3;
      if (window.innerWidth >= 560) return 2;
      return 1;
    }
    function maxIdx() { return Math.max(0, slides.length - perPage()); }

    function buildDots() {
      dotsWrap.innerHTML = '';
      const count = maxIdx() + 1;
      for (let i = 0; i < count; i++) {
        const d = document.createElement('button');
        d.className = 'slider-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Slide ' + (i + 1));
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
      }
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, maxIdx()));
      const slideW = slides[0].offsetWidth + 20;
      track.style.transform = 'translateX(-' + (current * slideW) + 'px)';
      dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === current));
      btnPrev.disabled = current === 0;
      btnNext.disabled = current >= maxIdx();
    }

    btnPrev.addEventListener('click', () => goTo(current - 1));
    btnNext.addEventListener('click', () => goTo(current + 1));
    window.addEventListener('resize', () => { buildDots(); goTo(Math.min(current, maxIdx())); });

    buildDots();
    goTo(0);
  })();

  // ── Descuento 40% — muestra el código al instante + envía a Formspree ──
  function handleDiscount(e) {
    e.preventDefault();
    const btn    = document.getElementById('discountBtn');
    const result = document.getElementById('discountResult');
    const form   = document.getElementById('discountForm');

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Un momento...';

    // Enviar email a Formspree para que Victor tenga la lista
    // REEMPLAZA "YOUR_FORM_ID" con tu ID de Formspree (formspree.io)
    const FORMSPREE_ID = 'xvzvbnzz';
    const data = new FormData();
    data.append('nombre', document.getElementById('lmNombre').value);
    data.append('email',  document.getElementById('lmEmail').value);
    data.append('_subject', 'Nuevo suscriptor — Código DESCUENTO40');

    fetch('https://formspree.io/f/' + FORMSPREE_ID, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
      .catch(() => {}); // No bloqueamos si Formspree falla — el código igual se muestra

    // Mostrar el código inmediatamente (no depende del backend)
    setTimeout(() => {
      form.style.display = 'none';
      result.style.display = 'block';
    }, 600);
  }

  // ── Formulario de Contacto — envío nativo a Formspree ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function() {
      const btn = document.getElementById('contactBtn');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      // El formulario se envía nativamente a Formspree y redirige de vuelta al sitio
    });
  }

  /* =========================================
     👑 AWWARDS TIER JS (PREMIUM 2026)
     ========================================= */
     
  // 1. Lenis Smooth Scroll removido para recuperar la fluidez nativa en Mac.

  // 2. Vanilla Tilt 3D
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".course-slide, .pack-card, .proj-card, .service-card, .testi-card"), {
      max: 6,
      speed: 600,
      glare: true,
      "max-glare": 0.08,
      scale: 1.02
    });
  }

  // 3. Custom Cursor Optimizado
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  
  if (cursorDot && cursorRing && window.matchMedia("(pointer: fine)").matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const renderCursor = () => {
      // Usamos transform3d para evitar repaints de GPU costosos (fluidez real a 60fps)
      cursorDot.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`;
      cursorRing.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    const hoverables = document.querySelectorAll('a, button, input, textarea, select, .course-slide, .pack-card, .proj-card, .btn');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // 4. Magnetic Buttons (Más sutiles para evitar lentitud)
  const magneticEls = document.querySelectorAll('.btn, .float-btn, .service-card');
  magneticEls.forEach(el => {
    el.classList.add('magnetic');
    el.addEventListener('mousemove', (e) => {
      const bounds = el.getBoundingClientRect();
      const x = e.clientX - bounds.left - bounds.width / 2;
      const y = e.clientY - bounds.top - bounds.height / 2;
      // Reducido a 0.08 para que no se sienta pesado/lento
      el.style.transform = `translate3d(${x * 0.08}px, ${y * 0.08}px, 0)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
