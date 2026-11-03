/**
 * product-body — the rich-text body of a product page (reconstructive: one row = one unit).
 *
 * Row shapes (classified by content, never by index):
 *   [text]                      plain unit (paragraphs, lists — lists get the yellow bullet)
 *   [picture only]              separator / centred image
 *   [CTA paragraph only]        centred call to action
 *   [heading text] [body text]  two columns (head centred, body left)
 *   [style] [content…]          a style row; style is a keyword cell:
 *                                 lead          22px lede paragraph(s)
 *                                 lead center   centred 22px statement
 *                                 center        centred unit
 *                                 boxes         each further cell is a grey box (prices, plans)
 *   Sibling variants of the program template (each a keyword, additive):
 *                                 title [blue|big]  centred 30px light band title
 *                                 inset [inset2]  unit padded 20px / 40px (source .box.p-20)
 *                                 split         equal columns, no head styling
 *                                 products      circular product cards (img, h3, CTA)
 *                                 feature       grey "why us" row: [head + arrow] [text]
 *                                 cards         photo-topped grey cards
 *                                 dashed        dashed green impact boxes (3 per row)
 *                                 rates         rounded grey rate row (2/5/5 columns)
 *                                 note          grey note box
 *                                 plain         unstyled source list (disc, no spacing)
 *                                 notice        [icon + statement] [white card]
 *                                 criteria      bordered boxes of icon lines (ok / ko)
 *                                 coverage      white icon cards (3 per row)
 *                                 prices        light-blue price band: boxes + call-out
 *                                 band          blue band: [icon] [statement]
 *                                 fold [open]   accordion item: [title] [content]; following
 *                                               `table` rows belong to its panel
 *                                 faq           collapsed question cards (2 per row)
 *                                 tab           tab: [label] [panel content]
 *                                 table [head]  one data-table row per row (first = header;
 *                                               `head` starts a new table)
 *                                 sub           the unit belongs to the fold above it
 *                                 accent, size-13|18|20   colour / type size of the unit
 *                                 gap-N / after-N        the source's spacer run above / below
 *                                               the unit, in px (empty paragraphs, portlet
 *                                               margins — never authored as empty text)
 *
 * @ew-exempt style keyword cells are configuration, kept hidden
 */

const STYLE_WORDS = [
  'lead', 'center', 'boxes', 'title', 'blue', 'inset', 'split', 'products', 'feature', 'cards',
  'dashed', 'rates', 'note', 'notice', 'criteria', 'coverage', 'prices', 'band', 'fold', 'open',
  'faq', 'tab', 'table', 'head', 'sub', 'accent', 'size-13', 'size-18', 'size-20', 'big', 'plain', 'inset2',
];

const GRID_WORDS = [
  'boxes', 'products', 'cards', 'dashed', 'rates', 'criteria', 'coverage', 'prices', 'split',
  'notice', 'band',
];

const BLOCK_TAGS = [
  'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'DIV', 'TABLE', 'BLOCKQUOTE', 'PRE',
];

let instance = 0;

/* the pipeline unwraps a single-paragraph cell; restore the <p> the author wrote (EW1 move) */
function ensureParagraph(cell) {
  const nodes = [...cell.childNodes];
  if (nodes.some((n) => BLOCK_TAGS.includes(n.nodeName))) return;
  if (!nodes.some((n) => n.nodeType === 1 || n.textContent.trim())) return;
  const p = document.createElement('p');
  p.append(...nodes);
  cell.append(p);
}

function styleWords(cell) {
  if (!cell || cell.querySelector('picture, img, a, ul, ol, h1, h2, h3, h4, h5, h6')) return null;
  const words = cell.textContent.trim().toLowerCase().split(/\s+/);
  const ok = (w) => STYLE_WORDS.includes(w) || /^(gap|after)-\d{1,3}$/.test(w);
  if (!words.length || !words.every(ok)) return null;
  return words;
}

function isCtaOnly(cell) {
  const ps = cell.querySelectorAll('p');
  const as = cell.querySelectorAll('a[href]');
  if (ps.length !== 1 || as.length !== 1) return false;
  const a = as[0];
  if (cell.textContent.trim() !== a.textContent.trim()) return false;
  return a.classList.contains('button') || Boolean(a.closest('strong, em'));
}

function isPictureOnly(cell) {
  return Boolean(cell.querySelector('picture, img')) && cell.textContent.trim() === '';
}

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

/* products: [picture] [title] [CTA]. The title is authored as a paragraph link so its line
   break survives the pipeline (a heading drops <br>); it is set as the card's h3 (nodes moved) */
