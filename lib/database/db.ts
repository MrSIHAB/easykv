import type { EKDisconnectKvType } from "../types/index.ts";

/**
 *  `Kv` is the main instance of `Deno.openKv()`. In some critical situations,
 * you may need the main intance of database. That time you can access this `kv` from here.
 *
 * While using `EasyKv` library, you don't need to open any database. `EasyKV` will automatically
 * open the Kv database. And the instance can be accessed as `kv`. While calling the `Collection()`
 * class, the openKv get's autometically triggered. So you don't have to make a instance or calling it.
 */
export abstract class Database {
    private static kv: Deno.Kv | null = null;

    public static async connect(path?: string): Promise<boolean> {
        if (Database.kv) {
            console.warn("Already Connected to Database.");
            return false;
        }

        if (path) {
            Database.kv = await Deno.openKv(path);
        } else {
            Database.kv = await Deno.openKv();
        }

        return Database.kv ? true : false;
    }

    public static disconnect(): EKDisconnectKvType {
        if (!Database.kv) {
            return {
                message: "No database is connected",
                ok: false,
            };
        }

        Database.kv?.close();
        Database.kv = null;
        return {
            message: "Database disconnected successfully",
            ok: true,
        };
    }

    public static getKv(): Deno.Kv {
        if (!Database.kv) {
            throw console.error("DataBase is not connected");
        }
        return Database.kv;
    }
}
