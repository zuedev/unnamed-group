import PocketBase from "pocketbase";

const { POCKETBASE_URL, POCKETBASE_SUPERUSER_EMAIL, POCKETBASE_SUPERUSER_PASSWORD } = process.env;

export async function login() {
    const pb = new PocketBase(POCKETBASE_URL);
    await pb.collection("_superusers").authWithPassword(POCKETBASE_SUPERUSER_EMAIL, POCKETBASE_SUPERUSER_PASSWORD);
    return pb;
}

export async function logout(pb) {
    await pb.authStore.clear();
}

export async function getFullList(collectionName) {
    const pb = await login();
    const data = await pb.collection(collectionName).getFullList();
    await logout(pb);
    return data;
}

export default { login, logout, getFullList }