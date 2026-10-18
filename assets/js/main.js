/* Astral Experience · interacción. No hace falta tocar este archivo para actualizar contenido. */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = 'IntersectionObserver' in window;

  /* ---------- Cabecera ---------- */
  const header = $('.site-header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- Menú móvil ---------- */
  const menuToggle = $('.menu-toggle');
  const nav = $('.main-nav');
  const setMenu = (open) => {
    nav?.classList.toggle('open', open);
    menuToggle?.setAttribute('aria-expanded', String(open));
    menuToggle?.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  menuToggle?.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Año ---------- */
  const year = $('[data-year]'); if (year) year.textContent = new Date().getFullYear();

  /* ---------- Apariciones al hacer scroll ---------- */
  const reveals = $$('.reveal');
  if (!io || reduced) reveals.forEach((el) => el.classList.add('visible'));
  else {
    const ro = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
    }), { threshold: 0.12 });
    reveals.forEach((el) => ro.observe(el));
  }

  /* ---------- Brillo que sigue al cursor (solo ratón) ---------- */
  const glow = $('.cursor-glow');
  if (glow && matchMedia('(pointer:fine)').matches && !reduced) {
    let x = 0, y = 0, raf = 0;
    addEventListener('pointermove', (e) => {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(() => { glow.style.transform = `translate(${x - 140}px, ${y - 140}px)`; raf = 0; });
    }, { passive: true });
    glow.style.left = '0'; glow.style.top = '0';
  } else if (glow) glow.remove();

  /* ---------- Vídeo de portada opcional ---------- */
  const hv = $('[data-hero-video]');
  const saveData = navigator.connection?.saveData;
  if (hv && hv.dataset.src && !reduced && !saveData && matchMedia('(min-width: 48rem)').matches) {
    hv.src = hv.dataset.src;
    hv.addEventListener('playing', () => hv.classList.add('is-playing'), { once: true });
    hv.play().catch(() => {});
  } else hv?.remove();

  /* ---------- Spotify: se carga al acercarse ---------- */
  const sp = $('[data-spotify]');
  if (sp) {
    const load = () => {
      const f = document.createElement('iframe');
      f.src = sp.dataset.src;
      f.title = 'Astral Experience en Spotify';
      f.loading = 'lazy';
      f.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      f.addEventListener('load', () => f.classList.add('is-loaded'), { once: true });
      sp.append(f);
    };
    if (io) {
      const so = new IntersectionObserver(([e]) => { if (e.isIntersecting) { load(); so.disconnect(); } }, { rootMargin: '600px 0px' });
      so.observe(sp);
    } else load();
  }

  /* ---------- YouTube: miniatura automática y reproducción al pulsar ---------- */
  $$('.video-card[data-yt]').forEach((card) => {
    const id = card.dataset.yt;
    const bg = $('.video-bg', card);
    const large = card.classList.contains('video-large');
    const thumb = card.dataset.thumb
      ? `url("${card.dataset.thumb}")`
      : `url("https://i.ytimg.com/vi/${id}/${large ? 'maxresdefault' : 'hqdefault'}.jpg"), url("https://i.ytimg.com/vi/${id}/hqdefault.jpg")`;
    if (bg) bg.style.backgroundImage = thumb;
    const title = $('h3', card)?.textContent.trim() || 'Vídeo';
    card.setAttribute('aria-label', `Reproducir ${title}`);
    card.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return; // abrir en YouTube si lo pide el usuario
      e.preventDefault();
      const box = document.createElement('div');
      box.className = card.className + ' is-playing';
      box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      card.replaceWith(box);
    });
  });

  /* ---------- Conciertos: próximos / anteriores + datos para Google ---------- */
  const list = $('[data-shows]');
  if (list) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const shows = $$('[data-date]', list).map((el) => ({ el, d: new Date(el.dataset.date + 'T00:00:00') }));
    const upcoming = shows.filter((s) => s.d >= today).sort((a, b) => a.d - b.d);
    const past = shows.filter((s) => s.d < today).sort((a, b) => b.d - a.d);
    upcoming.forEach((s) => list.append(s.el));
    const pastBox = $('[data-past]'), pastList = $('[data-past-list]');
    if (past.length && pastBox && pastList) { past.forEach((s) => pastList.append(s.el)); pastBox.hidden = false; }
    if (!upcoming.length) list.hidden = true;

    // Hora peninsular: +02:00 en verano (último domingo de marzo → último domingo de octubre), +01:00 en invierno
    const madridOffset = (iso) => {
      const d = new Date(iso + 'T12:00:00Z'), y = d.getUTCFullYear();
      const lastSun = (m) => { const x = new Date(Date.UTC(y, m + 1, 0)); x.setUTCDate(x.getUTCDate() - x.getUTCDay()); return x; };
      return d >= lastSun(2) && d < lastSun(9) ? '+02:00' : '+01:00';
    };
    const txt = (el, s) => {
      const t = $(s, el)?.textContent.trim() || '';
      return t.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
    };
    const events = upcoming.map(({ el }) => {
      const href = $('.show-arrow', el)?.getAttribute('href');
      const ev = {
        '@type': 'MusicEvent',
        name: `Astral Experience en ${txt(el, '.show-city')}`,
        startDate: el.dataset.date + (el.dataset.time ? `T${el.dataset.time}:00${madridOffset(el.dataset.date)}` : ''),
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: { '@type': 'Place', name: txt(el, '.show-venue'), address: { '@type': 'PostalAddress', addressLocality: txt(el, '.show-city'), addressCountry: 'ES' } },
        performer: { '@id': 'https://www.astralexperience.com/#band' },
        description: $('.show-bands', el)?.textContent.trim(),
        image: 'https://www.astralexperience.com/assets/img/og-cover.jpg'
      };
      if (href && href !== '#') ev.offers = { '@type': 'Offer', url: href, availability: 'https://schema.org/InStock' };
      return ev;
    });
    if (events.length) {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': events });
      document.head.append(s);
    }
  }

  /* ---------- Meta Pixel (mismo ID que la web anterior), en segundo plano ---------- */
  const PIXEL_ID = '363467251248997';
  const loadPixel = () => {
    if (window.fbq) return;
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID); fbq('track', 'PageView');
  };
  addEventListener('load', () => ('requestIdleCallback' in window ? requestIdleCallback(loadPixel, { timeout: 4000 }) : setTimeout(loadPixel, 2500)));
})();
