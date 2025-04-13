import {getKv} from "../database/index.ts";
import type {EKDataModel} from "../types/index.ts";

export const findManyKvEntry = async <T extends EKDataModel>(
  collection: string,
  filter: EKDataModel,
): Promise<T[]> => {
  const kv = getKv();
  const result: T[] = [];

  for await (const entry of kv.list<T>({ prefix: [collection] })) {
    const data = entry.value;

    const matches = Object.entries(filter).every(([key, value]) =>
      data[key] === value
    );
    if (matches) result.push(data);
  }

  return result;
};
