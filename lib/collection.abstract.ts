import type {
    EasyKvDataModel,
    EasyKvDeleteCount,
    EasyKvUpdatType,
} from "../mod.ts";
import type { EasyKvFindById, EasyKVSaveResponse } from "./types/index.ts";

export abstract class CollectionMap {
    constructor(public collection: string) {
    }

    abstract save(data: EasyKvDataModel): Promise<EasyKVSaveResponse>;
    abstract findById(
        id: Deno.KvKeyPart,
    ): Promise<EasyKvFindById | null>;
    abstract findMany(
        filter: Record<string, unknown>,
    ): Promise<EasyKvDataModel[]>;
    abstract isExist(options: EasyKvDataModel): Promise<boolean>;
    abstract isUnique(option: EasyKvDataModel): Promise<boolean>;
    abstract updateById(
        id: Deno.KvKeyPart,
        options: EasyKvDataModel,
    ): Promise<EasyKvDataModel>;
    abstract findOneAndUpdate(
        filter: EasyKvDataModel,
        updateOptions: EasyKvDataModel,
    ): Promise<EasyKvUpdatType>;
    abstract delete(id: Deno.KvKeyPart): Promise<boolean>;
    abstract deleteMany(options: EasyKvDataModel): Promise<EasyKvDeleteCount>;
    abstract deleteCollection(
        confirmation: { wantsToRemoveEveryThingOfThisCollection: boolean },
    ): Promise<boolean>;

    // todo: Update Many
    // todo: Delete Data
    // todo: Delete Collection
    // todo: on event
    // todo: watch
}
