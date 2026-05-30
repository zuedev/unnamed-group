/**
 * nav.js
 *
 * Toggles the off-canvas navigation drawer on small screens.
 *
 * How it works:
 *   1. On small screens the sidebar (`#nav`) is positioned off-canvas and
 *      revealed by toggling its transform via the hamburger button
 *      (`#nav-toggle`).
 *   2. A backdrop (`#nav-backdrop`) is shown while the drawer is open and
 *      closes it when clicked.
 *   3. Following any link inside the drawer closes it on mobile so the
 *      target section is visible.
 *
 * On medium screens and up the drawer is always visible and these handlers
 * have no visible effect.
 */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("nav");
  const backdrop = document.getElementById("nav-backdrop");
  if (!toggle || !nav || !backdrop) return;

  const open = () => {
    nav.classList.remove("-translate-x-full");
    nav.classList.add("translate-x-0");
    backdrop.classList.remove("hidden");
    toggle.setAttribute("aria-expanded", "true");
  };

  const close = () => {
    nav.classList.add("-translate-x-full");
    nav.classList.remove("translate-x-0");
    backdrop.classList.add("hidden");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    if (nav.classList.contains("-translate-x-full")) open();
    else close();
  });

  backdrop.addEventListener("click", close);

  nav.addEventListener("click", (event) => {
    if (
      event.target.closest("a") &&
      window.matchMedia("(max-width: 767px)").matches
    ) {
      close();
    }
  });
});
