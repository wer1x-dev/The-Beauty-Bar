/* The Beauty Bar — interactions */
(function () {
  'use strict';

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  function closeNav() {
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

  /* ---------- Scroll reveal (images + blocks) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-media').forEach(el => io.observe(el));

  /* ---------- Active nav link ---------- */
  const sections = ['about', 'services', 'gallery', 'why', 'location']
    .map(id => document.getElementById(id));
  const navLinks = document.querySelectorAll('.nav__link');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l =>
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => s && spy.observe(s));

  /* ---------- Services tabs ---------- */
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      panels.forEach(p => {
        const active = p.id === 'panel-' + tab.dataset.tab;
        p.classList.toggle('is-active', active);
        p.hidden = !active;
      });
    });
  });

  /* ---------- Booking form → WhatsApp ---------- */
  const WA_NUMBER = '77788837224';

  const SERVICES = {
    'Hair': ['Женская стрижка (от 4000 ₸)', 'Мужская стрижка (от 3000 ₸)', 'Детская стрижка', 'Сложное окрашивание', 'Уход за волосами', 'Другая услуга Hair'],
    'Nails': ['Маникюр', 'Педикюр', 'Наращивание ногтей', 'Дизайн ногтей', 'Другая услуга Nails'],
    'Brows & Lashes': ['Коррекция бровей', 'Ламинирование бровей', 'Наращивание ресниц', 'Ламинирование ресниц', 'Другая услуга Brows & Lashes'],
    'Beauty Care': ['Ламинирование', 'Шугаринг', 'Комплексный визит', 'Другая услуга Beauty Care']
  };

  const form = document.getElementById('bookingForm');
  const fCategory = document.getElementById('fCategory');
  const fService = document.getElementById('fService');
  const fName = document.getElementById('fName');
  const fTime = document.getElementById('fTime');
  const hint = document.getElementById('bookingHint');

  fCategory.addEventListener('change', () => {
    const list = SERVICES[fCategory.value] || [];
    fService.innerHTML = '<option value="" disabled selected>Выберите услугу</option>';
    list.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      fService.appendChild(opt);
    });
    fService.disabled = list.length === 0;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!fCategory.value || !fCategory.value.trim()) { fCategory.focus(); flash('Выберите категорию услуги.'); return; }
    if (!fService.value || fService.disabled || fService.selectedIndex <= 0) { fService.focus(); flash('Выберите услугу.'); return; }

    const lines = [
      'Здравствуйте! Хочу записаться в The Beauty Bar.',
      '',
      'Категория: ' + fCategory.value,
      'Услуга: ' + fService.value
    ];
    if (fName.value.trim()) lines.push('Имя: ' + fName.value.trim());
    if (fTime.value.trim()) lines.push('Желаемое время: ' + fTime.value.trim());
    lines.push('', 'Подскажите, пожалуйста, удобное окошко и точную стоимость.');

    const url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener');
    flash('WhatsApp открыт — сообщение уже подготовлено. Спасибо!');
    form.reset();
    fService.innerHTML = '<option value="" disabled selected>Сначала выберите категорию</option>';
    fService.disabled = true;
  });

  function flash(text) {
    hint.textContent = text;
    hint.style.color = '#b39b74';
    clearTimeout(flash._t);
    flash._t = setTimeout(() => {
      hint.textContent = 'После нажатия откроется WhatsApp с подготовленным сообщением на номер +7 778 883 72 24.';
      hint.style.color = '';
    }, 6000);
  }

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
