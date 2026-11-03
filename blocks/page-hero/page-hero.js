/**
 * page-hero — full-bleed header band: background picture behind a translucent
 * white text box (h1 + revision date) on the left of the 1148 column.
 *
 * Authoring rows (positional-free, classified by content):
 *   - a row with a picture / image: the background (hidden below 992px, as live)
 *   - a row with the heading and any paragraphs: the text box
 *
 * Decode tier: template-slotted (fixed composition).
 * @ew-exempt slider controls — the live single-slide slider keeps its play/pause controls in
 *   the markup, hidden (#hiyr_-pause/play-slider {display:none}); generated, never authored
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function control(name, label) {
  const a = document.createElement('a');
  a.className = `page-hero-${name}`;
  a.href = '#';
  a.setAttribute('role', 'button');
  a.setAttribute('aria-hidden', 'true');
  a.tabIndex = -1;
  const sr = document.createElement('span');
  sr.className = 'sr-only';
  sr.textContent = label;
  a.append(sr);
  a.addEventListener('click', (e) => e.preventDefault());
  return a;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .page-hero-item')) return;
  const media = block.querySelector('picture') || block.querySelector('img');
  const textNodes = [...block.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol')]
    .filter((el) => !el.querySelector('picture, img'))
    .filter((el) => !el.parentElement.closest('p, ul, ol'));

  const item = document.createElement('div');
  item.className = 'page-hero-item';
  if (media) item.append(wrapNode(media, 'page-hero-media'));

  const box = document.createElement('div');
  box.className = 'page-hero-box';
  const bg = document.createElement('div');
  bg.className = 'page-hero-box-bg';
  const rich = document.createElement('div');
  rich.className = 'page-hero-text';
  textNodes.forEach((el) => rich.append(el));
  box.append(bg, rich);
  item.append(box);

  block.replaceChildren(
    control('play', 'Reproduir Control lliscant'),
    control('pause', 'PausaControl lliscant'),
    item,
  );
}
