import { Database } from "../../mod.ts";
import type { EasyKvDisconnectKvType } from "../types/index.ts";

export const connect = async (path?: string): Promise<boolean> => {
    if (path) {
        return await Database.connect(path);
    } else {
        return await Database.connect();
    }
};
export const disconnect = async (): Promise<EasyKvDisconnectKvType> =>
    await Database.disconnect();
export const getKv = (): Deno.Kv => Database.getKv();
