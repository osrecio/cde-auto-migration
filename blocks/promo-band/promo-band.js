/**
 * promo-band — "Vols més avantatges?" (source .ce-ingenium): a 350px band whose
 * background image sits centred at its natural size; the copy (title, text, CTA) takes
 * the right half of the 1148 column (<768: a translucent navy box over the image).
 * Rows (template-slotted, by content): a picture-only row = the background; every other
 * row's paragraphs = the copy (EW1 moves only).
 * @param {Element} block the block element
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .promo-band-inner')) return;
  const media = document.createElement('div');
  media.className = 'promo-band-media';
  const inner = document.createElement('div');
  inner.className = 'promo-band-inner';
  const spacer = document.createElement('div');
  spacer.className = 'promo-band-spacer';
  const copy = document.createElement('div');
  copy.className = 'promo-band-copy';
  [...block.children].forEach((row) => {
    const pic = row.querySelector('picture');
    if (pic && !row.textContent.trim() && !media.children.length) {
      media.append(pic);
    } else {
      [...row.children].forEach((cell) => copy.append(...cell.children));
    }
    row.remove();
  });
  // the pipeline trims the space after a <br>; restore it for the breakpoint that hides it
  copy.querySelectorAll('br').forEach((br) => {
    const next = br.nextSibling;
    if (next && !(next.nodeType === 3 && /^\s/.test(next.textContent))) {
      br.after(document.createTextNode(' '));
    }
  });
  inner.append(spacer, copy);
  if (media.children.length) block.append(media);
  block.append(inner);
}
