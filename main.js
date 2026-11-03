const root = document.documentElement;

// Tema
document.querySelector('.theme-btn').addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  document.querySelector('meta[name="theme-color"]').content = next === 'light' ? '#f7f7f5' : '#0b0b0c';
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// Menu mobile
const menuBtn = document.querySelector('.menu-btn');
const nav = document.getElementById('nav');
const setMenu = (open) => {
  nav.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
};
menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// Fade-in allo scroll
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();
