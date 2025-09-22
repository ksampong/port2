// Motion preference
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Window open/close ----
let lastFocused = null;

function openWindow(windowId) {
  const el = document.getElementById(windowId);
  if (!el) return;
  el.style.display = 'block';
  document.body.classList.add('has-modal');
  lastFocused = document.activeElement;
  const focusable = el.querySelector('button, [href], [tabindex]:not([tabindex="-1"])');
  (focusable || el).focus();
}
function closeWindow(windowId) {
  const el = document.getElementById(windowId);
  if (!el) return;
  el.style.display = 'none';
  document.body.classList.remove('has-modal');
  if (lastFocused) lastFocused.focus();
}
window.openWindow = openWindow;
window.closeWindow = closeWindow;

// Backdrop click to close
document.body.addEventListener('click', (e) => {
  if (!document.body.classList.contains('has-modal')) return;
  if (e.target === document.body) {
    document.querySelectorAll('.window').forEach(w => w.style.display = 'none');
    document.body.classList.remove('has-modal');
  }
}, true);

// ---- Dropdowns ----
document.querySelectorAll('.dropdown-btn').forEach(btn => {
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('role', 'button');
  btn.setAttribute('tabindex', '0');
  btn.addEventListener('click', () => toggleDropdown(btn));
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDropdown(btn); }
  });
});
function toggleDropdown(btn) {
  const container = btn.closest('.dropdown');
  const isOpen = container.classList.contains('open');
  document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
  container.classList.toggle('open', !isOpen);
  btn.setAttribute('aria-expanded', String(!isOpen));
}

// ---- Book open behavior ----
const book = document.getElementById('book');
let bookOpened = false;
if (book) {
  book.addEventListener('click', () => {
    if (bookOpened) return;
    book.classList.add('opened');   // CSS hides left, shows right
    bookOpened = true;
  }, { once: true });
}

// ---- Status bar time ----
const timeEl = document.getElementById('statusBarTime');
function updateTime() {
  if (!timeEl) return;
  const now = new Date();
  timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
updateTime(); setInterval(updateTime, 1000);

// ---- Terminal typing (pre-open only) with simple color tags ----
const terminalText = `
Booting up system...
Checking memory... {green}[OK]{/}
Checking disk... {green}[OK]{/}
Loading Experiences... {yellow}[WARN]{/}
System ready.

{bold}My name is Kofi.{/} This is my professional journal: recent work, projects, and things I'm learning.
`;

function colorizeTagged(text) {
  const map = {
    green:'ansi-green', red:'ansi-red', yellow:'ansi-yellow',
    blue:'ansi-blue', magenta:'ansi-magenta', cyan:'ansi-cyan',
    white:'ansi-white', bold:'ansi-bold', dim:'ansi-dim', inv:'ansi-invert'
  };
  return text.replace(/\{(green|red|yellow|blue|magenta|cyan|white|bold|dim|inv)\}([\s\S]*?)\{\/\}/g,
    (_, key, inner) => `<span class="${map[key]}">${inner}</span>`);
}

function typeText(html, speed, element) {
  let i = 0;
  function nextChar() {
    if (i >= html.length) return;
    if (html[i] === '<') {
      const end = html.indexOf('>', i);
      element.innerHTML += html.slice(i, end + 1);
      i = end + 1;
    } else {
      element.innerHTML += html[i++];
    }
    setTimeout(nextChar, speed);
  }
  nextChar();
}

window.addEventListener('load', () => {
  const terminalOutput = document.getElementById('terminalOutput');
  if (!terminalOutput) return;
  const colored = colorizeTagged(terminalText);
  typeText(colored, prefersReduced ? 0 : 35, terminalOutput);
});

// ---- Keyboard open for desktop icons ----
document.querySelectorAll('.desktop-icon-container').forEach(div => {
  div.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const handler = div.getAttribute('onclick');
      const id = handler && handler.match(/openWindow\(['"](.+?)['"]\)/)?.[1];
      if (id) openWindow(id);
    }
  });
});

// ---- Papers viewer ----
(function setupPapers() {
  const links = document.querySelectorAll('.paper-link');
  const frame = document.getElementById('pdfFrame');
  const titleEl = document.getElementById('paperTitle');
  const openExt = document.getElementById('openExternal');
  const dl = document.getElementById('downloadFile');
  if (!links.length || !frame || !titleEl || !openExt || !dl) return;

  function select(link) {
    links.forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    const src = link.getAttribute('data-src');
    const href = link.getAttribute('href');
    frame.src = src || href;
    titleEl.textContent = link.textContent.trim();
    openExt.href = href;
    dl.href = href;
  }

  links.forEach(a => {
    a.addEventListener('click', (e) => { e.preventDefault(); select(a); });
    a.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(a); }
    });
  });

  const active = document.querySelector('.paper-link.active') || links[0];
  if (active) select(active);
})();

