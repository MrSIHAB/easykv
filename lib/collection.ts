import { getKv } from "../mod.ts";
import { CollectionMap } from "./collection.abstract.ts";
import { deleteEntry, deleteManyEntry } from "./helpers/delete.kv.ts";
import { findManyKvEntry } from "./helpers/findManyEntry.ts";
import { saveData } from "./helpers/saveData.ts";
import { findOneAndUpdate, updateByIdhelper } from "./helpers/updateData.ts";
import type {
    EasyKvDataModel,
    EasyKvDeleteCount,
    EasyKvFindById,
    EasyKVSaveResponse,
    EasyKvUpdatType,
} from "./types/index.ts";

/**
 * Making a bluprint of Collection Class.
 * This is an `abstract class`. So it can't be called.
 * There are some simple function includeed in this class to do small task. Those function
 * can be `ovveride` later.
 */

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
     * * ###  Save Method
     *
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
     *  value
     * }
     * ```
     */
    override save = async (
        data: EasyKvDataModel,
    ): Promise<EasyKVSaveResponse> => await saveData(data, this.collection);

    /**
     * *  ###   Find an entry by it's `_id`
     *
     * Function takes the `id` of an entry and returns that `entry` with confirmation option `ok` \
     * For example:
     * ```ts
     * const result = await User.findById("150055")
     * const entry = result.value
     *
     * result.value // the entry if found
     * result.ok // wheter oparation was succesfull or not.
     * result.versionstamp // To manage data // auto maintained
     * ```
     *
     * @param id Unique `_id`
     * @returns {ok, versionstamp, value: "You'r queried data"}
     */
    override async findById(
        id: Deno.KvKeyPart,
    ): Promise<EasyKvFindById | null> {
        const kv = getKv();
        const { value, versionstamp } = await kv.get([this.collection, id]);
        const ok = value ? true : false;
        return { value: value as EasyKvDataModel, versionstamp, ok };
    }
    /**
     * * ### Find multiple options by Filtering it
     *
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
     * * ###    Is same data exist?
     * You can pass any criteria in this function's patameter. It will
     * check if any data exist with same criteria or not.
     * Returns true when any data exist. Else false.
     * For Ex:
     * ```ts
     * const criteria = {
     *  name: "Shruti Munde",
     *  age: 17,
     * }
     *
     * const isExist = await User.isExist(criteria)
     * if(isExist){
     *  console.log("User eixst with this criteria.")
     * }
     * ```
     * @param options \{key, value}
     * @returns Promise\<boolean>
     */
    override async isExist(options: EasyKvDataModel): Promise<boolean> {
        const data = await findManyKvEntry(this.collection, options);
        return data.length != 0 ? true : false;
    }
    /**
     * * ###    Is same data exist?
     * You can pass any criteria in this function's patameter. It will
     * check if given data is unique.
     * Returns true when any no data exist and Proved to be unique. Else false.
     * For Ex:
     * ```ts
     * const criteria = {
     *  name: "Shoaib Hossain",
     *  age: 18,
     * }
     *
     * const isUnique = await User.isUnique(criteria)
     * if(!isUnique){
     *  console.log("A data alreasy existeds with same criteria.")
     * }
     * ```
     * @param options \{key, value}
     * @returns Promise\<boolean>
     */
    override isUnique = async (option: EasyKvDataModel): Promise<boolean> =>
        !(await this.isExist(option)); //!  Returning the opposite of isExist()

    /**
     * * ### Update data with it's id
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
    ): Promise<EasyKvUpdatType> =>
        await updateByIdhelper(this.collection, id, options);
    /**
     * * ### Find by filter and Update
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

    /**
     * * ### Delete a entry by it's id.
     * example:
     * ```ts
     * const result = await collection.delete(id)
     * ```
     * @param id
     * @returns boolean(true, false)
     */
    override delete = async (id: Deno.KvKeyPart): Promise<boolean> =>
        await deleteEntry(this.collection, id);

    /**
     * * ### Find the matched entries by the given options and delete them.
     * example:
     * ```ts
     * const matches = {
     *  name: "Shoaib Hossain",
     *  age: "20",
     * }
     *
     * const result = await collection.deleteMany(options)
     * ```
     *
     * @param options \{key: value} // matches
     * @returns \{allOk, totalmatches, deleteEntry, leftEntry}
     */
    override deleteMany = async (
        options: EasyKvDataModel,
    ): Promise<EasyKvDeleteCount> =>
        await deleteManyEntry(this.collection, options);

    override deleteCollection = async (
        confirmation: { wantsToRemoveEveryThingOfThisCollection: boolean },
    ): Promise<boolean> => {
        if (!confirmation.wantsToRemoveEveryThingOfThisCollection) {
            return false;
        }
        return (await deleteManyEntry(this.collection, {})).allOk;
    };
}
