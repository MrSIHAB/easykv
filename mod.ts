import { Collection } from "./lib/collection.ts";
export { Collection } from "./lib/collection.ts";

/**
 *  Main Database. Don't use it untill it's very essential.
 */
export const kv: Deno.Kv = await Deno.openKv();

export default { Collection, kv };
