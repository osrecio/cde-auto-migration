/**
 * product-legal — product small print (12px). One row per paragraph group.
 * Text sits on the 16px body line (22.857px), as the source's `p > span.fs12`;
 * a row whose first cell is the keyword `compact` sets the paragraph itself in
 * 12px (17.143px lines), as the source's `p.fs12`.
 *
 * @ew-exempt the `compact` keyword cell is configuration, kept hidden
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    if (row.classList.contains('product-legal-row')) return;
    row.classList.add('product-legal-row');
    const cells = [...row.children];
    const key = cells.length > 1 ? cells[0].textContent.trim().toLowerCase() : '';
    if (key === 'compact' && !cells[0].querySelector('a, picture, img')) {
      row.classList.add('product-legal-compact');
      cells[0].classList.add('product-legal-style');
      cells[0].setAttribute('aria-hidden', 'true');
    }
  });
}