function decorateProduct(cell) {
  cell.querySelectorAll(':scope > p').forEach((p) => {
    if (p.querySelector('picture, img') && p.textContent.trim() === '') {
      p.classList.add('product-body-product-image');
      return;
    }
    if (p.querySelector('strong, em, .button') || !p.textContent.trim()) return;
    const h3 = el('h3');
    h3.append(...p.childNodes);
    p.replaceWith(h3);
  });
}

/* table: consecutive table rows become one <table> (nodes moved, never rebuilt) */
function buildTable(rows) {
  const table = el('table', 'product-body-table');
  const thead = el('thead');
  const tbody = el('tbody');
  rows.forEach((row, i) => {
    const tr = el('tr');
    const head = i === 0 || row.classList.contains('product-body-head');
    [...row.children].forEach((cell, j) => {
      if (cell.classList.contains('product-body-style')) return;
      const td = el(head || j === 0 ? 'th' : 'td');
      if (j === 0 && !head) td.setAttribute('scope', 'row');
      td.append(...cell.childNodes);
      if (td.children.length === 1 && td.firstElementChild.tagName === 'P') {
        td.firstElementChild.replaceWith(...td.firstElementChild.childNodes);
      }
      tr.append(td);
    });
    (i === 0 ? thead : tbody).append(tr);
  });
  table.append(thead, tbody);
  return table;
}

function wireToggle(button, panel, open) {
  button.setAttribute('aria-expanded', String(open));
  panel.hidden = !open;
  button.addEventListener('click', () => {
    const next = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(next));
    panel.hidden = !next;
    button.closest('.product-body-unit').classList.toggle('is-open', next);
  });
}

/* fold / faq: [title] [content] → button + collapsible panel */
function buildFold(row, cells, open) {
  instance += 1;
  const id = `product-body-fold-${instance}`;
  const [titleCell, ...rest] = cells;
  const button = el('button', 'product-body-fold-button');
  button.type = 'button';
  button.setAttribute('aria-controls', id);
  const label = el('span', 'product-body-fold-label');
  label.append(...titleCell.childNodes);
  button.append(label);
  titleCell.append(button);
  titleCell.classList.add('product-body-fold-title');
  const panel = el('div', 'product-body-fold-panel');
  panel.id = id;
  rest.forEach((c) => panel.append(...c.childNodes));
  rest.forEach((c) => c.remove());
  row.append(panel);
  if (open) row.classList.add('is-open');
  wireToggle(button, panel, open);
  return panel;
}

