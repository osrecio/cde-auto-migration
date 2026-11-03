/* index.js — only behaviours observed on the live page (stardust/replica/motion/index.json,
   stardust/chrome/header-contract.json). No framework; each block is independent. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* Hero carousel — owl {autoplay: true, autoplayTimeout: 6000, rewind: true, animateOut: 'fadeOut'}.
     Initial state is the captured one (slide 3 active, set in the markup). */
  const slider = $('.slider');
  if (slider) {
    const items = $$('.owl-item', slider);
    const dots = $$('.owl-dot', slider);
    let cur = Math.max(0, items.findIndex((i) => i.classList.contains('active')));
    let timer = null;
    const go = (n) => {
      if (n === cur) return;
      const prev = items[cur];
      prev.classList.remove('active');
      prev.removeAttribute('aria-label');
      prev.classList.add('animated', 'owl-animated-out', 'fadeOut');
      prev.addEventListener('animationend', () => prev.classList.remove('animated', 'owl-animated-out', 'fadeOut'), { once: true });
      cur = (n + items.length) % items.length;
      items[cur].classList.add('active');
      items[cur].setAttribute('aria-label', 'slide Seleccionat');
      dots.forEach((d, i) => d.classList.toggle('active', i === cur));
    };
    const play = () => { clearInterval(timer); timer = setInterval(() => go(cur + 1 < items.length ? cur + 1 : 0), 6000); };
    dots.forEach((d, i) => d.addEventListener('click', () => { go(i); if (!slider.classList.contains('paused')) play(); }));
    $('.pause-slider', slider).addEventListener('click', () => { clearInterval(timer); slider.classList.add('paused'); });
    $('.play-slider', slider).addEventListener('click', () => { slider.classList.remove('paused'); play(); });
    play();
  }

  /* Section bullets — scroll-spy: `.bullets a.active` follows the section in view (none at the top). */
  const bullets = $$('.bullets a[data-target]');
  if (bullets.length) {
    const spy = () => {
      let on = -1;
      if (window.scrollY > 0) bullets.forEach((b, i) => { const t = $(b.dataset.target); if (t && t.getBoundingClientRect().top <= window.innerHeight / 2) on = i; });
      bullets.forEach((b, i) => b.classList.toggle('active', i === on));
    };
    window.addEventListener('scroll', spy, { passive: true });
    window.addEventListener('scroll', () => document.body.classList.toggle('scroll-mark', window.scrollY > 0), { passive: true });
  }

  /* Header: Accés modal (click → dialog, focus moves in, page scroll locked; × / Esc / backdrop close). */
  const modal = $('#ceca-modal');
  const trigger = $('.cecaTrigger');
  const closeModal = () => { modal.classList.remove('show'); trigger.closest('.online').classList.remove('open'); modal.hidden = true; document.documentElement.classList.remove('modal-open'); trigger.focus(); };
  if (modal && trigger) {
    const open = () => {
      modal.hidden = false; modal.style.display = 'block'; void modal.offsetWidth;   // start from opacity 0 so the .15s fade runs
      modal.classList.add('show'); modal.style.display = ''; trigger.closest('.online').classList.add('open');
      document.documentElement.classList.add('modal-open'); $('.close', modal).focus();
    };
    trigger.addEventListener('click', open);
    trigger.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    $('.close', modal).addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  }

  /* Header: language dropdown (click toggles the es/ca list under the trigger). */
  const lang = $('#languagesDropdownMenuButton');
  const langMenu = $('.lang-menu');
  if (lang && langMenu) lang.addEventListener('click', () => { const o = langMenu.classList.toggle('show'); langMenu.parentElement.classList.toggle('show', o); lang.closest('.languages').classList.toggle('open', o); lang.setAttribute('aria-expanded', String(o)); });

  /* Header: "Productes i serveis" mega panel (opens on hover and on click). */
  $$('#navigation .child-menu > li').forEach((li) => {
    const a = li.querySelector(':scope > a.has-children');
    if (!a) return;
    const set = (o) => { li.classList.toggle('open', o); a.setAttribute('aria-expanded', String(o)); };
    li.addEventListener('mouseenter', () => set(true));
    li.addEventListener('mouseleave', () => set(false));
    a.addEventListener('click', (e) => { e.preventDefault(); set(!li.classList.contains('open')); });
  });

  /* Header: search launcher (click opens the search field over the right of the nav bar, focus moves in). */
  const launcher = $('#globalSearchButton');
  const search = $('#banner .search');
  if (launcher && search) launcher.addEventListener('click', () => { const o = search.classList.toggle('open'); if (o) $('.field', search).focus(); });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (modal && modal.classList.contains('show')) closeModal();
    if (langMenu) { langMenu.classList.remove('show'); langMenu.parentElement.classList.remove('show'); }
    if (search) search.classList.remove('open');
  });
})();
