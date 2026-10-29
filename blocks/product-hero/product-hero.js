/**
 * product-hero — product page hero (template-slotted).
 * Rows: [picture] (the photo, optional) and [h1 + text + CTA paragraphs].
 * The photo fills a 500px band; the text sits on a 70% white panel over the
 * left half of the 1148 column. Below 992px the photo is hidden and the panel
 * restacks, as on the source.
 */

const BLOCK_TAGS = [
  'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'DIV', 'TABLE', 'BLOCKQUOTE', 'PRE',
];

/* the pipeline unwraps a single-paragraph cell; restore the <p> the author wrote (EW1 move) */
function ensureParagraph(cell) {
  const nodes = [...cell.childNodes];
  if (nodes.some((n) => BLOCK_TAGS.includes(n.nodeName))) return;
  if (!nodes.some((n) => n.nodeType === 1 || n.textContent.trim())) return;
  const p = document.createElement('p');
  p.append(...nodes);
  cell.append(p);
}

function isCta(p) {
  if (p.classList.contains('button-wrapper')) return true;
  const a = p.querySelector('a[href]');
  if (!a || p.querySelectorAll('a').length !== 1) return false;
  if (p.textContent.trim() !== a.textContent.trim()) return false;
  return Boolean(a.closest('strong, em'));
}

/* risk indicator (source: a bordered table cell "1/6" + its legend): the figure paragraph
   and the legend after it move into one box; the line before it is the box caption */
function groupRisk(text) {
  const figure = [...text.querySelectorAll(':scope > p')]
    .find((p) => /^\d+\s*\/\s*\d+$/.test(p.textContent.trim()));
  if (!figure) return;
  const box = document.createElement('div');
  box.className = 'product-hero-risk';
  const legend = figure.nextElementSibling;
  const caption = figure.previousElementSibling;
  if (caption && caption.tagName === 'P') caption.classList.add('product-hero-caption');
  figure.classList.add('product-hero-risk-figure');
  figure.before(box);
  box.append(figure);
  if (legend && legend.tagName === 'P') box.append(legend);
}

const OPTIONS = ['light'];
const TIMEOUT = 5000;
const FADE = 1000;

function isOptionsCell(cell) {
  if (cell.querySelector('picture, img, a, h1, h2, h3, h4, h5, h6')) return false;
  const words = cell.textContent.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return words.length > 0 && words.every((w) => OPTIONS.includes(w));
}

function isPictureCell(cell) {
  return Boolean(cell.querySelector('picture, img'))
    && !cell.querySelector('h1, h2, h3, h4, h5, h6')
    && cell.textContent.trim() === '';
}

/* one slide: [picture] (optional) + [h1 + text + CTA paragraphs] (+ optional keyword cell) */
function buildItem(cells) {
  const item = document.createElement('div');
  item.className = 'product-hero-item';
  const media = document.createElement('div');
  media.className = 'product-hero-media';
  const panel = document.createElement('div');
  panel.className = 'product-hero-panel';
  const bg = document.createElement('div');
  bg.className = 'product-hero-bg';
  const text = document.createElement('div');
  text.className = 'product-hero-text';
  const ctas = document.createElement('div');
  ctas.className = 'product-hero-ctas';
  panel.append(bg, text);
  item.append(media, panel);

  cells.forEach((cell) => {
    if (isOptionsCell(cell)) {
      cell.textContent.trim().toLowerCase().split(/\s+/)
        .forEach((w) => item.classList.add(`product-hero-${w}`));
      cell.className = 'product-hero-options';
      cell.setAttribute('aria-hidden', 'true');
      item.append(cell);
      return;
    }
    const pictureOnly = isPictureCell(cell);
    [...cell.children].forEach((node) => {
      if (pictureOnly) {
        media.append(node);
      } else if (node.tagName === 'P' && isCta(node)) {
        ctas.append(node);
      } else {
        if (ctas.children.length) node.dataset.afterCta = 'true';
        text.append(node);
      }
    });
  });

  if (ctas.children.length) {
    // the CTA row sits where the first CTA was authored (text after it stays below)
    const after = [...text.children].find((n) => n.dataset.afterCta);
    if (after) after.before(ctas);
    else text.append(ctas);
    text.querySelectorAll('[data-after-cta]').forEach((n) => delete n.dataset.afterCta);
  }
  groupRisk(text);
  return item;
}

