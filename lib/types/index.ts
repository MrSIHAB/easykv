// export type EKDataModel = { [key: string]: unknown };
export type EKDataModel = Record<string, any>;
export type EKSaveResponse<T extends EKDataModel> = {
  ok: boolean;
  versionstamp: string | null;
  value: T;
};

export type EKFindById<T extends EKDataModel> = {
  ok: boolean;
  versionstamp: string | null;
  value: T | null;
  message?: string;
};

export type EKUpdateType<T extends EKDataModel> = {
  ok: boolean;
  versionstamp: string | null;
  dataOld: EKDataModel | null;
  dataNew: T | null;
};
export type EKDeleteCount = {
  Ok: boolean;
  totalMatches: number;
  deletedEntry: number;
  leftEntry: number;
};
export type EKDisconnectKvType = {
  message: string;
  ok: boolean;
};
