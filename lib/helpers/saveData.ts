import { kv } from "../../mod.ts";

export const saveData = async (
    data: Record<string, any>,
    collection: string,
): Promise<Record<string, any>> => {
    /**
     * If `_id` exist in given object, validating existing datas.
     * So that two same id don't collaps
     */
    if (data._id) {
        const existingData = await kv.get([collection, data._id]);
        if (existingData.value) {
            /**
             * if data with same _id exist, Throwing an error.
             * Package user will handle it.
             */
            throw new Error(
                ` 
                Cannot save data with this ${data._id}
                Some data with this id: "${data._id}" already exist in database.
                `,
            );
        }
    }
    // if _id don't collaps ........

    // If _id dosen't exist, create random one */
    const _id = await data._id || crypto.randomUUID();

    /**
     * If `crypto.randomUUID()` generates a existing `UUID`, it will retry this function
     */
    const existingData = await kv.get([collection, _id]);
    if (existingData.value) {
        return saveData(data, collection);
    }

    const result = await kv.set([collection, _id], { ...data, _id });
    //? to validate if it is success
    const savedData = await kv.get([collection, _id]);

    return {
        ok: result.ok,
        versionstamp: result.versionstamp,
        data: savedData.value,
    };
};
