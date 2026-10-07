const menuToggle = document.querySelector('.site-menu-toggle');
const siteNavigation = document.querySelector('#site-navigation');
const narrowScreen = window.matchMedia('(max-width: 1024px)');
function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  siteNavigation.hidden = narrowScreen.matches && !open;
}
function syncMenu() {
  menuToggle.hidden = !narrowScreen.matches;
  setMenu(false);
}
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
siteNavigation.addEventListener('keydown', event => {
  if (event.key === 'Escape' && narrowScreen.matches) {
    setMenu(false);
    menuToggle.focus();
  }
});
narrowScreen.addEventListener('change', syncMenu);
syncMenu();
