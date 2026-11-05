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
  applyTheme(next);
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
new IntersectionObserver(([e]) => {
  topbar.inert = e.isIntersecting || e.boundingClientRect.top > 0;
}).observe(document.querySelector('.tile-cta'));
