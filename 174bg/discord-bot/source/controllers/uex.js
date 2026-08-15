import { get } from "./http.js";
import { cached } from "../utilities/cache.js";

export async function categories() {
  return await cached("uex", "categories", 60 * 60 * 1000 * 24, () =>
    get("https://api.uexcorp.uk/2.0/categories"),
  );
}

export async function items(id_category) {
  let items = [];

  if (!id_category) {
    const { data: allCategories } = await categories();

    for (const category of allCategories) {
      const { data: categoryItems } = await cached(
        "uex",
        `items:${category.id}`,
        60 * 60 * 1000 * 24,
        () =>
          get(`https://api.uexcorp.uk/2.0/items?id_category=${category.id}`),
      );

      if (!categoryItems) continue;

      items = items.concat(categoryItems);
    }
  } else {
    const { data } = await cached(
      "uex",
      `items:${id_category}`,
      60 * 60 * 1000 * 24,
      () => get(`https://api.uexcorp.uk/2.0/items?category=${id_category}`),
    );

    items = data;
  }

  return items;
}

export default { categories, items };
