/**
 * login-form — Banca ONLINE access box. The source renders it in a cross-origin
 * iframe; this block recreates it inline and keeps posting to the source banking
 * host (dynamic row: login form). Rows, classified by content (authors may omit any):
 *   text row 1 = user field label, text row 2 = password label, text row 3 = submit
 *   label, link row = form action (defaults to the source endpoint).
 *
 * @ew-exempt placeholder / submit value attributes mirror the authored label text
 * (inputs cannot host nodes); the authored <p> nodes stay in the DOM as the
 * accessible labels (aria-labelledby) and the submit label as a hidden twin.
 * @param {Element} block the block element
 */
const DEFAULT_ACTION = 'https://bancaonline.caixaenginyers.com/BEWeb/3025/6025/identificacion.action';

const HIDDEN_FIELDS = [
  ['OPERACION', '0002'],
  ['IDIOMA', '02'],
  ['CAJA', '3025'],
  ['PINV2', 'si'],
  ['INILOGIN', 'S'],
  ['BROKER', 'SI'],
  ['GENERICA', 'S'],
  ['DEDONDE', 'GENE'],
  ['ACCSS', 'FUSION'],
];

const FIELDS = [
  { name: 'PAN', type: 'text', fallback: 'Usuari' },
  { name: 'PIN', type: 'password', fallback: "Clau d'accés" },
];

function labelText(node) {
  return node ? node.textContent.replace(/\s+/g, ' ').trim() : '';
}

function fieldRow(field, labelNode) {
  const row = document.createElement('div');
  row.className = 'login-row';
  const label = document.createElement('div');
  label.className = 'login-label sr-only';
  label.id = `login-label-${field.name.toLowerCase()}`;
  if (labelNode) label.append(labelNode);
  const wrap = document.createElement('div');
  wrap.className = 'login-field';
  const input = document.createElement('input');
  input.type = field.type;
  input.name = field.name;
  input.id = field.name;
  input.size = 18;
  input.autocomplete = 'off';
  input.placeholder = labelText(labelNode) || field.fallback;
  if (labelNode) input.setAttribute('aria-labelledby', label.id);
  else input.setAttribute('aria-label', field.fallback);
  wrap.append(input);
  row.append(label, wrap);
  return row;
}

export default function decorate(block) {
  if (block.querySelector('form')) return;
  let action = DEFAULT_ACTION;
  const labels = [];
  [...block.children].forEach((row) => {
    const link = row.querySelector('a[href]');
    if (link && labelText(link) === labelText(row)) {
      action = link.href;
    } else {
      const node = row.querySelector('p, h1, h2, h3, h4, h5, h6') || row.querySelector(':scope > div');
      if (node && labelText(node)) labels.push(node);
    }
    row.remove();
  });

  const box = document.createElement('div');
  box.className = 'login-box';
  const form = document.createElement('form');
  form.id = 'userpass';
  form.name = 'userpass';
  form.autocomplete = 'off';
  form.action = action;
  form.method = 'post';
  form.enctype = 'application/x-www-form-urlencoded';
  form.target = '_top';

  FIELDS.forEach((field, i) => form.append(fieldRow(field, labels[i])));

  const submitWrap = document.createElement('div');
  submitWrap.className = 'login-submit';
  const submit = document.createElement('input');
  submit.type = 'submit';
  submit.id = 'entrar';
  submit.className = 'login-button';
  submit.value = labelText(labels[2]) || 'Entrar';
  submitWrap.append(submit);
  if (labels[2]) {
    const twin = document.createElement('div');
    twin.className = 'login-label sr-only';
    twin.setAttribute('aria-hidden', 'true');
    twin.append(labels[2]);
    submitWrap.append(twin);
  }
  form.append(submitWrap);

  HIDDEN_FIELDS.forEach(([name, value]) => {
    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.name = name;
    hidden.value = value;
    form.append(hidden);
  });

  box.append(form);
  block.append(box);
}
