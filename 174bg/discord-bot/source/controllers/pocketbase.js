/**
 * Controller module for interacting with the PocketBase API.
 */

import PocketBase from "pocketbase";

const { POCKETBASE_URL, POCKETBASE_SUPERUSER_EMAIL, POCKETBASE_SUPERUSER_PASSWORD } = process.env;

/**
 * Logs in to the PocketBase API using the superuser credentials.
 * @returns {Promise<PocketBase>} A Promise that resolves to the authenticated PocketBase instance.
 */
export async function login() {
    const pb = new PocketBase(POCKETBASE_URL);
    await pb.collection("_superusers").authWithPassword(POCKETBASE_SUPERUSER_EMAIL, POCKETBASE_SUPERUSER_PASSWORD);
    return pb;
}

/**
 * Logs out of the PocketBase API by clearing the authentication store.
 * @param {PocketBase} pb - The PocketBase instance to log out from.
 * @returns {Promise<void>} A Promise that resolves when the logout is complete.
 */
export async function logout(pb) {
    await pb.authStore.clear();
}

/**
 * Retrieves the full list of records from a specified collection in the PocketBase API.
 * @param {string} collectionName - The name of the collection to retrieve records from.
 * @returns {Promise<RecordModel[]>} A Promise that resolves to an array of records from the specified collection.
 */
export async function getFullList(collectionName) {
    const pb = await login();
    const data = await pb.collection(collectionName).getFullList();
    await logout(pb);
    return data;
}

export default { login, logout, getFullList }