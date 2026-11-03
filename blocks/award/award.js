/**
 * award — the floating "Primera entitat financera en qualitat de servei" badge (source
 * #stigaflotante / #boton-fijo): a fixed navy card at the bottom right with a close chip.
 * Row: a picture cell (the cup) and a text cell (award line — strong = yellow highlight,
 * em = orange highlight — and the source line). Authored nodes are moved (EW1).
 * @ew-exempt "X" glyph and "Cierra el lightbox" label of the generated close control
 * @param {Element} block the block element
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .award-card')) return;
  const card = document.createElement('div');
  card.className = 'award-card';
  const cup = document.createElement('div');
  cup.className = 'award-cup';
  const text = document.createElement('div');
  text.className = 'award-text';
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      const pic = cell.querySelector('picture');
      if (pic && !cell.textContent.trim() && !cup.children.length) cup.append(pic);
      else text.append(...cell.children);
    });
    row.remove();
  });
  if (cup.children.length) card.append(cup);
  card.append(text);

  const closeP = document.createElement('p');
  const close = document.createElement('a');
  close.className = 'award-close';
  close.href = '#';
  close.setAttribute('role', 'button');
  close.setAttribute('aria-label', 'Cierra el lightbox');
  close.textContent = 'X';
  closeP.append(close);
  close.addEventListener('click', (e) => {
    e.preventDefault();
    block.classList.add('award-closed');
  });
  block.append(card, closeP);
}
