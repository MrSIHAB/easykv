import { Database } from "./db.ts";
import type { EKDisconnectKvType } from "../types/index.ts";

/**
 * Connects to the Deno KV database.
 *
 * You usually do not need to call this manually—collections will auto-connect as needed.
 * However, you can use this to explicitly connect or to specify a custom database path.
 *
 * @param path - Optional path to the database file.
 * @returns An object indicating connection status and a message.
 *
 * @example
 * ```typescript
 * import { connect } from "easykv";
 * await connect();
 * ```
 */
export const connect = async (
  path?: string,
): Promise<{ ok: boolean; message: string }> => await Database.connect(path);

/**
 * Disconnects from the Deno KV database and releases resources.
 *
 * You usually do not need to call this manually—collections will auto-disconnect as needed.
 * Use this if you want to explicitly close the database connection.
 *
 * @returns An object indicating disconnect status and a message.
 *
 * @example
 * ```typescript
 * import { disconnect } from "easykv";
 * disconnect();
 * ```
 */
export const disconnect = (): EKDisconnectKvType => Database.disconnect();

/**
 * Returns the current Deno.Kv instance.
 *
 * Throws an error if the database is not connected.
 * This is for advanced use cases; most users should interact with collections instead.
 *
 * @returns The Deno.Kv instance.
 * @throws {Error} If the database is not connected.
 *
 * @example
 * ```typescript
 * import { getKv } from "easykv";
 * const kv = getKv();
 * ```
 */
export const getKv = (): Deno.Kv => Database.getKv;
