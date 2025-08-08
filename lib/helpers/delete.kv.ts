import { getKv } from "../database/index.ts";
import type { EKDeleteCount } from "../types/index.ts";
import { findManyKvEntry } from "./findManyEntry.ts";

/**
 * Deletes a single entry from the specified collection by its unique `_id`.
 * Used internally by the Collection class.
 *
 * @param collection - The collection (namespace) name.
 * @param id - The unique identifier of the entry to delete.
 * @returns An object indicating if the deletion was successful.
 */
export const deleteEntry = async (
  collection: string,
  id: Deno.KvKeyPart,
): Promise<{ ok: boolean }> => {
  const kv = getKv();
  try {
    await kv.delete([collection, id]);
    return { ok: true };
  } catch (_e) {
    return { ok: false };
  }
};

/**
 * Deletes all entries in the specified collection that match the given filter.
 * Performs the deletions atomically for consistency.
 * Used internally by the Collection class.
 *
 * @param collection - The collection (namespace) name.
 * @param options - Key-value pairs to match for deletion.
 * @returns An object with deletion statistics, including how many entries were matched, deleted, and left.
 */
export const deleteManyEntry = async <T>(
  collection: string,
  options: Partial<T>,
): Promise<EKDeleteCount> => {
  const kv = getKv();
  const matched = await findManyKvEntry(collection, options);

  if (matched.length === 0) {
    return {
      ok: true,
      total: 0,
      removed: 0,
      left: 0,
    };
  }

  let atomic = kv.atomic();
  for (const entry of matched) {
    atomic = atomic.delete([collection, entry.value._id]);
  }
  const res = await atomic.commit();

  // Confirm deletion by querying again
  const { values } = await findManyKvEntry(collection, options);

  return {
    ok: values.length === 0 && res.ok,
    total: matched.values.length,
    removed: matched.values.length - values.length,
    left: values.length,
  };
};
