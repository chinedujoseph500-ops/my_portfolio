// Mobile menu toggle + footer year
const btn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
btn?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
});
document.getElementById('year').textContent = new Date().getFullYear();