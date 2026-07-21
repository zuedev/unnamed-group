/**
 * Controller module for interacting with HTTP resources, mainly for fetching JSON data from external APIs.
 */

/**
 * Fetches data from a specified URL and returns the response as JSON or text.
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<Object|string|null>} A Promise that resolves to the parsed JSON object, text, or null if the request fails.
 */
export async function get(url) {
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

return { get };