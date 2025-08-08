import type { EKDisconnectKvType } from "../types/index.ts";

/**
 * The `Database` class manages the main Deno KV instance for EasyKV.
 *
 * - You do not need to manually open or close the database when using EasyKV.
 * - The database connection is handled automatically when you use the `Collection` class.
 * - You can use this class to manually connect, disconnect, or access the underlying KV instance if needed.
 */
export abstract class Database {
    /** Holds the singleton Deno.Kv instance. */
    private static kv: Deno.Kv | null = null;

    /**
     * Connects to the Deno KV database.
     * If already connected, does nothing and returns a warning.
     *
     * @param path - Optional path to the database file.
     * @returns An object indicating connection status and a message.
     *
     * @example
     * ```typescript
     * await Database.connect();
     * ```
     */
    public static async connect(
        path?: string,
    ): Promise<{ ok: boolean; message: string }> {
        if (Database.kv) {
            console.warn("Already Connected to Database.");
            return {
                ok: false,
                message: "Already connected to the Database",
            };
        }

        Database.kv = await Deno.openKv(path);
        return {
            ok: Database.kv !== null,
            message: "Database connected successfully!",
        };
    }

    /**
     * Disconnects from the Deno KV database and releases resources.
     *
     * @returns An object indicating disconnect status and a message.
     *
     * @example
     * ```typescript
     * Database.disconnect();
     * ```
     */
    public static disconnect(): EKDisconnectKvType {
        Database.kv?.close();
        Database.kv = null;
        return {
            message: "Database disconnected successfully",
            ok: true,
        };
    }

    /**
     * Returns the current Deno.Kv instance.
     * Throws an error if the database is not connected.
     *
     * @returns The Deno.Kv instance.
     * @throws {Error} If the database is not connected.
     *
     * @example
     * ```typescript
     * const kv = Database.getKv;
     * ```
     */
    public static get getKv(): Deno.Kv {
        if (!Database.kv) {
            throw new Error("DataBase is not connected");
        }
        return Database.kv;
    }
}
