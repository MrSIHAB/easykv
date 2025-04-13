import { getKv } from "../database/index.ts";
import type { EKDataModel, EKDeleteCount } from "../types/index.ts";
import { findManyKvEntry } from "./findManyEntry.ts";

export const deleteEntry = async (
    collection: string,
    id: Deno.KvKeyPart,
): Promise<boolean> => {
    const kv = getKv();
    try {
        await kv.delete([collection, id]);
        return true;
    } catch (_e) {
        return false;
    }
};

export const deleteManyEntry = async (
    collection: string,
    options: EKDataModel,
): Promise<EKDeleteCount> => {
    const kv = getKv();
    const matchList = await findManyKvEntry(collection, options);

    for await (const entry of matchList) {
        await kv.delete([collection, entry._id as Deno.KvKeyPart]);
    }
    const confirmDeleteation = await findManyKvEntry(collection, options);

    return {
        Ok: confirmDeleteation.length !== 0 ? false : true,
        totalMatches: matchList.length,
        deletedEntry: matchList.length - confirmDeleteation.length,
        leftEntry: confirmDeleteation.length,
    };
};
