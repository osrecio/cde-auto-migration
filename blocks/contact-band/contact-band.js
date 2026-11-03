/**
 * contact-band — grey contact band: centred title + intro, then one column per
 * contact channel (icon, lead line with link, optional notes).
 *
 * Authoring rows (classified by content, not position):
 *   - rows without an image: head text — the first paragraph is the title, the rest the intro
 *   - rows with an image: a channel — the image, then the lead paragraph, then notes
 *
 * Decode tier: template-slotted head + reconstructive channel group.
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function wrapAll(nodes, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(...nodes);
  return w;
}

function spacer() {
  const s = document.createElement('div');
  s.className = 'contact-spacer';
  s.setAttribute('aria-hidden', 'true');
  s.textContent = '\u00a0';
  return s;
}

// Paragraph-level children of a cell; a bare-text cell (single paragraph unwrapped by the
// pipeline) is wrapped in a <p> so the styles apply (the nodes move, nothing is rebuilt).
function cellParts(cell) {
  const parts = [...cell.querySelectorAll(':scope > :is(p, ul, ol, h2, h3, h4, h5, h6, picture)')];
  if (parts.length || !cell.textContent.trim()) return parts;
  const p = document.createElement('p');
  while (cell.firstChild) p.append(cell.firstChild);
  return [p];
}

export default function decorate(block) {
  if (block.querySelector(':scope > .contact-inner')) return;
  const head = [];
  const channels = [];
  [...block.children].forEach((row) => {
    const parts = [...row.children].flatMap((cell) => cellParts(cell));
    if (row.querySelector('picture, img')) channels.push(parts);
    else head.push(...parts);
  });

  const inner = document.createElement('div');
  inner.className = 'contact-inner';
  inner.setAttribute('role', 'region');
  if (head.length) {
    inner.append(wrapNode(head[0], 'contact-title'));
    if (head.length > 1) inner.append(wrapAll(head.slice(1), 'contact-intro'));
    const label = head[0].textContent.trim();
    if (label) inner.setAttribute('aria-label', label);
  } else {
    inner.removeAttribute('role');
  }

  if (channels.length) {
    const row = document.createElement('div');
    row.className = 'contact-row';
    row.append(spacer());
    channels.forEach((parts) => {
      const media = parts.find((el) => el.querySelector('picture, img') || el.matches('picture'));
      const texts = parts.filter((el) => el !== media);
      const channel = document.createElement('div');
      channel.className = 'contact-channel';
      if (media) channel.append(wrapNode(media, 'channel-media'));
      if (texts.length) channel.append(wrapNode(texts[0], 'channel-lead'));
      if (texts.length > 1) channel.append(wrapAll(texts.slice(1), 'channel-notes'));
      else channel.classList.add('channel-solo');
      row.append(wrapNode(channel, 'contact-col'));
    });
    row.append(spacer());
    inner.append(row);
  }

  block.replaceChildren(inner);
}
