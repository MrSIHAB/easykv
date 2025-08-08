/**
 * EasyKV - A simple, type-safe ORM for Deno KV.
 *
 * This is the main entry point for the EasyKV package.
 *
 * Example usage:
 * ```typescript
 * import { Collection, connect, disconnect, getKv } from "easykv";
 *
 * interface User extends EKDataModel {
 *   name: string;
 *   age: number;
 * }
 *
 * await connect();
 * const users = new Collection<User>("users");
 * await users.save({ name: "Alice", age: 30 });
 * ```
 */

// Main Collection class for working with entities
export { Collection } from "./lib/collection.ts";

// Database utilities (advanced/optional)
export { Database } from "./lib/database/db.ts";

// Connection helpers for Deno KV
export { connect, disconnect, getKv } from "./lib/database/index.ts";

// Core types for type-safety and advanced use
export type {
    EKDataModel,
    EKDeleteCount,
    EKDisconnectKvType,
    EKFindEntry,
    EKFindManyEntry,
    EKSaveResponse,
    EKUpdateType,
} from "./lib/types/index.ts";
