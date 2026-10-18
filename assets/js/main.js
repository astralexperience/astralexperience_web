/* Astral Experience · interacción mínima. No hace falta tocar este archivo para actualizar contenido. */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Cabecera: fondo al hacer scroll ---------- */
  const header = $('[data-header]');
  const hero = $('.hero');
  if (header && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => header.classList.toggle('is-scrolled', !e.isIntersecting), { rootMargin: '-80px 0px 0px' })
      .observe($('.hero__content') || hero);
  }

  /* ---------- Menú móvil ---------- */
  const toggle = $('[data-menu-toggle]');
  const menu = $('#menu');
  if (toggle && menu) {
    const set = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  }

  /* ---------- Tema frío / cálido ---------- */
  const themeBtn = $('[data-theme-toggle]');
  const themeLabel = $('[data-theme-label]');
  const meta = $('meta[name="theme-color"]');
  const syncTheme = () => {
    const warm = root.dataset.theme === 'calido';
    if (themeLabel) themeLabel.textContent = warm ? 'Cálido' : 'Frío';
    themeBtn?.setAttribute('aria-label', warm ? 'Cambiar a tema frío' : 'Cambiar a tema cálido');
    meta?.setAttribute('content', warm ? '#1C0C0F' : '#0B1626');
  };
  syncTheme();
  themeBtn?.addEventListener('click', (e) => {
    const next = root.dataset.theme === 'calido' ? 'frio' : 'calido';
    const apply = () => { root.dataset.theme = next; syncTheme(); };
    try { localStorage.setItem('ae-theme', next); } catch (_) {}
    if (document.startViewTransition && !reduced) {
      root.style.setProperty('--vt-x', e.clientX + 'px');
      root.style.setProperty('--vt-y', e.clientY + 'px');
      document.startViewTransition(apply);
    } else apply();
  });

  /* ---------- Entrada del hero en franjas ---------- */
  const slices = $('[data-slices]');
  if (slices && hero) {
    if (reduced) hero.classList.add('is-settled');
    else {
      const n = 7, frag = document.createDocumentFragment();
      for (let i = 0; i < n; i++) {
        const s = document.createElement('span');
        const t = (i / n) * 100, b = 100 - ((i + 1) / n) * 100;
        const dx = (i % 2 ? 1 : -1) * (6 + ((i * 37) % 14));
        s.style.cssText = `--t:${t}%;--b:${b}%;--dx:${dx}vw;--delay:${(i * 0.045).toFixed(3)}s`;
        frag.append(s);
      }
      slices.append(frag);
      setTimeout(() => hero.classList.add('is-settled'), 1500);
    }
  }

  /* ---------- Vídeos de YouTube (carga solo al pulsar) ---------- */
  const list = $('[data-videos]');
  if (list) {
    const items = $$('li[data-yt]', list);
    if (items.length) {
      const thumb = (id, q = 'hqdefault') => `https://i.ytimg.com/vi/${id}/${q}.jpg`;
      const stage = document.createElement('div');
      stage.className = 'video-stage';
      const player = document.createElement('div');
      player.className = 'yt';
      list.before(stage);
      stage.append(player, list);

      const show = (li, autoplay) => {
        const id = li.dataset.yt, title = li.dataset.title || li.textContent.trim();
        $$('button', list).forEach((b) => b.removeAttribute('aria-current'));
        $('button', li)?.setAttribute('aria-current', 'true');
        if (autoplay) {
          player.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
          return;
        }
        player.style.backgroundImage = `url("${thumb(id, 'maxresdefault')}"), url("${thumb(id)}")`;
        player.innerHTML = `<button class="yt__play" type="button" aria-label="Reproducir ${title}"><span><svg aria-hidden="true"><use href="assets/img/icons.svg#play"/></svg></span></button><p class="yt__title">${title}</p>`;
        $('.yt__play', player).addEventListener('click', () => show(li, true), { once: true });
      };

      items.forEach((li, i) => {
        const title = li.dataset.title || li.textContent.trim();
        li.textContent = '';
        const b = document.createElement('button');
        b.type = 'button';
        b.innerHTML = `<img src="${thumb(li.dataset.yt, 'mqdefault')}" width="320" height="180" loading="lazy" decoding="async" alt=""><span>${title}</span>`;
        b.addEventListener('click', () => { show(li, true); if (matchMedia('(max-width: 63.99rem)').matches) player.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }); });
        li.append(b);
        if (i === 0) show(li, false);
      });
    }
  }

  /* ---------- Conciertos: próximos / anteriores + datos para Google ---------- */
  const shows = $('[data-shows]');
  if (shows) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const all = $$('li[data-date]', shows).map((li) => ({ li, d: new Date(li.dataset.date + 'T00:00:00') }));
    const upcoming = all.filter((s) => s.d >= today).sort((a, b) => a.d - b.d);
    const past = all.filter((s) => s.d < today).sort((a, b) => b.d - a.d);
    upcoming.forEach((s) => shows.append(s.li));
    const pastWrap = $('[data-shows-past]'), pastList = $('[data-shows-past-list]');
    if (past.length && pastWrap && pastList) { past.forEach((s) => pastList.append(s.li)); pastWrap.hidden = false; }
    if (!upcoming.length) { shows.hidden = true; $('[data-shows-empty]').hidden = false; }

    const txt = (li, s) => $(s, li)?.textContent.trim() || '';
    const events = upcoming.map(({ li }) => {
      const tickets = $('.show__tickets', li)?.getAttribute('href');
      const ev = {
        '@type': 'MusicEvent',
        name: `Astral Experience en ${txt(li, '.show__city')}`,
        startDate: li.dataset.date,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: { '@type': 'Place', name: txt(li, '.show__venue'), address: { '@type': 'PostalAddress', addressLocality: txt(li, '.show__city'), addressCountry: 'ES' } },
        performer: { '@id': 'https://www.astralexperience.com/#band' },
        image: 'https://www.astralexperience.com/assets/img/og-image.jpg'
      };
      if (tickets && tickets !== '#') ev.offers = { '@type': 'Offer', url: tickets, availability: 'https://schema.org/InStock' };
      return ev;
    });
    if (events.length) {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': events });
      document.head.append(s);
    }
  }

  /* ---------- Año del pie ---------- */
  const y = $('[data-year]'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Meta Pixel (mismo ID que la web anterior), cargado sin bloquear la página ---------- */
  const PIXEL_ID = '363467251248997';
  const loadPixel = () => {
    if (window.fbq) return;
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID); fbq('track', 'PageView');
  };
  addEventListener('load', () => ('requestIdleCallback' in window ? requestIdleCallback(loadPixel, { timeout: 4000 }) : setTimeout(loadPixel, 2500)));
})();
