import { kv } from "../mod.ts";
import { deleteEntry } from "./helpers/delete.kv.ts";
import { findManyKvEntry } from "./helpers/findManyEntry.ts";
import { saveData } from "./helpers/saveData.ts";
import { findOneAndUpdate, updateByIdhelper } from "./helpers/updateData.ts";
import type { EasyKvDataModel, EasyKvUpdatType } from "./types/index.ts";

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
    public async findById(id: Deno.KvKeyPart): Promise<EasyKvDataModel | null> {
        return (await kv.get([this.collection, id])).value as EasyKvDataModel;
    }

    // Save something to the database
    abstract save(data: Record<string, unknown>): Promise<object>;
    // Get a list of data or array of data object by filtering it
    // If fillter option is null array, It will return all data of this collection
    abstract findMany(
        filter: Record<string, unknown>,
    ): Promise<EasyKvDataModel[]>;

    // Get a Entry by it's ID and update it with given options
    abstract updateById(
        id: Deno.KvKeyPart,
        options: EasyKvDataModel,
    ): Promise<EasyKvDataModel>;

    abstract findOneAndUpdate(
        filter: EasyKvDataModel,
        updateOptions: EasyKvDataModel,
    ): Promise<EasyKvUpdatType>;
    // todo: Update Many
    // todo: is Exist
    // todo: is Unique
    // todo: Delete Data
    abstract delete(id: Deno.KvKeyPart): Promise<boolean>;
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
 * all keys stored under this collection. Collections in EasyKV act like EasyKvDataModels in
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
    findMany = async (
        filter: EasyKvDataModel,
    ): Promise<EasyKvDataModel[]> =>
        await findManyKvEntry(this.collection, filter);

    /**
     * ### Update data with it's id
     * Example:
     * ```typescript
     * const updateOptions = {
     *  name: "SIHAB", // Previously "Shoaib Hossain"
     *  dn: "Danbo" // Previously something else
     * }
     *
     * const result = await collection.updateById(id, updateOptions)
     * const oldData = result.dataOld
     * const newData = result.dataNew
     * ```
     *
     * @param id : The unique identifier `_id`
     * @param options : The data you wants to update
     * @returns `ok`, `versionstamp`, `updatedData`
     */
    override updateById = async (
        id: Deno.KvKeyPart,
        options: EasyKvDataModel,
    ): Promise<EasyKvDataModel> =>
        await updateByIdhelper(this.collection, id, options);
    /**
     * ### Find by filter and Update
     *
     * example:
     * ```ts
     * const result = await collection.findOneAndUpdate(filter, updateOptions)
     *
     * const { ok, versionstamp, dataOld, dataNew } = result;
     *
     * console.log(ok)
     * console.log(versionstamp)
     * console.log(dataOld)
     * console.log(dataNew)
     * ```
     * This function helps to find a specific entry and update it with given options
     * If multiple entries found, it will update the first entry.
     *
     * @param filter {key: value}
     * @param updateOptions {key: updatedValue}
     * @returns {ok, versionstamp, dataOld, dataNew}
     */
    override findOneAndUpdate = async (
        filter: EasyKvDataModel,
        updateOptions: EasyKvDataModel,
    ): Promise<EasyKvUpdatType> =>
        await findOneAndUpdate(this.collection, filter, updateOptions);
    override delete = async (id: Deno.KvKeyPart): Promise<boolean> =>
        await deleteEntry(this.collection, id);
}
