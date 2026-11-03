import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Header — caixaenginyers.com #banner, decorated from the authored /nav document.
 * Sections of /nav (default content, identified by content, order as fallback):
 *  brand (logo image + home link) · actions (Accés, Dona't d'alta) · login modal
 *  (h2 + links) · utility (Oficines, Seguretat, Grup, Fundació) · languages (es / ca)
 *  · main nav (nested lists, 3 levels) · search (link to the results page).
 * Authored nodes are MOVED into the chrome layout, never rebuilt (EW1).
 * @ew-exempt <p> banca-online link (login section) — config: the iframe src
 * @ew-exempt <span> lang-toggle label — derived from the current-language link
 * @ew-exempt <a> logo link text — text-as-metadata: becomes the logo image alt
 */

const SOURCE_HOST = 'https://www.caixaenginyers.com';
const SEARCH_FALLBACK = `${SOURCE_HOST}/resultados-busqueda/-/general-search/PWkTISzrz6FZ/`;
const isMobile = window.matchMedia('(width <= 991px)');
const SVG_NS = 'http://www.w3.org/2000/svg';
const SEARCH_PATH = 'M503.254 467.861l-133.645-133.645c27.671-35.13 44.344-79.327 44.344-127.415 '
  + '0-113.784-92.578-206.362-206.362-206.362s-206.362 92.578-206.362 206.362 92.578 206.362 '
  + '206.362 206.362c47.268 0 90.735-16.146 125.572-42.969l133.851 133.851c5.002 5.002 11.554 '
  + '7.488 18.106 7.488s13.104-2.486 18.106-7.488c10.004-10.003 10.004-26.209 0.029-36.183z'
  + 'M52.446 206.801c0-85.558 69.616-155.173 155.173-155.173s155.174 69.616 155.174 155.173'
  + '-69.616 155.173-155.173 155.173-155.173-69.616-155.173-155.173z';

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else node.setAttribute(k, v);
  });
  node.append(...children);
  return node;
}

function searchIcon() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 512 512');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', SEARCH_PATH);
  svg.append(path);
  return svg;
}

/** The pipeline wraps list-item content in <p> on delivery (#98): unwrap it. */
function unwrapListParagraphs(root) {
  root.querySelectorAll('li > p').forEach((p) => p.replaceWith(...p.childNodes));
}

/**
 * Wraps an authored link's text nodes in a span (presentation refinement — the
 * layout never depends on it; the source theme renders span.button-text / span.text).
 */
function wrapLinkText(a, className = 'button-text') {
  if (!a || a.querySelector(`:scope > .${className}`)) return;
  const texts = [...a.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE
    && n.textContent.trim());
  if (!texts.length) return;
  const span = el('span', { class: className });
  texts[0].before(span);
  texts.forEach((t) => span.append(t));
}

/** Drops whitespace-only text nodes directly under an element. */
function dropBlankText(node) {
  [...node.childNodes].forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) n.remove();
  });
}

function sectionRoles(fragment) {
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const roles = {};
  const free = [];
  sections.forEach((section) => {
    const has = (sel) => section.querySelector(sel);
    if (!roles.nav && has('ul ul')) roles.nav = section;
    else if (!roles.search && has('a[href*="general-search"], a[href*="resultados-busqueda"]')) {
      roles.search = section;
    } else if (!roles.modal && has('h2, h3, a[href*="bancaonline"]')) roles.modal = section;
    else if (!roles.brand && has('picture, img') && !has('ul')) roles.brand = section;
    else if (!roles.languages && has('ul')
      && [...section.querySelectorAll('a')].every((a) => a.textContent.trim().length <= 3)) {
      roles.languages = section;
    } else free.push(section);
  });
  [roles.actions, roles.utility] = free.filter((s) => s.querySelector('ul'));
  return roles;
}

function contentOf(section) {
  if (!section) return [];
  const wrapper = section.querySelector('.default-content-wrapper') || section;
  return [...wrapper.children];
}

