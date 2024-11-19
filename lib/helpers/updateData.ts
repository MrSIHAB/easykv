import { getKv } from "../../mod.ts";
import type { EasyKvDataModel, EasyKvUpdatType } from "../types/index.ts";
import { findManyKvEntry } from "./findManyEntry.ts";

/**
 * Find a specific entry by it's `_id` and update it.
 * @param collection
 * @param id unique _id of each entry
 * @param options {key: value}
 * @returns {ok, versionstamp, dataOld, dataNew}
 */
export const updateByIdhelper = async (
    collection: string,
    id: Deno.KvKeyPart,
    options: EasyKvDataModel,
): Promise<EasyKvUpdatType> => {
    const kv = getKv();
    const previousEntry = await kv.get([collection, id]);

    if (!previousEntry.value) {
        throw new Error(`No data exist with this ID : ${id.toString()}`);
    }

    const dataOld = previousEntry.value as EasyKvDataModel;
    const dataNew = await { ...dataOld, ...options };
    // setting new data
    const { ok, versionstamp } = await kv.set([collection, id], dataNew);

    if (!ok) throw new Error("Something went wrong");

    return {
        ok,
        versionstamp,
        dataNew,
        dataOld,
    };
};

/**
 * This is a helper function to find a specific entry and update it's data.
 * It will return old and new entry both.
 * Made for using in Collection.findOneAndUpdate()
 *
 * @param collection
 * @param filter {key: value}
 * @param updateOptions {key: updatedValue}
 * @returns {ok, versionstamp, dataOld, dataNew}
 */
export const findOneAndUpdate = async (
    collection: string,
    filter: EasyKvDataModel,
    updateOptions: EasyKvDataModel,
): Promise<EasyKvUpdatType> => {
    const kv = getKv();
    const dataOld = (await findManyKvEntry(collection, filter))[0];

    if (!dataOld) throw new Error("No previos data found");

    const dataNew = {
        ...dataOld,
        ...updateOptions,
    };

    const result = await kv.set(
        [collection, dataNew._id as Deno.KvKeyPart],
        dataNew,
    );

    return {
        ...result,
        dataOld,
        dataNew,
    };
};
