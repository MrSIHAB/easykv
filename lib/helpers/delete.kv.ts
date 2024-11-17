import { kv } from "../db.kv.ts";

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