function hrefOf(a) {
  try {
    return new URL(a.getAttribute('href'), window.location).href;
  } catch (e) {
    return a.getAttribute('href') || '';
  }
}

function tagItems(ul, rules) {
  [...ul.children].forEach((li) => {
    const a = li.querySelector('a');
    const href = a ? hrefOf(a) : '';
    const rule = rules.find(([re]) => re.test(href));
    if (rule) li.classList.add(rule[1]);
  });
}

function isHomePage() {
  const path = window.location.pathname.replace(/\/index$/, '/');
  return path === '/' || document.body.classList.contains('home')
    || getMetadata('header-fundacio') === 'show';
}

/* ---------------------------------------------------------------- brand */
function buildBrand(section) {
  const title = el('div', { class: 'site-title' });
  const nodes = contentOf(section);
  const link = nodes.map((n) => n.querySelector('a')).find(Boolean);
  const pic = nodes.map((n) => n.querySelector('picture') || n.querySelector('img')).find(Boolean);
  if (link) {
    const img = pic && (pic.tagName === 'IMG' ? pic : pic.querySelector('img'));
    if (img) {
      // the logo link's text is its accessible name: carried by the image alt, as live
      img.alt = link.textContent.trim() || img.alt;
      img.width = 400;
      img.height = 76;
      img.loading = 'eager';
      // the source serves the logo PNG: drop the pipeline's webp renditions (colour fidelity)
      pic.querySelectorAll('source[type="image/webp"]').forEach((s) => s.remove());
      link.replaceChildren(pic);
    } else {
      wrapLinkText(link);
    }
  }
  nodes.forEach((n) => {
    if (n.textContent.trim() || n.querySelector('a, img')) title.append(n);
  });
  return title;
}

/* ---------------------------------------------------------------- login modal */
function buildModal(section, trigger, onClose) {
  const modal = el('div', {
    class: 'modal modal-ceca', role: 'dialog', hidden: '',
  });
  const close = el('button', {
    class: 'close', type: 'button', 'aria-label': 'Tancar el diàleg', title: 'Tancar la finestra',
  }, '×');
  const head = el('div', { class: 'lightbox-header' });
  const login = el('div', { class: 'lightbox-login' });
  const loginFoot = el('div', { class: 'lightbox-login-footer' });
  const footText = el('div', { class: 'lightbox-footer-text' });
  const footCta = el('div', { class: 'lightbox-footer-cta' });
  const foot = el('div', { class: 'lightbox-footer' }, footText, footCta);
  let frameSrc = '';
  contentOf(section).forEach((n) => {
    const a = n.querySelector('a');
    if (/^H\d$/.test(n.tagName)) {
      n.id = n.id || 'login-heading';
      modal.setAttribute('aria-labelledby', n.id);
      head.append(n);
    } else if (a && /bancaonline/.test(a.href)) {
      frameSrc = a.href;
      n.classList.add('frame-source');
      login.append(n);
    } else if (n.tagName === 'UL') {
      loginFoot.append(n);
    } else if (n.classList.contains('button-wrapper') || n.querySelector('strong a, em a')) {
      footCta.append(n);
    } else if (a && !head.querySelector('a')) {
      head.append(n);
    } else if (a) {
      loginFoot.append(n);
    } else {
      footText.append(n);
    }
  });
  const frameBox = el('div', { class: 'lightbox-login-ceca' });
  login.append(frameBox, loginFoot);
  const content = el('div', { class: 'modal-content' }, close, head, login, foot);
  modal.append(el('div', { class: 'modal-dialog modal-sm' }, content));

  const closeModal = () => {
    if (modal.hidden) return;
    modal.classList.remove('show');
    modal.hidden = true;
    modal.removeAttribute('aria-modal');
    document.documentElement.classList.remove('modal-open');
    trigger.setAttribute('aria-expanded', 'false');
    onClose();
    trigger.focus();
  };
  const openModal = () => {
    if (frameSrc && !frameBox.firstChild) {
      frameBox.append(el('iframe', {
        src: frameSrc, title: 'Banca Online', loading: 'lazy',
      }));
    }
    modal.hidden = false;
    modal.setAttribute('aria-modal', 'true');
    // force a style flush so the .15s opacity fade starts from 0
    modal.getBoundingClientRect();
    modal.classList.add('show');
    document.documentElement.classList.add('modal-open');
    trigger.setAttribute('aria-expanded', 'true');
    close.focus();
  };
  close.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  return { modal, openModal, closeModal };
}

