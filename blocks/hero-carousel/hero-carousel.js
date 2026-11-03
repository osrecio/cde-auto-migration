/**
 * hero-carousel — full-bleed rotating hero (source: Owl Carousel, items 1, autoplay,
 * autoplayTimeout 6000 ms, rewind, animateOut fadeOut 1000 ms, autoHeight; dots and
 * pause/play controls). Shared by the home and the online-banking access pages.
 *
 * One row per slide (reconstructive — cells classified by content, never by index):
 *   image cell    a picture (the slide background; the thumbnail of a video slide)
 *   content cell  heading / paragraphs / CTA link (strong = primary, em = secondary);
 *                 a cell holding only a YouTube / Vimeo link makes a video slide
 *   options cell  optional keywords: left | right (text side), light (white text),
 *                 wide (3/4 column), large (28px body), video (marker only),
 *                 center (home: centred white copy, navy box <992, orange CTA),
 *                 list (home: check-mark list, 56px light h1, left-aligned text)
 * Authored nodes are moved, never rebuilt. The whole slide is one link to its CTA href
 * (EW6: the CTA anchor is unwrapped into a button-faced span, its text nodes moved).
 * @param {Element} block the block element
 */
const TIMEOUT = 6000;
const FADE = 1000;
const OPTIONS = ['left', 'right', 'light', 'wide', 'large', 'video', 'center', 'list'];
const VIDEO_RE = /(youtube\.com|youtu\.be|vimeo\.com)\//;

function textOf(el) {
  return el.textContent.replace(/\s+/g, ' ').trim();
}

function isOptionsCell(cell) {
  if (cell.querySelector('picture, img, a, h1, h2, h3, h4, h5, h6')) return false;
  const words = textOf(cell).toLowerCase().split(/[\s,]+/).filter(Boolean);
  return words.length > 0 && words.every((w) => OPTIONS.includes(w));
}

function videoLink(cell) {
  const links = [...cell.querySelectorAll('a[href]')];
  if (links.length !== 1 || !VIDEO_RE.test(links[0].href)) return null;
  if (cell.querySelector('h1, h2, h3, h4, h5, h6')) return null;
  return links[0];
}

function embedUrl(href) {
  const url = new URL(href);
  if (url.hostname.includes('vimeo')) {
    return `https://player.vimeo.com/video/${url.pathname.split('/').pop()}?autoplay=1`;
  }
  const id = url.hostname.includes('youtu.be')
    ? url.pathname.slice(1)
    : url.searchParams.get('v') || url.pathname.split('/').pop();
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
}

function buildSlide(row, index) {
  const cells = [...row.children];
  const slide = document.createElement('div');
  slide.className = 'hero-carousel-slide';
  slide.dataset.slide = index + 1;
  const media = document.createElement('div');
  media.className = 'hero-carousel-media';
  const content = document.createElement('div');
  content.className = 'hero-carousel-content';
  const text = document.createElement('div');
  text.className = 'hero-carousel-text';
  content.append(text);
  let video = null;

  cells.forEach((cell) => {
    if (isOptionsCell(cell)) {
      textOf(cell).toLowerCase().split(/[\s,]+/).filter(Boolean)
        .forEach((w) => slide.classList.add(`slide-${w}`));
      const opts = document.createElement('div');
      opts.className = 'hero-carousel-options';
      while (cell.firstChild) opts.append(cell.firstChild);
      slide.append(opts);
      return;
    }
    const pics = [...cell.querySelectorAll(':scope > picture, :scope > p > picture')];
    const onlyPicture = pics.length === 1 && textOf(cell) === ''
      && !media.querySelector('picture');
    if (onlyPicture) {
      media.append(pics[0]);
      return;
    }
    const link = videoLink(cell);
    if (link && !video) video = link;
    while (cell.firstElementChild) text.append(cell.firstElementChild);
  });
  row.remove();

  if (video) {
    slide.classList.add('slide-video');
    const play = document.createElement('div');
    play.className = 'hero-carousel-play';
    const linkP = video.closest('p') || video;
    play.append(linkP);
    media.append(play);
    video.addEventListener('click', (e) => {
      e.preventDefault();
      const frame = document.createElement('iframe');
      frame.src = embedUrl(video.href);
      frame.title = video.title || textOf(video);
      frame.allow = 'autoplay; encrypted-media; picture-in-picture';
      frame.allowFullscreen = true;
      frame.className = 'hero-carousel-frame';
      media.append(frame);
      slide.classList.add('slide-playing');
      slide.closest('.hero-carousel').dispatchEvent(new CustomEvent('hero-carousel:pause'));
    });
  } else if (!slide.classList.contains('slide-right')) {
    slide.classList.add('slide-left');
  }

  // the pipeline trims the space after a <br>; restore it so a line break hidden by a
  // breakpoint rule still separates its words (collapsed at line start otherwise)
  text.querySelectorAll('br').forEach((br) => {
    const next = br.nextSibling;
    if (next && !(next.nodeType === 3 && /^\s/.test(next.textContent))) {
      br.after(document.createTextNode(' '));
    }
  });

  // list items: the nodes after a <br> are the item's note (moved into a span)
  text.querySelectorAll('li > br').forEach((br) => {
    const rest = [];
    let n = br.nextSibling;
    while (n) {
      rest.push(n);
      n = n.nextSibling;
    }
    if (!rest.some((node) => node.textContent.trim())) return;
    const note = document.createElement('span');
    note.className = 'hero-carousel-note';
    note.append(...rest);
    br.after(note);
  });

  // center slides: the copy (everything but the CTA paragraph) sits in one box
  if (slide.classList.contains('slide-center')) {
    const ctaP = text.querySelector('a[href]')?.closest('p');
    const copy = document.createElement('div');
    copy.className = 'hero-carousel-copy';
    copy.append(...[...text.children].filter((el) => el !== ctaP));
    text.prepend(copy);
  }

  if (!text.children.length) content.remove();
  slide.prepend(media);
  if (text.children.length) media.after(content);

  // EW6 slide-as-link (source: the whole slide is one <a>, its CTA a fake button):
  // read the CTA href, wrap the slide in one anchor, unwrap the authored CTA anchor
  const cta = video ? null : text.querySelector('a[href]');
  if (cta) {
    const link = document.createElement('a');
    link.className = 'hero-carousel-link';
    link.href = cta.href;
    if (cta.title) link.title = cta.title;
    const face = document.createElement('span');
    face.className = 'hero-carousel-cta';
    ['primary', 'secondary', 'accent'].forEach((kind) => {
      if (cta.classList.contains(kind)) face.classList.add(kind);
    });
    if (!cta.classList.contains('button')) {
      if (cta.closest('strong')) face.classList.add('primary');
      else face.classList.add('secondary');
    }
    while (cta.firstChild) face.append(cta.firstChild);
    cta.replaceWith(face);
    link.append(...slide.children);
    slide.append(link);
  }
  return slide;
}

