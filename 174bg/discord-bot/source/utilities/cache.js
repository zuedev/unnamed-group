/**
 * Utility module for caching arbitrary JSON-serializable values to disk with an expiry,
 * to avoid re-fetching data (e.g. from external APIs) more often than necessary.
 *
 * Cache entries are stored under `.cache/<namespace>/<hashed-key>.json` at the project root.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CACHE_ROOT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  ".cache",
);

function keyToFileName(key) {
  return `${createHash("sha256").update(key).digest("hex")}.json`;
}

async function readEntry(namespace, key) {
  const filePath = path.join(CACHE_ROOT, namespace, keyToFileName(key));

  try {
    const { expiresAt, data } = JSON.parse(await readFile(filePath, "utf-8"));

    if (Date.now() >= expiresAt) return undefined;

    return data;
  } catch {
    // missing, unreadable, or corrupt cache entry - treat as a cache miss
    return undefined;
  }
}

async function writeEntry(namespace, key, data, ttlMs) {
  const dir = path.join(CACHE_ROOT, namespace);

  await mkdir(dir, { recursive: true });
  await writeFile(
    path.join(dir, keyToFileName(key)),
    JSON.stringify({ expiresAt: Date.now() + ttlMs, data }),
  );
}

/**
 * Returns the cached value for `key` within `namespace` if it exists and hasn't expired.
 * Otherwise, calls `fetcher`, caches its result for `ttlMs` milliseconds, and returns it.
 * @param {string} namespace - Subdirectory under `.cache` to group related entries (e.g. "uex").
 * @param {string} key - Unique identifier for this cached value within the namespace.
 * @param {number} ttlMs - How long the cached value should remain valid, in milliseconds.
 * @param {() => Promise<any>} fetcher - Called to produce a fresh value on a cache miss.
 */
export async function cached(namespace, key, ttlMs, fetcher) {
  const existing = await readEntry(namespace, key);
  if (existing !== undefined) return existing;

  const data = await fetcher();

  // don't cache failed/empty lookups so they get retried on the next call
  if (data !== null && data !== undefined) {
    await writeEntry(namespace, key, data, ttlMs);
  }

  return data;
}

export default { cached };
