import { getKv } from "../mod.ts";
import { CollectionMap } from "./collection.abstract.ts";
import { deleteEntry, deleteManyEntry } from "./helpers/delete.kv.ts";
import { findManyKvEntry } from "./helpers/findManyEntry.ts";
import { saveData } from "./helpers/saveData.ts";
import { findOneAndUpdate, updateByIdHelper } from "./helpers/updateData.ts";
import type {
  EKDataModel,
  EKDeleteCount,
  EKFindEntry,
  EKFindManyEntry,
  EKSaveResponse,
  EKUpdateType,
} from "./types/index.ts";

/////////////////////////////////////////////////////
/**
 * The `Collection` class provides a high-level API for managing entities in a Deno KV database.
 * Each collection acts as a namespace for a group of related documents (like a table in SQL or a collection in MongoDB).
 *
 * #### Features
 * - Save, find, update, and delete documents by ID or filter.
 * - Check for existence or uniqueness of data.
 * - Batch delete and full collection wipe.
 * - All operations are promise-based and type-safe.
 *
 * #### Example Usage
 * ```typescript
 * import { Collection } from "easykv";
 *
 * // Define your data model
 * interface User extends EKDataModel {
 *   name: string;
 *   age: number;
 * }
 *
 * // Create a collection instance
 * const users = new Collection<User>("users");
 *
 * // Save a new user
 * await users.save({ name: "Shoaib Hossain", age: 19 });
 *
 * // Find by ID
 * const result = await users.findById("<SOME-ID>");
 *
 * // Find many
 * const allShrutis = await users.findMany({ name: "Shruti" });
 *
 * // Update by ID
 * await users.updateById("<SOME-ID>", { age: 21 });
 *
 * // Delete by ID
 * await users.delete("<SOME-ID>");
 * ```
 *
 * @typeParam T - The data model type for this collection.
 */
/////////////////////////////////////////////////////
export class Collection<
  T extends EKDataModel = EKDataModel,
