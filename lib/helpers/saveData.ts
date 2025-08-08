import { type EKDataModel, getKv } from "../../mod.ts";
import type { EKSaveResponse } from "../types/index.ts";

/**
 * Saves a new entry to the specified collection.
 * If the entry does not have an `_id`, a unique one will be generated automatically.
 * The operation is atomic and will fail if an entry with the same `_id` already exists.
 *
 * @template T - The data model type.
 * @param data - The data object to save.
 * @param collection - The collection (namespace) name.
 * @returns The result of the save operation, including status, versionstamp, and the entry's `_id`.
 *
 * @throws {Error} If an entry with the same `_id` already exists in the collection.
 *
 * @example
 * ```typescript
 * await saveData({ name: "Alice", age: 30 }, "users");
 * ```
 */
export const saveData = async <T extends EKDataModel>(
  data: T,
  collection: string,
): Promise<EKSaveResponse<T>> => {
  const kv = getKv();
  const _id = data._id || crypto.randomUUID();
  const key = [collection, _id];

  // Atomic insert: only if key does not exist
  const res = await kv.atomic()
    .check({ key, versionstamp: null }) // null means key must not exist
    .set(key, { ...data, _id })
    .commit();

  if (!res.ok) {
    throw new Error('A collection already exists with the same "id"');
  }

  return {
    ok: res.ok,
    versionstamp: res.versionstamp,
    id: _id,
  };
};