/* ---------------------------------------------------------------- main nav */
function decorateNav(ul) {
  ul.classList.add('nav-top');
  ul.setAttribute('aria-label', 'Pàgines del lloc');
  const selectedLabel = (getMetadata('nav-selected') || '').trim().toLowerCase();
  const tops = [...ul.children];
  tops.forEach((li) => {
    dropBlankText(li);
    li.classList.add('nav-item');
    wrapLinkText(li.querySelector(':scope > a'), 'text');
    const sub = li.querySelector(':scope > ul');
    if (!sub) return;
    sub.classList.add('child-menu');
    const plus = el('button', {
      class: 'icon-plus',
      type: 'button',
      'aria-expanded': 'false',
      'aria-label': `Desplega ${li.querySelector('a')?.textContent.trim() || ''}`.trim(),
    });
    li.insertBefore(plus, sub);
    plus.addEventListener('click', () => {
      const open = !li.classList.contains('opened');
      li.classList.toggle('opened', open);
      plus.setAttribute('aria-expanded', String(open));
    });
    [...sub.children].forEach((child) => {
      dropBlankText(child);
      const grand = child.querySelector(':scope > ul');
      const link = child.querySelector(':scope > a');
      const pic = child.querySelector(':scope > picture, :scope > img');
      if (grand) {
        grand.classList.add('grandchild-menu');
        // the group label is authored text (no link): move it into a toggle anchor
        const toggle = link || el('a', { href: '#' });
        toggle.classList.add('has-children');
        toggle.setAttribute('role', 'button');
        toggle.setAttribute('aria-expanded', 'false');
        [...child.childNodes].forEach((n) => {
          if (n !== grand && n !== toggle) toggle.append(n);
        });
        child.insertBefore(toggle, grand);
        wrapLinkText(toggle, 'text');
        const iconPic = toggle.querySelector('picture, img');
        if (iconPic) toggle.prepend(el('span', { class: 'nav-icon' }, iconPic));
        const set = (open) => {
          child.classList.toggle('open', open);
          toggle.setAttribute('aria-expanded', String(open));
        };
        child.addEventListener('mouseenter', () => { if (!isMobile.matches) set(true); });
        child.addEventListener('mouseleave', () => { if (!isMobile.matches) set(false); });
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          // desktop: click / Enter opens (hover already may have); mobile: toggles
          set(isMobile.matches ? !child.classList.contains('open') : true);
        });
        [...grand.children].forEach((g) => {
          dropBlankText(g);
          const ga = g.querySelector(':scope > a');
          const gp = g.querySelector(':scope > picture, :scope > img');
          wrapLinkText(ga, 'text');
          if (ga && gp) ga.prepend(el('span', { class: 'nav-icon' }, gp));
        });
      } else {
        wrapLinkText(link, 'text');
        if (link && pic) link.prepend(el('span', { class: 'nav-icon' }, pic));
      }
    });
  });
  const selected = tops.find((li) => selectedLabel
    && li.querySelector('a')?.textContent.trim().toLowerCase() === selectedLabel) || tops[0];
  if (selected) {
    selected.classList.add('selected', 'opened');
    selected.querySelector(':scope > .icon-plus')?.setAttribute('aria-expanded', 'true');
  }
}