/* tab rows: consecutive rows become one tab strip + panels */
function buildTabs(block, rows) {
  instance += 1;
  const prefix = `product-body-tab-${instance}`;
  const unit = el('div', 'product-body-unit product-body-tabs');
  const nav = el('div', 'product-body-tabs-nav');
  nav.setAttribute('role', 'tablist');
  const tabs = [];
  const panels = [];
  rows[0].before(unit);
  const titles = [];
  rows.forEach((row, i) => {
    const cells = [...row.children].filter((c) => !c.classList.contains('product-body-style'));
    const [labelCell, ...rest] = cells;
    const button = el('button', 'product-body-tabs-tab');
    button.type = 'button';
    button.id = `${prefix}-${i}-tab`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `${prefix}-${i}`);
    if (labelCell) {
      const p = labelCell.querySelector('p');
      button.append(...(p || labelCell).childNodes);
    }
    nav.append(button);
    const panel = el('div', 'product-body-tabs-panel');
    panel.id = `${prefix}-${i}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', button.id);
    const inner = el('div', 'product-body-tabs-inner');
    rest.forEach((c) => inner.append(...c.childNodes));
    panel.append(inner);
    /* < 768px the strip becomes an accordion (source r-tabs): a presentational title per
       panel repeats the tab label (EW4 clone — the authored label lives in the strip) */
    const title = el('button', 'product-body-tabs-title');
    title.type = 'button';
    title.setAttribute('aria-controls', panel.id);
    title.append(...[...button.childNodes].map((n) => n.cloneNode(true)));
    title.querySelectorAll('[data-prose-index]').forEach((n) => n.removeAttribute('data-prose-index'));
    tabs.push(button);
    panels.push(panel);
    titles.push(title);
    row.replaceWith(panel);
  });
  unit.append(nav);
  panels.forEach((panel, i) => unit.append(titles[i], panel));
  const activate = (index) => {
    tabs.forEach((t, j) => {
      const on = j === index;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panels[j].hidden = !on;
      titles[j].classList.toggle('is-open', on);
      titles[j].setAttribute('aria-expanded', String(on));
    });
  };
  titles.forEach((title, i) => title.addEventListener('click', () => {
    if (title.classList.contains('is-open')) {
      panels[i].hidden = true;
      title.classList.remove('is-open');
      title.setAttribute('aria-expanded', 'false');
    } else activate(i);
  }));
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activate(i));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const next = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
      tabs[next].focus();
      activate(next);
    });
  });
  activate(0);
  if (window.matchMedia('(width <= 767px)').matches) {
    panels[0].hidden = true;
    titles[0].classList.remove('is-open');
    titles[0].setAttribute('aria-expanded', 'false');
  }
  return block;
}

/* alerts: each cell = [title p] + a bordered box (nodes moved). In the box a paragraph broken
   by <br> is a label line (segments become spans), a list is the risk scale (strong = active) */
function decorateAlert(cell) {
  const [title, ...rest] = [...cell.children];
  if (!title) return;
  title.classList.add('product-body-alert-title');
  const box = el('div', 'product-body-alert-box');
  box.append(...rest);
  cell.append(box);
  box.querySelectorAll(':scope > ul').forEach((ul) => ul.classList.add('product-body-risk-scale'));
  box.querySelectorAll(':scope > p').forEach((p) => {
    if (!p.querySelector(':scope > br')) return;
    p.classList.add('product-body-alert-line');
    let span = el('span');
    [...p.childNodes].forEach((node) => {
      if (node.nodeName === 'BR') {
        node.replaceWith(span);
        span = el('span');
      } else {
        span.append(node);
      }
    });
    p.append(span);
  });
}

export default function decorate(block) {
  if (block.querySelector(':scope > .product-body-unit')) return;
  const tableRuns = [];
  const tabRuns = [];
  const subRows = [];
  let lastFoldPanel = null;
  [...block.children].forEach((row) => {
    row.classList.add('product-body-unit');
    const cells = [...row.children];
    cells.forEach(ensureParagraph);
    const words = cells.length > 1 ? styleWords(cells[0]) : null;
    let content = cells;
    if (words) {
      cells[0].classList.add('product-body-style');
      cells[0].setAttribute('aria-hidden', 'true');
      content = cells.slice(1);
      words.forEach((w) => {
        const space = w.match(/^(gap|after)-(\d+)$/);
        if (!space) row.classList.add(`product-body-${w}`);
        else row.style[space[1] === 'gap' ? 'marginTop' : 'marginBottom'] = `${space[2]}px`;
      });
    }
    const has = (w) => Boolean(words && words.includes(w));

    if (has('table')) {
      const run = tableRuns[tableRuns.length - 1];
      const joins = run && !has('head') && run.rows[run.rows.length - 1].nextElementSibling === row;
      if (joins) run.rows.push(row);
      else tableRuns.push({ rows: [row], panel: has('sub') ? lastFoldPanel : null });
      return;
    }
    if (has('sub') && lastFoldPanel) subRows.push({ row, panel: lastFoldPanel });
    else lastFoldPanel = null;
    if (has('tab')) {
      const run = tabRuns[tabRuns.length - 1];
      if (run && run[run.length - 1].nextElementSibling === row) run.push(row);
      else tabRuns.push([row]);
      return;
    }
    if (has('fold') || has('faq')) {
      lastFoldPanel = buildFold(row, content, has('open'));
      return;
    }

    if (words && GRID_WORDS.some((w) => has(w))) {
      row.classList.add('product-body-grid');
      content.forEach((cell) => cell.classList.add('product-body-cell'));
      if (has('boxes')) content.forEach((cell) => cell.classList.add('product-body-box'));
      if (has('products')) content.forEach(decorateProduct);
      return;
    }

    if (content.length > 1) {
      row.classList.add('product-body-cols');
      content.forEach((cell, i) => {
        cell.classList.add(i === 0 ? 'product-body-col-head' : 'product-body-col');
      });
      return;
    }

    const [cell] = content;
    if (!cell) return;
    cell.classList.add('product-body-text');
    if (isPictureOnly(cell)) row.classList.add('product-body-image');
    else if (isCtaOnly(cell)) row.classList.add('product-body-cta');
  });

  tableRuns.forEach(({ rows, panel }) => {
    const wrap = el('div', 'product-body-unit product-body-table-wrap');
    rows[0].before(wrap);
    wrap.append(buildTable(rows));
    rows.forEach((r) => r.remove());
    if (panel) panel.append(wrap);
  });
  tabRuns.forEach((rows) => buildTabs(block, rows));
  subRows.forEach(({ row, panel }) => panel.append(row));

  /* faq cards: consecutive questions share one two-column grid */
  let faqs = null;
  [...block.children].forEach((row) => {
    if (!row.classList.contains('product-body-faq')) {
      faqs = null;
      return;
    }
    if (!faqs) {
      faqs = el('div', 'product-body-unit product-body-faqs');
      row.before(faqs);
    }
    faqs.append(row);
  });

  if (block.classList.contains('alerts')) {
    block.querySelectorAll('.product-body-cell').forEach(decorateAlert);
  }
}
