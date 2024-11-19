import { getKv } from "../database/index.ts";
import type { EasyKvDataModel } from "../types/index.ts";

export const findManyKvEntry = async (
    collection: string,
    filter: EasyKvDataModel,
) => {
    const kv = getKv();
    const result: EasyKvDataModel[] = [];

    for await (const entry of kv.list({ prefix: [collection] })) {
        const data = entry.value as EasyKvDataModel;

        const matches = Object.entries(filter).every(([key, value]) =>
            data[key] === value
        );
        if (matches) result.push(data);
    }

    return result;
};
