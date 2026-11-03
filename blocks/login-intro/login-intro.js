/**
 * login-intro — centred page head of the online-banking access page
 * (h1, lead heading, recovery link). Template-slotted: the authored nodes are
 * moved, in order, into one `.login-intro-body` column; nothing is rebuilt.
 * @param {Element} block the block element
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .login-intro-body')) return;
  const body = document.createElement('div');
  body.className = 'login-intro-body';
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      while (cell.firstElementChild) body.append(cell.firstElementChild);
    });
    row.remove();
  });
  block.append(body);
}
