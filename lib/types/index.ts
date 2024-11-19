export type EasyKvDataModel = { [key: string]: unknown };
export type EasyKVSaveResponse = {
    ok: boolean;
    versionstamp: string | null;
    value: EasyKvDataModel;
};
export type EasyKvFindById = {
    ok: boolean;
    versionstamp: string | null;
    value: EasyKvDataModel;
};
export type EasyKvUpdatType = {
    ok: boolean;
    versionstamp: unknown;
    dataOld: EasyKvDataModel;
    dataNew: EasyKvDataModel;
};
export type EasyKvDeleteCount = {
    allOk: boolean;
    totalmatches: number;
    deletedEntry: number;
    leftEntry: number;
};
export type EasyKvDisconnectKvType = {
    message: string;
    ok: boolean;
};
