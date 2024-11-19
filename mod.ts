export { Collection } from "./lib/collection.ts";
export { Database } from "./lib/database/db.ts";
export { connect, disconnect, getKv } from "./lib/database/index.ts";
export type {
    EasyKvDataModel,
    EasyKvDeleteCount,
    EasyKvDisconnectKvType,
    EasyKvUpdatType,
} from "./lib/types/index.ts";
