export type EasyKvDataModel = { [key: string]: unknown };
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
