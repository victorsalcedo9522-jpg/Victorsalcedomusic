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


  // ── Lead Magnet — Código de descuento (se inyecta solo tras envío exitoso) ──
  function handleLeadForm(e) {
    e.preventDefault();
    const btn    = document.getElementById('leadBtn');
    const result = document.getElementById('leadResult');
    const form   = document.getElementById('leadForm');

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Un momento...';

    fetch('https://formspree.io/f/xvzvbnzz', {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(res => {
      if (res.ok) {
        document.getElementById('discountCodeDisplay').textContent = atob('VlNNVVNJQzI1');
        form.style.display = 'none';
        result.style.display = 'block';
      } else {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-tag"></i> Quiero mi descuento';
      }
    })
    .catch(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-tag"></i> Quiero mi descuento';
    });
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
