import { kv } from "../../mod.ts";
import type { KeyValue } from "../types/index.ts";

export const updateOnehelper = async (
    collection: string,
    id: Deno.KvKeyPart,
    options: KeyValue,
): Promise<KeyValue> => {
    const previousEntry = await kv.get([collection, id]);

    if (!previousEntry.value) {
        throw new Error(`No data exist with this ID : ${id.toString()}`);
    }

    const previousData = previousEntry.value as KeyValue;
    const newData = await { ...previousData, ...options };
    // setting new data
    const { ok, versionstamp } = await kv.set([collection, id], newData);
    const updatedData = await kv.get([collection, id]);

    return {
        ok,
        versionstamp,
        updatedData,
    };
};
