/**
 * accessibility-tabs — responsive tabs (live responsiveTabs): a tab strip >= 768px,
 * a collapsible accordion below (starts collapsed, as live).
 *
 * Authoring rows: one row per tab — cell 1 the tab label, cell 2 the panel content
 * (paragraphs, lists, links). A row without a second cell becomes a tab with an empty panel.
 *
 * Decode tier: reconstructive (repeat group, one row = one tab).
 * The accordion title carries a presentational clone of the label (EW4); the authored
 * label lives in the tab strip.
 * @ew-exempt "(Seleccionat)" — generated screen-reader state text, not authored
 */

const MOBILE = window.matchMedia('(width <= 767px)');
let instance = 0;

function stripInstrumentation(el) {
  el.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  el.removeAttribute('data-prose-index');
  return el;
}

function moveChildren(from, to) {
  while (from.firstChild) to.append(from.firstChild);
  return to;
}

// A single-paragraph cell arrives unwrapped from the pipeline: wrap its inline nodes in a <p>
// so the panel typography applies (the nodes move; nothing is rebuilt).
function moveContent(from, to) {
  const blockLevel = from.querySelector(':scope > :is(p, ul, ol, h2, h3, h4, h5, h6, div, picture)');
  if (blockLevel || !from.textContent.trim()) return moveChildren(from, to);
  to.append(moveChildren(from, document.createElement('p')));
  return to;
}

function makeAnchor(href) {
  const a = document.createElement('a');
  a.className = 'tabs-anchor';
  a.href = href;
  return a;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .tabs-nav')) return;
  const rows = [...block.children].filter((row) => row.children.length);
  if (!rows.length) return;
  instance += 1;
  const prefix = `accessibility-tab-${instance}`;

  const nav = document.createElement('ul');
  nav.className = 'tabs-nav';
  nav.setAttribute('role', 'tablist');
  const tabs = [];
  const titles = [];
  const panels = [];
  const parts = [];

  rows.forEach((row, i) => {
    const [labelCell, contentCell] = row.children;
    const id = `${prefix}-${i + 1}`;

    const li = document.createElement('li');
    li.className = 'tabs-tab';
    li.id = `${id}-tab`;
    li.setAttribute('role', 'tab');
    const anchor = makeAnchor(`#${id}`);
    const label = moveChildren(labelCell, document.createElement('span'));
    label.className = 'tabs-label';
    const sel = document.createElement('span');
    sel.className = 'tabs-sel sr-only';
    anchor.append(label, ' ', sel);
    li.append(anchor);
    nav.append(li);

    const title = document.createElement('div');
    title.className = 'tabs-title';
    const titleAnchor = makeAnchor(`#${id}`);
    const titleLabel = stripInstrumentation(label.cloneNode(true));
    titleAnchor.append(titleLabel);
    title.append(titleAnchor);

    const panel = document.createElement('div');
    panel.className = 'tabs-panel';
    panel.id = id;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', li.id);
    const content = document.createElement('div');
    content.className = 'tabs-content';
    const text = document.createElement('div');
    if (contentCell) moveContent(contentCell, text);
    text.className = 'tabs-text';
    content.append(text);
    panel.append(content);

    tabs.push(li);
    titles.push(title);
    panels.push(panel);
    parts.push(title, panel);
  });

  const activate = (index, announce = true) => {
    tabs.forEach((li, j) => {
      const on = j === index;
      li.classList.toggle('is-active', on);
      panels[j].classList.toggle('is-active', on);
      titles[j].classList.toggle('is-active', on);
      li.setAttribute('aria-selected', String(on && announce));
      li.querySelector('.tabs-anchor').tabIndex = on ? 0 : -1;
      li.querySelector('.tabs-sel').textContent = on && announce ? '(Seleccionat)' : '';
    });
  };

  const toggle = (index) => {
    const open = !panels[index].classList.contains('is-open');
    panels.forEach((p, j) => {
      p.classList.toggle('is-open', open && j === index);
      titles[j].classList.toggle('is-open', open && j === index);
    });
    activate(index);
  };

  tabs.forEach((li, i) => {
    const a = li.querySelector('.tabs-anchor');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      activate(i);
    });
    a.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const step = e.key === 'ArrowRight' ? 1 : tabs.length - 1;
      const next = (i + step) % tabs.length;
      tabs[next].querySelector('.tabs-anchor').focus();
    });
  });
  titles.forEach((title, i) => {
    title.querySelector('.tabs-anchor').addEventListener('click', (e) => {
      e.preventDefault();
      toggle(i);
    });
  });

  block.replaceChildren(nav, ...parts);
  // < 768px the accordion starts collapsed: no tab announces "(Seleccionat)" until opened
  activate(0, !MOBILE.matches);
}
