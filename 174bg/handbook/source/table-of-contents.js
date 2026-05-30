/**
 * table-of-contents.js
 *
 * Builds a nested table of contents from the page's sections and injects it
 * into the element with id "table-of-contents".
 *
 * How it works:
 *   1. Finds every `<article>` and `<section>` in `<main>` that has an `id`.
 *   2. Reads the first heading (h1–h6) in each to determine its title and
 *      nesting level.
 *   3. Builds a hierarchical <ul>/<li> tree using a stack to track the
 *      current nesting level, indenting nested levels with a left border.
 *   4. Each entry links to its section via an `#id` anchor.
 *
 * The TOC is only rendered if the container exists and at least one
 * qualifying section with a heading is found.
 */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("table-of-contents");
  if (!container) return;

  const sections = document.querySelectorAll(
    "main article[id], main section[id]",
  );

  const entries = [];
  sections.forEach((section) => {
    const heading = section.querySelector("h1, h2, h3, h4, h5, h6");
    if (!heading) return;
    entries.push({
      id: section.id,
      level: parseInt(heading.tagName.charAt(1), 10),
      text: heading.textContent.trim(),
    });
  });

  if (entries.length === 0) return;

  const baseLevel = Math.min(...entries.map((entry) => entry.level));

  const rootList = document.createElement("ul");
  rootList.className = "space-y-1 text-sm";
  const stack = [{ level: baseLevel - 1, list: rootList, item: null }];

  entries.forEach((entry) => {
    while (stack.length > 1 && entry.level <= stack[stack.length - 1].level) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];

    let parentList = parent.list;
    if (!parentList) {
      parentList = document.createElement("ul");
      parentList.className =
        "mt-1 ml-3 space-y-1 border-l border-stone-200 pl-3 dark:border-stone-700";
      parent.item.appendChild(parentList);
      parent.list = parentList;
    }

    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#" + entry.id;
    link.textContent = entry.text;
    link.className =
      "block rounded px-2 py-1 text-stone-600 no-underline transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100";
    listItem.appendChild(link);
    parentList.appendChild(listItem);

    stack.push({
      level: entry.level,
      list: null,
      item: listItem,
    });
  });

  container.appendChild(rootList);
});
