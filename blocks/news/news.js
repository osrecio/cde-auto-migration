/**
 * news — "Estigues al dia" (source .ce-news): the news list (2/3) with its "all news"
 * button, and the Focus publications card (1/3). The section's default content (title +
 * subtitle) is styled from news.css.
 *
 * Rows (reconstructive, classified by content — never by position):
 *   picture + heading with a link   the side card (EW6 card-as-link: the heading link's
 *                                   href makes the card anchor, its text nodes are moved
 *                                   back into the heading); its picture = card background;
 *                                   a paragraph holding a picture = the big "Focus" line;
 *                                   the remaining paragraphs = the lines under it
 *   picture + heading               one news item (image | title + date)
 *   link only                       the "all news" button
 * @param {Element} block the block element
 */
function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function contentOf(row) {
  return [...row.children].flatMap((cell) => {
    const kids = [...cell.children];
    if (kids.length || !cell.textContent.trim()) return kids;
    const p = el('p');
    p.append(...cell.childNodes);
    return [p];
  });
}

function buildCard(row, picture, heading) {
  const link = heading.querySelector('a[href]');
  const card = el('a', 'news-card');
  card.href = link.href;
  while (link.firstChild) link.before(link.firstChild);
  link.remove();
  const back = el('div', 'news-card-image');
  back.append(picture);
  const text = el('div', 'news-card-text');
  const head = el('div', 'news-card-head');
  const lines = el('div', 'news-card-lines');
  contentOf(row).forEach((node) => {
    if (node === heading) return;
    if (node.querySelector('picture')) head.append(node);
    else lines.append(node);
  });
  text.append(heading);
  if (head.children.length || lines.children.length) {
    const title = el('div', 'news-card-title');
    title.append(head, lines);
    text.append(title);
  }
  card.append(back, text);
  return card;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .news-row')) return;
  const list = el('ul', 'news-list');
  const more = el('div', 'news-more');
  const side = el('div', 'news-side');

  [...block.children].forEach((row) => {
    const picture = row.querySelector('picture');
    const heading = row.querySelector('h2, h3, h4, h5, h6');
    if (picture && heading && heading.querySelector('a[href]')) {
      side.append(buildCard(row, picture, heading));
    } else if (picture && heading) {
      const item = el('li', 'news-item');
      const image = el('div', 'news-image');
      image.append(picture);
      const content = el('div', 'news-content');
      content.append(...contentOf(row).filter((n) => n.textContent.trim()));
      item.append(image, content);
      list.append(item);
    } else {
      more.append(...contentOf(row));
    }
    row.remove();
  });

  const main = el('div', 'news-main');
  if (list.children.length) main.append(list);
  if (more.children.length) main.append(more);
  const wrap = el('div', 'news-row');
  wrap.append(main);
  if (side.children.length) wrap.append(side);
  block.append(wrap);
}
