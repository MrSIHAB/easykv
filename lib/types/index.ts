export type EasyKvDataModel = { [key: string]: unknown };
export type EasyKvUpdatType = {
    ok: boolean;
    versionstamp: unknown;
    dataOld: EasyKvDataModel;
    dataNew: EasyKvDataModel;
};
