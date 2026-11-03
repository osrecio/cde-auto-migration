/**
 * section-bullets — the fixed right-hand section navigator of the home page (source
 * .bullets): one dot per page section with its label as a hover/active tooltip, a
 * scroll-spy that marks the section in view (none at the top) and click-to-scroll.
 * Content: one list; the n-th item names the n-th section of the page, an item past
 * the last section points at the footer. Each item's nodes are moved into its link (EW1).
 * Also toggles body.scroll-mark once the page is scrolled (source behaviour).
 * @param {Element} block the block element
 */
export default function decorate(block) {
  if (block.querySelector(':scope > nav')) return;
  const list = block.querySelector('ul, ol');
  if (!list) return;
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Seccions');
  const sections = [...document.querySelectorAll('main > .section')];
  const links = [...list.children].map((li, i) => {
    const target = sections[i] || document.querySelector('footer');
    const a = document.createElement('a');
    a.href = '#';
    const title = document.createElement('span');
    title.className = 'section-bullets-title';
    title.append(...li.childNodes);
    const dot = document.createElement('span');
    dot.className = 'section-bullets-dot';
    a.append(title, dot);
    li.append(a);
    a.addEventListener('click', (e) => {
      e.preventDefault();
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
    return { a, target };
  });
  nav.append(list);
  block.replaceChildren(nav);

  const spy = () => {
    let on = -1;
    if (window.scrollY > 0) {
      links.forEach(({ target }, i) => {
        if (target && target.getBoundingClientRect().top <= window.innerHeight / 2) on = i;
      });
    }
    links.forEach(({ a }, i) => a.classList.toggle('active', i === on));
    document.body.classList.toggle('scroll-mark', window.scrollY > 0);
  };
  window.addEventListener('scroll', spy, { passive: true });
  spy();
}
