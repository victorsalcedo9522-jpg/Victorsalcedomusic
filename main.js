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

  // ── Formulario de Contacto — Formspree ──
  // REEMPLAZA "YOUR_CONTACT_FORM_ID" con tu ID de Formspree para contacto
  const CONTACT_FORMSPREE_ID = 'mbdpaedy';
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = document.getElementById('contactBtn');
      const msg = document.getElementById('contactMsg');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

      fetch('https://formspree.io/f/' + CONTACT_FORMSPREE_ID, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      })
        .then(r => r.json())
        .then(data => {
          msg.style.display = 'block';
          if (data.ok) {
            msg.style.background = 'rgba(122,158,135,0.15)';
            msg.style.color = '#7A9E87';
            msg.style.border = '1px solid rgba(122,158,135,0.3)';
            msg.innerHTML = '<i class="fas fa-check-circle"></i> ¡Mensaje recibido! Te respondo en menos de 24 horas.';
            contactForm.reset();
          } else {
            msg.style.background = 'rgba(192,104,64,0.15)';
            msg.style.color = '#C06840';
            msg.style.border = '1px solid rgba(192,104,64,0.3)';
            msg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error al enviar. Escríbeme por WhatsApp.';
          }
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar mensaje';
          btn.disabled = false;
        })
        .catch(() => {
          msg.style.display = 'block';
          msg.style.background = 'rgba(192,104,64,0.15)';
          msg.style.color = '#C06840';
          msg.style.border = '1px solid rgba(192,104,64,0.3)';
          msg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error de conexión. Escríbeme por WhatsApp.';
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar mensaje';
          btn.disabled = false;
        });
    });
  }
