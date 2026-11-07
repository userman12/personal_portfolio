// Tema chiaro/scuro e copia email. Condiviso da IT ed EN.
const root = document.documentElement;
const themeBtn = document.querySelector('.theme-btn');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const status = document.querySelector('[role="status"]');

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeMeta.content = theme === 'light' ? '#f4f5fc' : '#1F06AC';
  themeBtn.setAttribute('aria-pressed', String(theme === 'light'));
}

applyTheme(root.dataset.theme === 'light' ? 'light' : 'dark');

themeBtn.addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.classList.add('theme-switching');
  applyTheme(next);
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
  try { localStorage.setItem('theme', next); } catch (e) {}
});

document.querySelectorAll('.copy-btn').forEach((btn) => {
  let timer;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
    } catch (e) {
      // Fallback: seleziona il testo così si può copiare a mano
      const range = document.createRange();
      range.selectNodeContents(btn.closest('.cta-foot').querySelector('.mail'));
      getSelection().removeAllRanges();
      getSelection().addRange(range);
      return;
    }
    // Il testo svanisce e compare la spunta; lo screen reader sente comunque "Copiata"
    btn.classList.add('is-copied');
    status.textContent = btn.dataset.done;
    clearTimeout(timer);
    timer = setTimeout(() => { btn.classList.remove('is-copied'); status.textContent = ''; }, 2000);
  });
});

// Barra in alto: visibile solo dopo aver superato il riquadro contatti.
// `inert` la nasconde anche a tastiera e screen reader.
const topbar = document.querySelector('.topbar');
const cta = document.querySelector('.tile-cta');

// La lingua già attiva non ricarica la pagina
document.querySelector('.lang a[aria-current]').addEventListener('click', (e) => e.preventDefault());

// Cambio lingua: la nuova pagina si apre allo stesso punto, al pixel.
// Le due pagine hanno gli stessi elementi nello stesso ordine: salvo quale titolo/paragrafo
// è più vicino alla cima dello schermo e a che distanza, e lo rimetto lì.
const anchors = () => [...document.querySelectorAll('main :is(h1,h2,h3,p,li,img,a.btn)')];
document.querySelectorAll('.lang a:not([aria-current])').forEach((a) => {
  a.addEventListener('click', () => {
    if (scrollY === 0) return;
    let best = -1, top = Infinity;
    anchors().forEach((el, i) => {
      const t = el.getBoundingClientRect().top;
      if (t >= 0 && t < top) { top = t; best = i; }
    });
    if (best < 0) return;
    try { sessionStorage.setItem('langScroll', JSON.stringify([best, top])); } catch (e) {}
  });
});
try {
  const saved = JSON.parse(sessionStorage.getItem('langScroll'));
  sessionStorage.removeItem('langScroll');
  if (saved) {
    history.scrollRestoration = 'manual';
    const place = () => {
      const el = anchors()[saved[0]];
      if (el) scrollTo({ top: scrollY + el.getBoundingClientRect().top - saved[1], behavior: 'instant' });
    };
    place();
    // Se font o immagini cambiano l'impaginazione, riallinea, finché l'utente non scorre da solo
    let moved = false;
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((t) => addEventListener(t, () => { moved = true; }, { once: true, passive: true }));
    document.fonts.ready.then(() => { if (!moved) place(); });
    addEventListener('load', () => { if (!moved) place(); });
    // Barra già nello stato giusto al primo frame, senza animazione di entrata
    topbar.style.transition = 'none';
    topbar.inert = cta.getBoundingClientRect().bottom > 0;
    requestAnimationFrame(() => requestAnimationFrame(() => topbar.style.removeProperty('transition')));
  }
} catch (e) {}

new IntersectionObserver(([e]) => {
  topbar.inert = e.isIntersecting || e.boundingClientRect.top > 0;
}).observe(cta);