function control(cls, label, hidden) {
  const btn = document.createElement('a');
  btn.href = '#';
  btn.setAttribute('role', 'button');
  btn.className = cls;
  btn.hidden = hidden;
  const glyph = document.createElement('span');
  glyph.className = 'hero-carousel-glyph';
  glyph.setAttribute('aria-hidden', 'true');
  const sr = document.createElement('span');
  sr.className = 'sr-only';
  sr.textContent = label;
  btn.append(glyph, sr);
  return btn;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .hero-carousel-stage')) return;
  const stage = document.createElement('div');
  stage.className = 'hero-carousel-stage';
  stage.setAttribute('aria-live', 'off');
  const rows = [...block.children];
  const slides = rows.map((row, i) => buildSlide(row, i));
  if (!slides.length) return;
  stage.append(...slides);

  const dots = document.createElement('div');
  dots.className = 'hero-carousel-dots';
  const dotButtons = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero-carousel-dot';
    dot.setAttribute('aria-label', `Ves A Control lliscant ${i + 1}`);
    dot.append(document.createElement('span'));
    dots.append(dot);
    return dot;
  });

  const pause = control('hero-carousel-pause', 'PausaControl lliscant', false);
  const play = control('hero-carousel-resume', 'Reproduir Control lliscant', true);

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.setAttribute('aria-label', 'Carrousel');
  block.append(stage, dots);
  if (slides.length > 1) block.append(play, pause);
  else dots.hidden = true;

  let current = 0;
  let timer = null;

  const show = (n) => {
    const next = (n + slides.length) % slides.length;
    if (next === current && slides[current].classList.contains('active')) return;
    const prev = slides[current];
    if (prev !== slides[next]) {
      prev.classList.remove('active');
      prev.classList.add('fading-out');
      prev.setAttribute('aria-hidden', 'true');
      setTimeout(() => prev.classList.remove('fading-out'), FADE);
    }
    current = next;
    slides[current].classList.add('active');
    slides[current].removeAttribute('aria-hidden');
    dotButtons.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-current', String(i === current));
    });
  };

  const stop = () => {
    clearInterval(timer);
    timer = null;
  };
  const start = () => {
    stop();
    if (slides.length < 2 || block.classList.contains('paused')) return;
    // owl rewind: after the last slide the next tick returns to the first
    timer = setInterval(() => show(current + 1 < slides.length ? current + 1 : 0), TIMEOUT);
  };

  slides.forEach((s) => s.setAttribute('aria-hidden', 'true'));
  show(0);

  dotButtons.forEach((dot, i) => dot.addEventListener('click', () => {
    show(i);
    start();
  }));
  pause.addEventListener('click', (e) => {
    e.preventDefault();
    block.classList.add('paused');
    pause.hidden = true;
    play.hidden = false;
    stop();
    play.focus();
  });
  play.addEventListener('click', (e) => {
    e.preventDefault();
    block.classList.remove('paused');
    play.hidden = true;
    pause.hidden = false;
    start();
    pause.focus();
  });
  block.addEventListener('hero-carousel:pause', () => {
    block.classList.add('paused');
    pause.hidden = true;
    play.hidden = false;
    stop();
  });
  start();
}