/* ---------------------------------------------------------------- search */
function buildSearch(section) {
  const nodes = contentOf(section);
  const link = nodes.map((n) => n.querySelector('a')).find(Boolean);
  let base = link ? hrefOf(link) : SEARCH_FALLBACK;
  if (!base.endsWith('/')) base += '/';
  const container = el('div', { class: 'search-container' });
  const launcher = el('a', {
    class: 'search-launcher', href: '#', role: 'button', title: 'Cerca', 'aria-expanded': 'false',
  }, searchIcon(), el('span', { class: 'sr-only' }, 'Inicia Cerca'));
  const field = el('input', {
    class: 'field',
    type: 'text',
    name: 'q',
    placeholder: 'Cerca',
    title: 'Cerca amb almenys 3 caràcters',
    'aria-label': 'Cerca',
    autocomplete: 'off',
  });
  const submit = el('span', { class: 'search-submit', title: 'Cerca' });
  nodes.forEach((n) => submit.append(n));
  if (link) {
    wrapLinkText(link, 'hide-accessible');
    link.prepend(searchIcon());
    link.setAttribute('role', 'button');
  }
  const form = el('form', {
    class: 'search', role: 'search', action: base, method: 'get',
  }, el('span', { class: 'sr-only' }, 'General search Portlet'), field, submit);
  const setOpen = (open) => {
    form.classList.toggle('open', open);
    container.classList.toggle('open', open);
    launcher.setAttribute('aria-expanded', String(open));
    if (open) field.focus();
  };
  const go = (e) => {
    e.preventDefault();
    const q = field.value.trim();
    if (!q && !isMobile.matches) {
      // live: the submit glyph on an empty field folds the search back to its launcher
      setOpen(false);
      launcher.focus();
      return;
    }
    if (q.length < 3) {
      field.focus();
      return;
    }
    window.location.href = `${base}search/${encodeURIComponent(q)}?`;
  };
  form.addEventListener('submit', go);
  if (link) link.addEventListener('click', go);
  document.addEventListener('click', (e) => {
    if (form.classList.contains('open') && !container.contains(e.target)) setOpen(false);
  });
  launcher.addEventListener('click', (e) => {
    e.preventDefault();
    setOpen(!form.classList.contains('open'));
  });
  container.append(launcher, form);
  return { container, close: () => setOpen(false), isOpen: () => form.classList.contains('open') };
}

