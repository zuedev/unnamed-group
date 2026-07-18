export default async (url) => {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
};
