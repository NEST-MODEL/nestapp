document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    const backTop = document.getElementById('backToTop');
    if (backTop) {
      if (window.scrollY > 600) backTop.classList.add('show');
      else backTop.classList.remove('show');
    }
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      burger.classList.toggle('active', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        burger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Back to top ---------- */
  const backTop = document.getElementById('backToTop');
  if (backTop) {
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Tachometer ring + counters (hero) ---------- */
  const tachoFill = document.getElementById('tachoFill');
  const tachoValue = document.getElementById('tachoValue');
  const CIRC = 2 * Math.PI * 78; // r=78
  let tachoAnimated = false;

  function animateTacho() {
    if (tachoAnimated || !tachoFill) return;
    tachoAnimated = true;
    const targetRating = 4.8;
    const maxRating = 5;
    const offset = CIRC - (targetRating / maxRating) * CIRC;
    requestAnimationFrame(() => {
      tachoFill.style.strokeDasharray = CIRC;
      tachoFill.style.strokeDashoffset = offset;
    });

    let current = 0;
    const step = () => {
      current += 0.12;
      if (current >= targetRating) current = targetRating;
      tachoValue.textContent = current.toFixed(1);
      if (current < targetRating) requestAnimationFrame(step);
    };
    step();
  }

  const heroSection = document.getElementById('home');
  if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) animateTacho();
      });
    }, { threshold: 0.4 });
    heroObserver.observe(heroSection);
  }

  /* ---------- Trust strip counters ---------- */
  const counters = document.querySelectorAll('.trust-num');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      countObserver.unobserve(el);
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimal || '0', 10);
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = decimals ? value.toFixed(decimals) : Math.round(value);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = decimals ? target.toFixed(decimals) : target;
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => countObserver.observe(c));

  /* ---------- Accordion (FAQ) ---------- */
  document.querySelectorAll('.acc-item').forEach(item => {
    const head = item.querySelector('.acc-head');
    const body = item.querySelector('.acc-body');
    head.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.acc-item').forEach(other => {
        other.classList.remove('active');
        other.querySelector('.acc-body').style.maxHeight = null;
      });
      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Hero parallax on scroll ---------- */
  const slow = document.querySelector('.parallax-slow');
  const fast = document.querySelector('.parallax-fast');
  const handleParallax = () => {
    const y = window.scrollY;
    if (slow) slow.style.transform = `translateY(${y * 0.08}px)`;
    if (fast) fast.style.transform = `translateY(${y * 0.16}px)`;
  };
  document.addEventListener('scroll', handleParallax, { passive: true });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('yearNow');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
