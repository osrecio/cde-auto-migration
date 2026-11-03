/**
 * request-form — "Sol·licita'l ara" product request form + contact channels.
 * The source posts to a host-bound Liferay DDM API; no backend is connected here, so the
 * form renders fully and submission is blocked with an explicit message
 * (stardust/dynamic-features.md row 3).
 *
 * Rows (classified by their keyword cell, never by index):
 *   [h2]                              band heading (anchor #formulario)
 *   [intro]    [text]                 form description
 *   [fields]   [ul > li label…]       one required text input per list item
 *   [consent]  [text]                 data-protection notice (required)
 *   [checkbox] [text (+ link)]        consent checkbox label
 *   [switch]   [legend p] [label p]   marketing opt-in toggle
 *   [submit]   [p]                    submit control label (the wrapper is the control, EW7)
 *   [contact]  [img, label p, link p] one row per contact channel (aside)
 *   [title]    [p]                    band title set as text (sibling variant)
 * A `fields` list item with a nested list is a select (the nested items are its options);
 * `fields thirds` sets that row three per line (sibling variant).
 * Rows without a keyword are appended to the form as text.
 *
 * @ew-exempt row keyword cells (intro / fields / consent / checkbox / switch / submit /
 *   contact) are configuration, kept hidden
 */

const KEYS = ['intro', 'fields', 'consent', 'checkbox', 'switch', 'submit', 'contact', 'title'];
const NO_BACKEND = 'No backend connected: aquest formulari encara no està connectat a cap servei '
  + 'i la sol·licitud no s\'ha enviat.';

let formCount = 0;

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

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

function inputType(text) {
  if (/e-?mail|correu/i.test(text)) return 'email';
  if (/tel[eèé]f|phone|m[oò]bil/i.test(text)) return 'tel';
  return 'text';
}

function inputName(text, i) {
  const slug = text.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-');
  return slug.replace(/^-+|-+$/g, '').slice(0, 40) || `field-${i}`;
}

let fieldCount = 0;

function buildSelect(li, options) {
  const select = document.createElement('select');
  [...options.querySelectorAll(':scope > li')].forEach((item, i) => {
    const option = document.createElement('option');
    option.append(...item.childNodes);
    if (i === 0) option.value = '';
    select.append(option);
  });
  options.remove();
  return select;
}

function buildFields(cell, prefix, mods) {
  const grid = div('request-form-grid');
  mods.forEach((m) => grid.classList.add(`request-form-grid-${m}`));
  [...cell.children].forEach((node) => {
    grid.append(node);
    node.querySelectorAll(':scope > li').forEach((li) => {
      fieldCount += 1;
      const id = `${prefix}-f${fieldCount}`;
      const options = li.querySelector(':scope > ul, :scope > ol');
      const control = options ? buildSelect(li, options) : document.createElement('input');
      const text = li.textContent.trim();
      const label = document.createElement('label');
      label.htmlFor = id;
      label.append(...li.childNodes);
      control.id = id;
      if (!options) control.type = inputType(text);
      control.name = inputName(text, fieldCount);
      control.required = true;
      control.setAttribute('aria-required', 'true');
      li.append(label, control);
    });
  });
  return grid;
}

function buildToggle(cell, prefix, kind) {
  const nodes = [...cell.children];
  const wrap = div(`request-form-${kind}`);
  const label = document.createElement('label');
  label.className = `request-form-${kind}-control`;
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = `${prefix}-${kind}`;
  input.name = kind === 'check' ? 'consent' : 'marketing';
  label.append(input);
  if (kind === 'check') {
    input.required = true;
    const text = document.createElement('span');
    text.className = 'request-form-check-text';
    text.append(...nodes);
    label.append(text);
    wrap.append(label);
  } else {
    input.setAttribute('role', 'switch');
    const bar = document.createElement('span');
    bar.className = 'request-form-switch-bar';
    bar.innerHTML = '<span class="request-form-switch-handle"></span>';
    const text = document.createElement('span');
    text.className = 'request-form-switch-label';
    const legend = div('request-form-switch-legend');
    if (nodes.length > 1) legend.append(nodes.shift());
    text.append(...nodes);
    label.append(bar, text);
    wrap.setAttribute('role', 'group');
    wrap.append(legend, label);
  }
  return wrap;
}