> extends CollectionMap<T> {
  /**
   * Create a new Collection instance.
   * @param collection - The name of the collection (namespace).
   */
  constructor(collection: string) {
    super(collection);
    this.collection = collection;
  }

  /////////////////////////////////////////////////////
  /**
   * Save a new document to the collection.
   * If `_id` is not provided, a unique one will be generated automatically.
   *
   * @param data - The data object to save.
   * @returns The result of the save operation, including status and versionstamp.
   *
   * @example
   * ```typescript
   * await users.save({ name: "Shruti", age: 18 });
   * ```
   */
  override save = async (
    data: T,
  ): Promise<EKSaveResponse<T>> => await saveData<T>(data, this.collection);

  /////////////////////////////////////////////////////
  /**
   * Find a document by its unique `_id`.
   *
   * @param id - The unique identifier of the document.
   * @returns An object containing the document (if found), versionstamp, and status.
   *
   * @example
   * ```typescript
   * const result = await users.findById("<USER-ID>");
   * if (result.ok) {
   *   console.log(result.value);
   * }
   * ```
   */
  override async findById(
    id: Deno.KvKeyPart,
  ): Promise<EKFindEntry<T>> {
    try {
      const kv = getKv();
      const { value, versionstamp } = await kv.get<T>([this.collection, id]);
      const ok = !!value;
      return { value, versionstamp, ok };
    } catch (_) {
      return {
        value: null,
        versionstamp: null,
        ok: false,
      };
    }
  }

  /////////////////////////////////////////////////////
  /**
   * Find multiple documents matching the given filter.
   * Pass an empty object to retrieve all documents in the collection.
   *
   * @param filter - Key-value pairs to match.
   * @returns An array of matching documents.
   *
   * @example
   * ```typescript
   * const teens = await users.findMany({ name: "Shoaib Hossain" });
   * const everyone = await users.findMany({});
   *
   * console.log(everyone[0].value)
   * ```
   */
  findMany = (filter: Partial<T>): Promise<EKFindManyEntry<T>[]> =>
    findManyKvEntry<T>(this.collection, filter);

  ////////////////////////////////////////////////////////////////
  /**
   * Check if any document exists matching the given criteria.
   *
   * @param options - Key-value pairs to match.
   * @returns `true` if at least one document exists, otherwise `false`.
   *
   * @example
   * ```typescript
   * const exists = await users.isExist({ name: "SIHAB" });
   * ```
   */
  override async isExist(options: Partial<T>): Promise<boolean> {
    const data = await findManyKvEntry(this.collection, options);
    return data.length !== 0;
  }

  //////////////////////////////////////////////////////////////////
  /**
   * Check if the given criteria is unique (no document exists with the same data).
   *
   * @param option - Key-value pairs to check for uniqueness.
   * @returns `true` if no document exists, otherwise `false`.
   *
   * @example
   * ```typescript
   * const isUnique = await users.isUnique({ email: "shruti@danbo.dn" });
   * ```
   */
  override isUnique = async (option: Partial<T>): Promise<boolean> =>
    !(await this.isExist(option));

  /////////////////////////////////////////////////
  /**
   * Update a document by its `_id` with the provided data.
   *
   * @param id - The unique identifier of the document.
   * @param options - The data to update.
   * @returns The result of the update operation, including old and new data.
   *
   * @example
   * ```typescript
   * await users.updateById("<USER-ID>", { region: "Bangladesh" });
   * ```
   */
  override updateById = async (
    id: Deno.KvKeyPart,
    options: Partial<T>,
  ): Promise<EKUpdateType<T>> =>
    await updateByIdHelper<T>(this.collection, id, options);

  ////////////////////////////////////////////////////////////////
  /**
   * Find the first document matching the filter and update it with the given data.
   * If multiple documents match, only the first is updated.
   *
   * @param filter - Key-value pairs to match.
   * @param updateOptions - Data to update in the matched document.
   * @returns The result of the update operation, including old and new data.
   *
   * @example
   * ```typescript
   * await users.findOneAndUpdate({ name: "MrSIHAB" }, { age: 20 });
   * ```
   */
  override findOneAndUpdate = (
    filter: Partial<T>,
    updateOptions: Partial<T>,
  ): Promise<EKUpdateType<T>> =>
    findOneAndUpdate(this.collection, filter, updateOptions);

  /////////////////////////////////////////////////////
  /**
   * Delete a document by its `_id`.
   *
   * @param id - The unique identifier of the document.
   * @returns An object indicating if the deletion was successful.
   *
   * @example
   * ```typescript
   * await users.delete("<USER-ID>");
   * ```
   */
  override delete = async (id: Deno.KvKeyPart): Promise<{ ok: boolean }> =>
    await deleteEntry(this.collection, id);

  ////////////////////////////////////////////////////////////////
  /**
   * Delete all documents matching the given filter.
   *
   * @param options - Key-value pairs to match for deletion.
   * @returns An object with deletion statistics.
   *
   * @example
   * ```typescript
   * await users.deleteMany({ name: "Shruti" });
   * ```
   */
  override deleteMany = async (
    options: Partial<T>,
  ): Promise<EKDeleteCount> =>
    await deleteManyEntry<T>(this.collection, options);

  ///////////////////////////////////////////////////////////
  /**
   * Delete all documents in the collection.
   * Requires explicit confirmation to prevent accidental data loss.
   *
   * @param confirmation - Object with `wantsToRemoveEveryThingOfThisCollection: true` to confirm.
   * @returns `true` if the collection was deleted, otherwise `false`.
   *
   * @example
   * ```typescript
   * await users.deleteCollection({ wantsToRemoveEveryThingOfThisCollection: true });
   * ```
   */
  override deleteCollection = async (
    confirmation: { wantsToRemoveEveryThingOfThisCollection?: boolean },
  ): Promise<boolean> => {
    if (!confirmation.wantsToRemoveEveryThingOfThisCollection) {
      return false;
    }
    return (await deleteManyEntry(this.collection, {})).ok;
  };
}
