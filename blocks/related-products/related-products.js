/**
 * related-products — "Productes relacionats" band (reconstructive).
 * Rows: an optional heading-only row (the band title), then one row per card:
 *   [icon picture] [p > a (category label + target), h3 (<em> light top line,
 *   <strong> big bottom line)]
 * The card becomes the link (EW6: the inner anchor is unwrapped after its href is read).
 * Odd cards paint orange, even cards blue (source .recommended-products).
 */

const LONG_NAME = 10;

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

function buildCard(row) {
  const card = document.createElement('a');
  card.className = 'related-products-card';
  const sub = document.createElement('div');
  sub.className = 'related-products-sub';
  const icon = document.createElement('div');
  icon.className = 'related-products-icon';
  const name = document.createElement('div');
  name.className = 'related-products-name';
  const rest = document.createElement('div');
  rest.className = 'related-products-more';

  let href = '';
  [...row.children].forEach((cell) => {
    ensureParagraph(cell);
    [...cell.children].forEach((node) => {
      const isPicture = node.querySelector('picture, img') && node.textContent.trim() === '';
      if (isPicture || node.matches('picture, img')) {
        icon.append(node);
      } else if (/^H[1-6]$/.test(node.tagName)) {
        name.append(node);
      } else if (!href && node.querySelector('a[href]')) {
        const a = node.querySelector('a[href]');
        href = a.href;
        a.replaceWith(...a.childNodes);
        sub.append(node);
      } else {
        rest.append(node);
      }
    });
  });

  const bottom = name.querySelector('strong');
  if (bottom && bottom.textContent.trim().length > LONG_NAME) {
    card.classList.add('related-products-long');
  }

  if (href) card.href = href;
  card.append(sub, icon, name);
  if (rest.children.length) card.append(rest);
  return card;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .related-products-grid')) return;
  const head = document.createElement('div');
  head.className = 'related-products-head';
  const grid = document.createElement('div');
  grid.className = 'related-products-grid';

  [...block.children].forEach((row) => {
    const onlyHeading = !row.querySelector('picture, img, a[href]')
      && row.querySelector('h1, h2, h3, h4, h5, h6');
    if (onlyHeading && !grid.children.length) {
      [...row.children].forEach((cell) => head.append(...cell.children));
    } else {
      grid.append(buildCard(row));
    }
  });

  block.replaceChildren(...(head.children.length ? [head, grid] : [grid]));
}
