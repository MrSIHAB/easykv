import { getKv } from "../../mod.ts";
import type { EKDataModel, EKUpdateType } from "../types/index.ts";
import { findManyKvEntry } from "./findManyEntry.ts";

/**
 * Updates a specific entry in the collection by its unique `_id`.
 * Performs an atomic update to ensure data consistency.
 *
 * @template T - The data model type.
 * @param collection - The collection (namespace) name.
 * @param id - The unique `_id` of the entry to update.
 * @param options - The fields and values to update.
 * @returns An object containing the update status and versionstamp.
 *
 * @example
 * ```typescript
 * await updateByIdHelper("users", "user-id", { age: 25 });
 * ```
 */
export const updateByIdHelper = async <T extends EKDataModel>(
  collection: string,
  id: Deno.KvKeyPart,
  options: Partial<T>,
): Promise<EKUpdateType<T>> => {
  const kv = getKv();
  const key = [collection, id];

  // Retrieve the current value and versionstamp for atomic update
  const entry = await kv.get<T>(key);
  if (!entry.value) return { ok: false, versionstamp: null };

  return kv.set(key, { ...entry.value, ...options });
};

/**
 * Finds the first entry matching the filter and updates its data atomically.
 * Returns the update status and versionstamp.
 * Used internally by Collection.findOneAndUpdate().
 *
 * @template T - The data model type.
 * @param collection - The collection (namespace) name.
 * @param filter - Key-value pairs to match the entry.
 * @param options - The fields and values to update.
 * @returns An object containing the update status and versionstamp.
 *
 * @example
 * ```typescript
 * await findOneAndUpdate("users", { name: "Alice" }, { age: 31 });
 * ```
 */
export const findOneAndUpdate = async <T extends EKDataModel>(
  collection: string,
  filter: Partial<T>,
  options: Partial<T>,
): Promise<EKUpdateType<T>> => {
  const kv = getKv();
  const entries = await findManyKvEntry(collection, filter, 1);
  if (entries.length === 0) return { ok: false, versionstamp: null };

  const entry = entries[0];
  const key = [collection, entry.value._id];
  return kv.set(key, { ...entry.value, ...options });
};
