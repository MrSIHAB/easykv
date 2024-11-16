import { kv } from "../mod.ts";
import { saveData } from "./helpers/saveData.ts";
import { updateOnehelper } from "./helpers/updateData.ts";
import type { FilterCriteria, KeyValue, Model } from "./types/index.ts";

/**
 * Making a bluprint of Collection Class.
 * This is an `abstract class`. So it can't be called.
 * There are some simple function includeed in this class to do small task. Those function
 * can be `ovveride` later.
 */
abstract class CollectionMap {
    constructor(public collection: string) {
    }

    // find a data from database with a particuler Id
    public async findById(id: Deno.KvKeyPart): Promise<Model | null> {
        return (await kv.get([this.collection, id])).value as Model;
    }

    // Save something to the database
    abstract save(data: Record<string, unknown>): Promise<object>;
    // Get a list of data or array of data object by filtering it
    // If fillter option is null array, It will return all data of this collection
    abstract findMany(
        filter: Record<string, unknown>,
    ): Promise<Model[]>;

    // Get a Entry by it's ID and update it with given options
    abstract updateOne(
        id: Deno.KvKeyPart,
        options: KeyValue,
    ): Promise<KeyValue>;

    // todo: Update Many
    // todo: is Exist
    // todo: is Unique
    // todo: Delete Data
    // todo: Delete Entry
    // todo: Delete Collection
    // todo: Delete Many
    // todo: on event
    // todo: watch
}

/**
 * Example:
 *
 * ```typescript
 * const collectionName = new Collection("collection-name")
 * ```
 *
 * Deno KV
 * supports hierarchical keys, and EasyKV uses the first key as the collection
 * name. For instance, the string `"user"` passed in the parameter creates a
 * collection called `user` in the database. This acts as the base namespace for
 * all keys stored under this collection. Collections in EasyKV act like models in
 * traditional ORMs (e.g., Mongoose). They group related data under a common
 * namespace, enabling you to manage users, products, or other entities in an
 * organized way.
 */
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
    save = async (data: Record<string, any>): Promise<Record<string, any>> =>
        await saveData(data, this.collection);

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

    /**
     * ### Update data with it's id
     * Example:
     * ```typescript
     * const updateOptions = {
     *  name: "SIHAB", // Previously "Shoaib Hossain"
     *  dn: "Danbo" // Previously something else
     * }
     *
     * const result = await collection.updateOne(id, updateOptions)
     * const newData = result.updatedData
     * ```
     *
     * @param id : The unique identifier `_id`
     * @param options : The data you wants to update
     * @returns `ok`, `versionstamp`, `updatedData`
     */
    override updateOne = async (
        id: Deno.KvKeyPart,
        options: KeyValue,
    ): Promise<KeyValue> => await updateOnehelper(this.collection, id, options);
}
