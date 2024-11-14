import { kv } from "../mod.ts";
import type { FilterCriteria, Model } from "./types/index.ts";

abstract class CollectionMap {
    constructor(public collection: string) {
    }

    public async findById(id: Deno.KvKeyPart): Promise<Model | null> {
        return (await kv.get([this.collection, id])).value as Model;
    }

    abstract save(data: Record<string, unknown>): Promise<object>;
    abstract findMany(
        filter: Record<string, unknown>,
    ): Promise<Model[]>;

    //todo: More options to be include
    // todo: Update Data
    // todo: Update Many
    // todo: Delete Data
    // todo: Delete Entry
    // todo: Delete Collection
    // todo: Delete Many
    // todo: on event
    // todo: watch
    // todo: is Exist
    // todo: is Unique
}

export class Collection extends CollectionMap {
    constructor(collection: string) {
        super(collection);
        this.collection = collection;
    }

    /**
     * This function saves data(object) to denoKv database.
     * one example :
     * ```typescript
     *  collection.save({key: "value", key2: "value2"})
     * ```
     * To spacify uniqueness of every entry, You can include a `_id` key to the given object.
     * If you don't, `easyKv` will autometically create a unique `_id`.
     * @param data
     * @returns What does it return?
     * ```typescript
     * returns {
     *  ok: boolean,
     *  versionstamp: string
     *  givenData
     * }
     * ```
     */
    // deno-lint-ignore no-explicit-any
    async save(data: Record<string, any>): Promise<Record<string, any>> {
        /**
         * If `_id` exist in given object, validating existing datas.
         * So that two same id don't collaps
         */
        if (data._id) {
            const existingData = await kv.get([this.collection, data._id]);
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
        const existingData = await kv.get([this.collection, _id]);
        if (existingData.value) {
            return this.save(data);
        }

        const result = await kv.set([this.collection, _id], { ...data, _id });
        //? to validate if it is success
        const savedData = await kv.get([this.collection, _id]);

        return {
            ok: result.ok,
            versionstamp: result.versionstamp,
            data: savedData.value,
        };
    }

    /**
     * Get a list of filtered data. Pass some `options` to this function and it will fillter all matched data
     *
     * Leave a empty object `{}` to get all data of this collection.
     * An example is:
     * ```typescript
     *  collection.findMan({name: "Shruti Munde"}) :
     * ```
     * @param filter Record<string, any>
     * @returns Record<string, any>
     */
    async findMany(
        filter: FilterCriteria,
    ): Promise<Model[]> {
        const result: Model[] = [];

        for await (const entry of kv.list({ prefix: [this.collection] })) {
            const data = entry.value as Model;

            const matches = Object.entries(filter).every(([key, value]) =>
                data[key] === value
            );
            if (matches) result.push(data);
        }

        return result;
    }
}
