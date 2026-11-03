/**
 * segments — "Solucions per a tothom": six segment cards (photo + overlaid label).
 * One row per card (reconstructive, classified by content): a picture cell and a link
 * cell. The picture is wrapped in an anchor to the same href (source: image link + label
 * link); the label paragraph moves into the overlay (EW1 moves only).
 * The section's default content (title + subtitle) is styled from segments.css.
 * @param {Element} block the block element
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .segments-row')) return;
  const grid = document.createElement('div');
  grid.className = 'segments-row';
  [...block.children].forEach((row) => {
    const picture = row.querySelector('picture');
    const link = row.querySelector('a[href]');
    const col = document.createElement('div');
    col.className = 'segments-col';
    const card = document.createElement('div');
    card.className = 'segments-card';
    if (picture) {
      const media = document.createElement(link ? 'a' : 'div');
      media.className = 'segments-media';
      if (link) {
        media.href = link.href;
        media.tabIndex = -1;
      }
      media.append(picture);
      card.append(media);
    }
    const overlay = document.createElement('div');
    overlay.className = 'segments-label';
    [...row.children].forEach((cell) => overlay.append(...cell.children));
    if (overlay.children.length) card.append(overlay);
    row.remove();
    col.append(card);
    grid.append(col);
  });
  block.append(grid);
}
