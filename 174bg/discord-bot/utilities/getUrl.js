export default async (url) => {
    const response = await fetch(url);

    if (!response.ok) return null;

    // is it json?
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    }

    // fallback to text
    return await response.text();
};
