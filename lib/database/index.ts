import {Database} from "./db.ts";
import type {EKDisconnectKvType} from "../types/index.ts";

export const connect = async (path?: string): Promise<boolean> => {
  if (path) {
    return await Database.connect(path);
  } else {
    return await Database.connect();
  }
};
export const disconnect = async (): Promise<EKDisconnectKvType> =>
  await Database.disconnect();
export const getKv = (): Deno.Kv => Database.getKv();