/* ---------------------------------------------------------------- languages */
function buildLanguages(section) {
  const box = el('div', { class: 'languages' });
  const ul = contentOf(section).find((n) => n.tagName === 'UL');
  if (!ul) return { box, close: () => {} };
  ul.classList.add('lang-menu');
  const path = window.location.pathname;
  let current = 'ca';
  [...ul.querySelectorAll('a')].forEach((a) => {
    const code = a.textContent.trim().toLowerCase();
    a.setAttribute('lang', code);
    const local = new URL(hrefOf(a)).origin === window.location.origin;
    if (local) {
      current = code;
      a.href = path;
    } else if (code === 'es') {
      a.href = `${SOURCE_HOST}/es${path === '/' ? '/' : path}`;
    }
  });
  const toggle = el('button', {
    class: 'lang-toggle', type: 'button', 'aria-haspopup': 'true', 'aria-expanded': 'false',
  }, el('span', {}, current));
  const set = (open) => {
    ul.classList.toggle('show', open);
    box.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => set(!ul.classList.contains('show')));
  box.append(el('span', { class: 'sr-only' }, "Selector d'idioma"), toggle, ul);
  return { box, close: () => set(false) };
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;
  unwrapListParagraphs(fragment);
  // whitespace inside <picture> renders a trailing space after the image
  fragment.querySelectorAll('picture').forEach(dropBlankText);
  // menu icons must be painted the moment a panel opens (hover): no lazy loading
  fragment.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; });
  const roles = sectionRoles(fragment);

  const banner = el('div', { class: 'banner', id: 'banner' });
  banner.classList.toggle('is-home', isHomePage());

  /* left: logo + action bar */
  const headingLeft = el('div', { class: 'heading-left' }, buildBrand(roles.brand));
  const hamburger = el(
    'button',
    {
      class: 'hamburguer', type: 'button', 'aria-expanded': 'false', 'aria-label': 'Menú',
    },
    el('span', { class: 'icon-bar' }),
    el('span', { class: 'icon-bar' }),
    el('span', { class: 'icon-bar' }),
  );
  const actions = el('div', { class: 'actions' });
  const actionsUl = contentOf(roles.actions).find((n) => n.tagName === 'UL');
  const onlinePartner = el('div', { class: 'online-partner' }, hamburger, actions);
  let modalApi = null;
  if (actionsUl) {
    actions.append(actionsUl);
    const items = [...actionsUl.children];
    items.forEach((li, i) => {
      li.classList.add(i === 0 ? 'online' : 'partner');
      wrapLinkText(li.querySelector('a'));
    });
    const accesLink = items[0]?.querySelector('a');
    if (accesLink) {
      accesLink.prepend(el('img', {
        class: 'button-icon',
        src: `${window.hlx.codeBasePath}/blocks/header/icons/user.png`,
        width: '20',
        height: '19',
        alt: '',
      }));
    }
    const trigger = items[0]?.querySelector('a');
    if (trigger && roles.modal) {
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-label', 'Accedeix a Banca Online. (Obre una finestra modal)');
      modalApi = buildModal(roles.modal, trigger, () => items[0].classList.remove('open'));
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        items[0].classList.add('open');
        modalApi.openModal();
      });
      onlinePartner.append(modalApi.modal);
    }
  }
  headingLeft.append(onlinePartner);

  /* right: utility links + language switch (desktop navy panel, mobile drawer head) */
  const closeMenu = el('button', { class: 'close-menu', type: 'button' }, el('span', {}, 'TancaMenú'));
  const utility = el('div', { class: 'utility' });
  const utilityUl = contentOf(roles.utility).find((n) => n.tagName === 'UL');
  if (utilityUl) {
    tagItems(utilityUl, [
      [/oficinas|oficines/, 'offices'],
      [/segur/, 'security'],
      [/grupo|grup/, 'group'],
      [/fundaci/, 'fundacio'],
    ]);
    utilityUl.querySelectorAll('a').forEach((a) => wrapLinkText(a));
    utility.append(utilityUl);
  }
  const langs = buildLanguages(roles.languages);
  const headingRight = el('div', { class: 'heading-right' }, closeMenu, utility, langs.box);

  /* main navigation + search */
  const navigation = el('nav', { class: 'navigation', 'aria-label': 'Navegació principal' });
  const navUl = contentOf(roles.nav).find((n) => n.tagName === 'UL');
  if (navUl) {
    decorateNav(navUl);
    navigation.append(navUl);
  }
  const search = buildSearch(roles.search);

  banner.append(headingLeft, headingRight, navigation, search.container);

  /* mobile drawer */
  const setMenu = (open) => {
    banner.classList.toggle('opened-menu', open);
    hamburger.setAttribute('aria-expanded', String(open));
  };
  hamburger.addEventListener('click', () => setMenu(!banner.classList.contains('opened-menu')));
  closeMenu.addEventListener('click', () => {
    setMenu(false);
    hamburger.focus();
  });
  isMobile.addEventListener('change', () => setMenu(false));

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (modalApi && !modalApi.modal.hidden) {
      modalApi.closeModal();
      return;
    }
    langs.close();
    if (search.isOpen()) {
      search.close();
      banner.querySelector('.search-launcher').focus();
    }
    banner.querySelectorAll('.child-menu > li.open').forEach((li) => {
      li.classList.remove('open');
      li.querySelector(':scope > a')?.setAttribute('aria-expanded', 'false');
    });
    if (banner.classList.contains('opened-menu')) {
      setMenu(false);
      hamburger.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!langs.box.contains(e.target)) langs.close();
  });

  block.textContent = '';
  block.append(banner);
}
