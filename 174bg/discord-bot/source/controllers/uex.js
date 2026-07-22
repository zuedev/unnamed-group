import { get } from "./http.js";

export async function categories() {
    return await get("https://api.uexcorp.uk/2.0/categories");
}

export async function items(id_category) {
    let items = [];

    if (!id_category) {
        const { data: categories } = await get("https://api.uexcorp.uk/2.0/categories");

        for (const category of categories) {
            const { data: categoryItems } = await get(`https://api.uexcorp.uk/2.0/items?id_category=${category.id}`);

            if (!categoryItems) continue;

            items = items.concat(categoryItems);
        }
    } else {
        const { data } = await get(`https://api.uexcorp.uk/2.0/items?category=${id_category}`);

        items = data;
    }

    return items;
}

export default { categories, items };