import type {EKDataModel, EKDeleteCount, EKUpdateType} from "../mod.ts";
import type {EKFindById, EKSaveResponse} from "./types/index.ts";

export abstract class CollectionMap<T extends EKDataModel> {
  protected constructor(public collection: string) {
  }

  abstract save(data: T): Promise<EKSaveResponse<T>>;
  abstract findById(id: Deno.KvKeyPart): Promise<EKFindById<T>>;
  abstract findMany(filter: Record<string, unknown>): Promise<T[]>;
  abstract isExist(options: T): Promise<boolean>;
  abstract isUnique(option: T): Promise<boolean>;
  abstract updateById<S>(
    id: Deno.KvKeyPart,
    options: EKDataModel,
  ): Promise<EKUpdateType<T>>;
  abstract findOneAndUpdate(
    filter: EKDataModel,
    updateOptions: EKDataModel,
  ): Promise<EKUpdateType<T>>;
  abstract delete(id: Deno.KvKeyPart): Promise<boolean>;
  abstract deleteMany(options: EKDataModel): Promise<EKDeleteCount>;
  abstract deleteCollection(
    confirmation: { wantsToRemoveEveryThingOfThisCollection: boolean },
  ): Promise<boolean>;

  // todo: Update Many
  // todo: Delete Data
  // todo: Delete Collection
  // todo: on event
  // todo: watch
}
