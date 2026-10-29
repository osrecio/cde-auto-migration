import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Footer — caixaenginyers.com #footer, decorated from the authored /footer document.
 * Sections (identified by content): link columns (h3 + ul pairs) · legal links ·
 * contact (title, links, phone CTA) · social (title, network links) · mobile legal
 * links · app CTA + copyright. Authored nodes are MOVED, never rebuilt (EW1).
 */

const NETWORKS = [
  [/facebook\./, 'facebook'],
  [/instagram\./, 'instagram'],
  [/twitter\.|x\.com/, 'twitter-x'],
  [/linkedin\./, 'linkedin'],
  [/youtube\./, 'youtube'],
  [/blog\./, 'blog'],
];

function el(tag, className, ...children) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...children);
  return node;
}

function contentOf(section) {
  if (!section) return [];
  const wrapper = section.querySelector('.default-content-wrapper') || section;
  return [...wrapper.children];
}

function sectionRoles(fragment) {
  const roles = { lists: [] };
  [...fragment.querySelectorAll(':scope > .section')].forEach((section) => {
    const has = (sel) => section.querySelector(sel);
    if (!roles.cols && has('h3')) roles.cols = section;
    else if (!roles.contact && has('a[href^="tel:"]')) roles.contact = section;
    else if (!roles.social && has('a[href*="facebook."], a[href*="instagram."]')) {
      roles.social = section;
    } else if (!has('ul')) roles.app = section;
    else roles.lists.push(section);
  });
  [roles.legal, roles.legalMobile] = roles.lists;
  return roles;
}

function buildLegal(section) {
  const bottom = el('div', 'footer-left-bottom');
  contentOf(section).forEach((n) => {
    if (n.tagName === 'P') n.classList.add('sr-only');
    bottom.append(n);
  });
  return bottom;
}

function buildColumns(section) {
  const top = el('div', 'footer-left-top');
  const cols = el('div', 'footer-cols');
  let col = null;
  contentOf(section).forEach((n) => {
    if (n.tagName === 'H2') {
      n.classList.add('hide-accessible');
      top.append(n);
    } else if (n.tagName === 'H3') {
      col = el('div', 'footer-col', n);
      cols.append(col);
    } else {
      if (!col) {
        col = el('div', 'footer-col');
        cols.append(col);
      }
      col.append(n);
    }
  });
  top.append(cols);
  return top;
}

function buildContact(section) {
  const box = el('div', 'contact-block');
  contentOf(section).forEach((n) => {
    const tel = n.querySelector('a[href^="tel:"]');
    if (tel) {
      n.classList.add('call');
      const icon = document.createElement('img');
      icon.src = `${window.hlx.codeBasePath}/blocks/footer/icons/ico-phone-25x25.png`;
      icon.alt = '';
      icon.width = 25;
      icon.height = 25;
      icon.className = 'call-icon';
      tel.prepend(icon);
    } else if (n.tagName === 'P') n.classList.add('title');
    box.append(n);
  });
  box.querySelectorAll('ul a').forEach((a) => {
    a.closest('li').classList.add(/oficin/.test(a.href) ? 'offices' : 'contact');
  });
  return box;
}

function buildSocial(section) {
  const box = el('div', 'social-block');
  contentOf(section).forEach((n) => {
    if (n.tagName === 'UL') n.classList.add('social-networks');
    else if (n.tagName === 'P') n.classList.add('title');
    box.append(n);
  });
  box.querySelectorAll('.social-networks li').forEach((li) => {
    const a = li.querySelector('a');
    if (!a) return;
    const net = NETWORKS.find(([re]) => re.test(a.href));
    if (!net) return;
    li.classList.add(net[1]);
    if (net[1] !== 'blog') {
      // icon-only link (live: aria-label + glyph): the authored label stays in the DOM,
      // visually hidden, and names the link
      const label = a.textContent.trim();
      a.setAttribute('aria-label', label);
      a.title = label;
      const span = el('span', 'social-label', ...a.childNodes);
      a.append(span);
    }
  });
  return box;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;
  fragment.querySelectorAll('li > p').forEach((p) => p.replaceWith(...p.childNodes));
  // inline lists (legal line, social row): inter-item whitespace would add a space glyph
  fragment.querySelectorAll('ul, li, picture').forEach((node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) n.remove();
    });
  });
  const roles = sectionRoles(fragment);

  const left = el('div', 'footer-left');
  if (roles.cols) left.append(buildColumns(roles.cols));
  left.append(buildLegal(roles.legal));

  const contactFooter = el('div', 'contact-footer');
  const info = el('div', 'contact-info');
  if (roles.contact) info.append(buildContact(roles.contact));
  if (roles.social) info.append(buildSocial(roles.social));
  contactFooter.append(info);
  const legalMobile = el('div', 'legal-mobile');
  contentOf(roles.legalMobile).forEach((n) => legalMobile.append(n));
  contactFooter.append(legalMobile);

  const right = el('div', 'footer-right', contactFooter);
  const appNodes = contentOf(roles.app);
  appNodes.forEach((n) => {
    if (/©/.test(n.textContent)) {
      n.classList.add('copyright');
      right.append(n);
    } else {
      n.classList.add('app-cta');
      contactFooter.append(n);
    }
  });

  const root = el('div', 'footer-inner', left, right);
  block.textContent = '';
  block.append(root);
}