function buildChannel(cell) {
  const channel = div('request-form-channel');
  const pad = div('request-form-channel-pad');
  const icon = div('request-form-channel-icon');
  const text = div('request-form-channel-text');
  [...cell.children].forEach((node) => {
    if (node.querySelector('picture, img') && node.textContent.trim() === '') icon.append(node);
    else text.append(node);
  });
  const link = text.querySelector('a[href]');
  if (link && link.classList.contains('button')) {
    /* a channel link is a text link, not a CTA: undo the global button decoration */
    link.classList.remove('button', 'primary', 'secondary', 'accent');
    link.closest('p')?.classList.remove('button-wrapper');
  }
  if (link && /^[\d\s+]+$/.test(link.textContent.trim())) {
    channel.classList.add('request-form-channel-number');
  }
  channel.append(pad, icon, text);
  return channel;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .request-form-cols')) return;
  formCount += 1;
  const prefix = `request-form-${formCount}`;

  const head = div('request-form-head');
  const cols = div('request-form-cols');
  const form = document.createElement('form');
  form.className = 'request-form-form';
  form.noValidate = true;
  const group = div('request-form-group');
  const submit = div('request-form-submit');
  const status = document.createElement('p');
  status.className = 'request-form-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const aside = document.createElement('aside');
  aside.className = 'request-form-aside';
  const config = div('request-form-config');
  config.setAttribute('aria-hidden', 'true');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    cells.slice(1).forEach(ensureParagraph);
    const words = cells.length > 1 ? cells[0].textContent.trim().toLowerCase().split(/\s+/) : [];
    const [key = '', ...mods] = words;
    const isKey = KEYS.includes(key) && !cells[0].querySelector('a, picture, img');
    if (isKey) config.append(cells.shift());
    const [cell] = cells;
    if (!cell) return;
    if (!isKey) {
      const target = cell.querySelector('h1, h2, h3, h4, h5, h6') && !form.children.length
        ? head : form;
      cells.forEach((c) => target.append(...c.children));
      return;
    }
    if (key === 'title') {
      head.append(...cell.children);
    } else if (key === 'intro') {
      const intro = div('request-form-intro');
      intro.append(...cell.children);
      form.append(intro);
    } else if (key === 'fields') {
      form.append(buildFields(cell, prefix, mods));
    } else if (key === 'consent') {
      const consent = div('request-form-consent');
      consent.append(...cell.children);
      group.append(consent);
    } else if (key === 'checkbox') {
      group.append(buildToggle(cell, prefix, 'check'));
    } else if (key === 'switch') {
      group.append(buildToggle(cell, prefix, 'switch'));
    } else if (key === 'submit') {
      const control = div('request-form-submit-control');
      control.setAttribute('role', 'button');
      control.tabIndex = 0;
      control.append(...cell.children);
      submit.append(control);
    } else if (key === 'contact') {
      aside.append(buildChannel(cell));
    }
  });

  if (group.children.length) form.append(group);
  const hiddenSubmit = document.createElement('button');
  hiddenSubmit.type = 'submit';
  hiddenSubmit.className = 'request-form-hidden-submit';
  hiddenSubmit.tabIndex = -1;
  hiddenSubmit.setAttribute('aria-hidden', 'true');
  submit.append(hiddenSubmit);
  form.append(submit, status);

  submit.querySelectorAll('.request-form-submit-control').forEach((control) => {
    control.addEventListener('click', () => form.requestSubmit());
    control.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      form.requestSubmit();
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const invalid = [...form.elements].filter((el) => el.willValidate && !el.checkValidity());
    invalid.forEach((el) => el.setAttribute('aria-invalid', 'true'));
    status.textContent = NO_BACKEND;
    status.classList.add('is-visible');
  });

  if (!head.id) head.id = 'formulario';
  cols.append(form);
  if (aside.children.length) cols.append(aside);
  block.replaceChildren(head, cols, config);
}
