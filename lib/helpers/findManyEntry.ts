import { getKv } from "../database/index.ts";
import type { EKDataModel, EKFindManyEntry } from "../types/index.ts";

/**
 * Finds multiple entries in a collection matching the given filter.
 * Used internally by the Collection class and helpers.
 *
 * @template T - The data model type.
 * @param collection - The collection (namespace) name.
 * @param filter - Key-value pairs to match.
 * @param limit - Maximum number of results to return (default: 100).
 * @param cursor - Optional cursor for pagination.
 * @returns An object containing the matched results and the next cursor (if any).
 */
export const findManyKvEntry = async <T extends EKDataModel>(
  collection: string,
  filter: Partial<T>,
  limit = 100,
  cursor?: Deno.KvListIterator<T>["cursor"],
): Promise<EKFindManyEntry<T>[]> => {
  const kv = getKv();
  const result = [];
  const iter = kv.list<T>({ prefix: [collection] }, { limit, cursor });

  for await (const entry of iter) {
    const data = entry.value;
    const matches = Object.entries(filter).every(([key, value]) =>
      data[key] === value
    );
    if (matches) {
      result.push({ value: data, versionstamp: entry.versionstamp });
    }
    if (result.length >= limit) break;
  }

  return result;
};
