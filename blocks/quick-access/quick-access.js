/**
 * quick-access — "Accés ràpid": a centred, horizontally scrolling row of icon links.
 * One row per item (reconstructive, classified by content): a picture cell (the icon)
 * and a link cell (`<p><a>LABEL<br>LINE 2</a></p>`). The icon is moved into the link,
 * above its label, so the whole box is one link (EW1 moves only).
 * @param {Element} block the block element
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .quick-access-row')) return;
  const row = document.createElement('div');
  row.className = 'quick-access-row';
  [...block.children].forEach((r) => {
    const picture = r.querySelector('picture');
    const link = r.querySelector('a[href]');
    const box = document.createElement('div');
    box.className = 'quick-access-item';
    if (link) {
      const p = link.closest('p') || link;
      p.className = '';
      if (picture) link.prepend(picture);
      box.append(p);
    } else {
      while (r.firstElementChild) {
        const cell = r.firstElementChild;
        box.append(...cell.children);
        cell.remove();
      }
    }
    r.remove();
    row.append(box);
  });
  block.append(row);
}
