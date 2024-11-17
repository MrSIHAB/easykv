import { kv } from "../db.kv.ts";
import type { EasyKvDataModel, EasyKvDeleteCount } from "../types/index.ts";
import { findManyKvEntry } from "./findManyEntry.ts";

export const deleteEntry = async (
    collection: string,
    id: Deno.KvKeyPart,
): Promise<boolean> => {
    try {
        await kv.delete([collection, id]);
        return true;
    } catch (_e) {
        return false;
    }
};

export const deleteManyEntry = async (
    collection: string,
    options: EasyKvDataModel,
): Promise<EasyKvDeleteCount> => {
    const matchList = await findManyKvEntry(collection, options);

    for await (const entry of matchList) {
        await kv.delete([collection, entry._id as Deno.KvKeyPart]);
    }
    const confirmDeleteation = await findManyKvEntry(collection, options);

    return {
        allOk: confirmDeleteation.length !== 0 ? false : true,
        totalmatches: matchList.length,
        deletedEntry: matchList.length - confirmDeleteation.length,
        leftEntry: confirmDeleteation.length,
    };
};
