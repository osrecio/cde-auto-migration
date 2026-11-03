/**
 * account-signup — "Dona't d'alta online": phone image | title, numbered steps, CTA; the
 * CTA opens a lightbox with the sign-up notice (source: .ce-alta + modalCeca lightbox).
 *
 * Rows (template-slotted, classified by content — never by position):
 *   picture-only row        the phone image (left column)
 *   two-cell row            one step: number cell | text cell
 *   button-only row         the CTA (strong link) — opens the lightbox
 *   single-paragraph row    the title (first text row)
 *   any other text row      the lightbox body (paragraphs, Continuar button, links)
 * Authored nodes are moved (EW1); the dialog close button is generated.
 * @ew-exempt "×" close glyph and "Tanca" label of the generated dialog close control
 * @param {Element} block the block element
 */
function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function cellNodes(cell) {
  const nodes = [...cell.children];
  if (nodes.length || !cell.textContent.trim()) return nodes;
  const p = el('p');
  p.append(...cell.childNodes);
  return [p];
}

export default function decorate(block) {
  if (block.querySelector(':scope > .account-signup-row')) return;
  const media = el('div', 'account-signup-media');
  const body = el('div', 'account-signup-body');
  const title = el('div', 'account-signup-title');
  const steps = el('div', 'account-signup-steps');
  const cta = el('div', 'account-signup-cta');
  const dialog = el('dialog', 'account-signup-dialog');
  const dialogBody = el('div', 'account-signup-dialog-body');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const pic = row.querySelector('picture');
    const text = row.textContent.trim();
    if (pic && !text) {
      media.append(pic);
    } else if (cells.length >= 2) {
      const step = el('div', 'account-signup-step');
      const num = el('div', 'account-signup-num');
      const txt = el('div', 'account-signup-txt');
      num.append(...cellNodes(cells[0]));
      cells.slice(1).forEach((c) => txt.append(...cellNodes(c)));
      step.append(num, txt);
      steps.append(step);
    } else {
      const nodes = cells.flatMap((c) => cellNodes(c));
      const onlyButton = nodes.length === 1 && nodes[0].querySelector('a[href]')
        && nodes[0].textContent.trim() === nodes[0].querySelector('a').textContent.trim();
      if (onlyButton && !cta.children.length) cta.append(...nodes);
      else if (nodes.length === 1 && !title.children.length && !steps.children.length) {
        title.append(...nodes);
      } else dialogBody.append(...nodes);
    }
    row.remove();
  });

  const wrap = el('div', 'account-signup-row');
  if (media.children.length) wrap.append(media);
  if (title.children.length) body.append(title);
  if (steps.children.length) body.append(steps);
  if (cta.children.length) body.append(cta);
  wrap.append(body);
  block.append(wrap);

  if (dialogBody.children.length) {
    const head = el('div', 'account-signup-dialog-head');
    const close = el('button', 'account-signup-close');
    close.type = 'button';
    close.setAttribute('aria-label', 'Tanca');
    close.textContent = '×';
    head.append(close);
    dialog.append(head, dialogBody);
    block.append(dialog);
    const opener = cta.querySelector('a[href]');
    if (opener) {
      opener.setAttribute('aria-haspopup', 'dialog');
      opener.addEventListener('click', (e) => {
        e.preventDefault();
        dialog.showModal();
        close.focus();
      });
    }
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
  }
}