function control(cls, label, hidden) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = cls;
  btn.hidden = hidden;
  btn.setAttribute('aria-label', label);
  const glyph = document.createElement('span');
  glyph.className = 'product-hero-glyph';
  glyph.setAttribute('aria-hidden', 'true');
  btn.append(glyph);
  return btn;
}

/* several slides (source Owl slider: items 1, autoplay 5000 ms, rewind, fadeOut, autoHeight,
   dots + pause/play): only the active slide is shown */
function rotate(block, items) {
  const stage = document.createElement('div');
  stage.className = 'product-hero-stage';
  stage.setAttribute('aria-live', 'off');
  stage.append(...items);
  const dots = document.createElement('div');
  dots.className = 'product-hero-dots';
  const dotButtons = items.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'product-hero-dot';
    dot.setAttribute('aria-label', `Ves A Control lliscant ${i + 1}`);
    dot.append(document.createElement('span'));
    dots.append(dot);
    return dot;
  });
  const pause = control('product-hero-pause', 'Pausa Control lliscant', false);
  const play = control('product-hero-resume', 'Reproduir Control lliscant', true);
  block.classList.add('product-hero-carousel');
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.setAttribute('aria-label', 'Carrousel');
  block.replaceChildren(stage, dots, play, pause);

  let current = 0;
  let timer = null;
  const show = (n) => {
    const next = (n + items.length) % items.length;
    const prev = items[current];
    if (prev !== items[next] && prev.classList.contains('active')) {
      prev.classList.remove('active');
      prev.classList.add('fading-out');
      prev.setAttribute('aria-hidden', 'true');
      setTimeout(() => prev.classList.remove('fading-out'), FADE);
    }
    current = next;
    items[current].classList.add('active');
    items[current].removeAttribute('aria-hidden');
    dotButtons.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-current', String(i === current));
    });
  };
  const stop = () => {
    clearInterval(timer);
    timer = null;
  };
  const start = () => {
    stop();
    if (block.classList.contains('paused')) return;
    timer = setInterval(() => show(current + 1), TIMEOUT);
  };
  items.forEach((it) => it.setAttribute('aria-hidden', 'true'));
  show(0);
  dotButtons.forEach((dot, i) => dot.addEventListener('click', () => {
    show(i);
    start();
  }));
  pause.addEventListener('click', () => {
    block.classList.add('paused');
    pause.hidden = true;
    play.hidden = false;
    stop();
    play.focus();
  });
  play.addEventListener('click', () => {
    block.classList.remove('paused');
    play.hidden = true;
    pause.hidden = false;
    start();
    pause.focus();
  });
  start();
}

export default function decorate(block) {
  if (block.querySelector('.product-hero-item')) return;
  /* a picture-only row after content opens a new slide */
  const slides = [];
  let cells = [];
  [...block.children].forEach((row) => {
    const rowCells = [...row.children];
    rowCells.forEach(ensureParagraph);
    if (cells.length && rowCells.length && rowCells.every(isPictureCell)) {
      slides.push(cells);
      cells = [];
    }
    cells.push(...rowCells);
  });
  if (cells.length) slides.push(cells);
  const items = slides.map(buildItem);
  const [item] = items;
  if (!item) return;
  const media = item.querySelector('.product-hero-media');
  if (!media.children.length) block.classList.add('no-image');
  /* dark banner: below 992px the source paints the image as a repeating background
     (natural size, 40% 20%) so it tiles under the taller restacked text */
  const img = media.querySelector('img');
  if (img && block.classList.contains('dark')) {
    const url = new URL(img.getAttribute('src'), window.location.href);
    if (url.searchParams.has('width')) url.searchParams.set('width', '2000');
    item.style.setProperty('--product-hero-tile', `url("${url.href}")`);
  }
  if (items.length > 1) rotate(block, items);
  else block.replaceChildren(item);
}
