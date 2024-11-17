/**
 *  `Kv` is the main instance of `Deno.openKv()`. In some critical situations,
 * you may need the main intance of database. That time you can access this `kv` from here.
 *
 * While using `EasyKv` library, you don't need to open any database. `EasyKV` will automatically
 * open the Kv database. And the instance can be accessed as `kv`. While calling the `Collection()`
 * class, the openKv get's autometically triggered. So you don't have to make a instance or calling it.
 */
export const kv: Deno.Kv = await Deno.openKv();
