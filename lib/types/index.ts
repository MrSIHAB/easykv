/**
 * The base type for all data models stored in EasyKV collections.
 * You can extend this type to define your own entity schemas.
 */
// deno-lint-ignore no-explicit-any
export type EKDataModel = Record<string, any>;

/**
 * The result of a save operation.
 * @template T - The data model type.
 */
export type EKSaveResponse<T extends EKDataModel> = {
  /** Whether the save was successful. */
  ok: boolean;
  /** The versionstamp of the saved entry, or null if not available. */
  versionstamp: string | null;
  /** The unique identifier of the saved entry. */
  id: Deno.KvKeyPart;
};

/**
 * The result of a find-by-ID operation.
 * @template T - The data model type.
 */
export type EKFindEntry<T extends EKDataModel> = {
  /** Whether the entry was found. */
  ok: boolean;
  /** The versionstamp of the entry, or null if not available. */
  versionstamp: string | null;
  /** The found entry, or null if not found. */
  value: T | null;
};

/**
 * The result of a find-many-entry-by-filter operation.
 * @template T - The data model type.
 */
export type EKFindManyEntry<T extends EKDataModel> = {
  value: T;
  versionstamp: string;
};

/**
 * The result of an update operation.
 * @template T - The data model type.
 */
export type EKUpdateType<T extends EKDataModel> = {
  /** Whether the update was successful. */
  ok: boolean;
  /** The versionstamp after the update, or null if not available. */
  versionstamp: string | null;
  /** The unique identifier of the updated entry (optional). */
  id?: Deno.KvKeyPart;
};

/**
 * The result of a delete-many operation.
 */
export type EKDeleteCount = {
  /** Whether the delete operation was successful. */
  ok: boolean;
  /** The total number of entries matched for deletion. */
  total: number;
  /** The number of entries actually deleted. */
  removed: number;
  /** The number of entries left after deletion. */
  left: number;
};

/**
 * The result of a disconnect operation.
 */
export type EKDisconnectKvType = {
  /** A message describing the disconnect result. */
  message: string;
  /** Whether the disconnect was successful. */
  ok: boolean;
};
