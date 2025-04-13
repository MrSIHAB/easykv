import {getKv} from "../../mod.ts";
import type {EKDataModel, EKUpdateType} from "../types/index.ts";
import {findManyKvEntry} from "./findManyEntry.ts";

/**
 * Find a specific entry by it's `_id` and update it.
 * @param collection
 * @param id unique _id of each entry
 * @param options {key: value}
 * @returns {ok, versionstamp, dataOld, dataNew}
 */
export const updateByIdHelper = async <T extends EKDataModel>(
  collection: string,
  id: Deno.KvKeyPart,
  options: EKDataModel,
): Promise<EKUpdateType<T>> => {
  const kv = getKv();
  const previousEntry = await kv.get<T>([collection, id]);

  if (!previousEntry.value) {
    return {
      ok: false,
      versionstamp: null,
      dataNew: null,
      dataOld: null,
    };
  }

  const dataOld: T = previousEntry.value;
  let dataNew: T = { ...dataOld, ...options };
  // setting new data
  const { ok, versionstamp } = await kv.set([collection, id], dataNew);

  if (!ok) {
    throw new Error(
      "Something went wrong. Could not update data. Please check database connection and try again.",
    );
  }

  const updatedEntry = await (kv.get<T>([collection, id]));
  if (!updatedEntry.value) {
    throw new Error(
      "Something went wrong. Could not find Updated data.",
    );
  }
  dataNew = updatedEntry.value;

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
export const findOneAndUpdate = async <T extends EKDataModel>(
  collection: string,
  filter: EKDataModel,
  updateOptions: T,
): Promise<EKUpdateType<T>> => {
  const kv = getKv();
  const dataOld = (await findManyKvEntry(collection, filter))[0];

  if (!dataOld) throw new Error("No previous data found");

  const dataNew: T = {
    ...dataOld,
    ...updateOptions,
  };

  const result = await kv.set(
    [collection, dataNew._id as Deno.KvKeyPart],
    dataNew,
  );

  return {
    ok: result.ok,
    versionstamp: result.versionstamp,
    dataOld,
    dataNew,
  };
};
