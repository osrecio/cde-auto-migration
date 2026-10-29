/* accesibilidad.js — chrome behaviours copied from index.js (header: Accés modal, language dropdown,
   Productes i serveis panel, search) + the page's responsiveTabs (tabs ≥768, collapsible accordion <768). */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];


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

  /* Accessibility tabs — responsiveTabs {startCollapsed: 'accordion', collapsible: 'accordion'}:
     tab click activates its panel, moves "(Seleccionat)" and tabindex; accordion title toggles. */
  const tabs = $('#c_667671914-features');
  if (tabs) {
    const lis = $$('.r-tabs-nav > li', tabs);
    const titles = $$('.r-tabs-accordion-title', tabs);
    const panels = $$('.r-tabs-panel', tabs);
    const activate = (i) => {
      panels.forEach((p, j) => { const on = j === i; p.classList.toggle('r-tabs-state-active', on); p.classList.toggle('r-tabs-state-default', !on); titles[j].classList.toggle('r-tabs-state-active', on); });
      lis.forEach((li, j) => {
        const on = j === i;
        li.classList.toggle('r-tabs-state-active', on); li.classList.toggle('r-tabs-state-default', !on);
        li.setAttribute('aria-selected', String(on));
        const a = $('a', li); a.tabIndex = on ? 0 : -1; $('.acc-sel', li).textContent = on ? '(Seleccionat)' : '';
      });
    };
    /* <768 the accordion starts collapsed: no tab carries "(Seleccionat)" until one is opened */
    if (window.matchMedia('(max-width: 767px)').matches) lis.forEach((li) => { $('.acc-sel', li).textContent = ''; li.setAttribute('aria-selected', 'false'); });
    lis.forEach((li, i) => $('a', li).addEventListener('click', (e) => { e.preventDefault(); activate(i); }));
    titles.forEach((t, i) => $('a', t).addEventListener('click', (e) => {
      e.preventDefault();
      const open = !panels[i].classList.contains('acc-open');
      panels.forEach((p, j) => { p.classList.toggle('acc-open', open && j === i); titles[j].classList.toggle('acc-open', open && j === i); });
      activate(i);
    }));
    lis.forEach((li, i) => $('a', li).addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const n = (i + (e.key === 'ArrowRight' ? 1 : lis.length - 1)) % lis.length; $('a', lis[n]).focus();
    }));
  }
})();
