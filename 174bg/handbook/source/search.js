/**
 * search.js
 *
 * Provides simple client-side filtering of the handbook's articles.
 *
 * How it works:
 *   1. Pressing the "/" key anywhere on the page focuses the search input
 *      (id "search-input"), unless focus is already needed elsewhere.
 *   2. As the user types, every `<article>` in `<main>` is shown or hidden
 *      based on whether its text content includes the (case-insensitive)
 *      query string.
 */
document.addEventListener("keypress", function (event) {
  if (event.key === "/") {
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.focus();
      event.preventDefault();
    }
  }
});

document
  .querySelector("#search-input")
  .addEventListener("input", function (event) {
    const query = event.target.value.toLowerCase();
    const articles = document.querySelectorAll("main article");
    articles.forEach((article) => {
      const text = article.textContent.toLowerCase();
      if (text.includes(query)) {
        article.style.display = "";
      } else {
        article.style.display = "none";
      }
    });
  });
