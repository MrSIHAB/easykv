import type { EKDataModel, EKDeleteCount, EKUpdateType } from "../mod.ts";
import type {
  EKFindEntry,
  EKFindManyEntry,
  EKSaveResponse,
} from "./types/index.ts";

/**
 * Abstract base class for all collections in EasyKV.
 *
 * Defines the contract for CRUD and query operations that every collection must implement.
 * This enables consistent API and type safety for all entity collections.
 *
 * @typeParam T - The data model type for this collection.
 */
export abstract class CollectionMap<T extends EKDataModel> {
  /**
   * The name of the collection (namespace).
   */
  protected constructor(public collection: string) {
  }

  /**
   * Save a new document to the collection.
   * @param data - The data object to save.
   * @returns The result of the save operation.
   */
  abstract save(data: T): Promise<EKSaveResponse<T>>;

  /**
   * Find a document by its unique `_id`.
   * @param id - The unique identifier of the document.
   * @returns The found document, versionstamp, and status.
   */
  abstract findById(id: Deno.KvKeyPart): Promise<EKFindEntry<T>>; //todo:

  /**
   * Find multiple documents matching the given filter.
   * @param filter - Key-value pairs to match.
   * @returns An array of matching documents.
   */
  abstract findMany(filter: Partial<T>): Promise<EKFindManyEntry<T>[]>;

  /**
   * Check if any document exists matching the given criteria.
   * @param options - Key-value pairs to match.
   * @returns `true` if at least one document exists, otherwise `false`.
   */
  abstract isExist(options: Partial<T>): Promise<boolean>;

  /**
   * Check if the given criteria is unique (no document exists with the same data).
   * @param option - Key-value pairs to check for uniqueness.
   * @returns `true` if no document exists, otherwise `false`.
   */
  abstract isUnique(option: Partial<T>): Promise<boolean>;

  /**
   * Update a document by its `_id` with the provided data.
   * @param id - The unique identifier of the document.
   * @param options - The data to update.
   * @returns The result of the update operation.
   */
  abstract updateById(
    id: Deno.KvKeyPart,
    options: Partial<T>,
  ): Promise<EKUpdateType<T>>;

  /**
   * Find the first document matching the filter and update it with the given data.
   * @param filter - Key-value pairs to match.
   * @param updateOptions - Data to update in the matched document.
   * @returns The result of the update operation.
   */
  abstract findOneAndUpdate(
    filter: Partial<T>,
    updateOptions: Partial<T>,
  ): Promise<EKUpdateType<T>>;

  /**
   * Delete a document by its `_id`.
   * @param id - The unique identifier of the document.
   * @returns An object indicating if the deletion was successful.
   */
  abstract delete(id: Deno.KvKeyPart): Promise<{ ok: boolean }>;

  /**
   * Delete all documents matching the given filter.
   * @param options - Key-value pairs to match for deletion.
   * @returns An object with deletion statistics.
   */
  abstract deleteMany(options: Partial<T>): Promise<EKDeleteCount>;

  /**
   * Delete all documents in the collection.
   * Requires explicit confirmation to prevent accidental data loss.
   * @param confirmation - Object with `wantsToRemoveEveryThingOfThisCollection: true` to confirm.
   * @returns `true` if the collection was deleted, otherwise `false`.
   */
  abstract deleteCollection(
    confirmation: { wantsToRemoveEveryThingOfThisCollection: boolean },
  ): Promise<boolean>;

  // todo: Update Many
  // todo: Delete Data
  // todo: Delete Collection
  // todo: on event
  // todo: watch
}
