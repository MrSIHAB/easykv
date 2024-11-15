import { assertEquals } from "@std/assert";
import { Collection } from "./mod.ts";

const collection = new Collection("collection");
async function isUserSaved(obj: object) {
  const res = await collection.save(obj);
  return {
    ok: res.ok,
    name: res.data.name,
  };
}

// set values
Deno.test(async function setCollection() {
  assertEquals(await isUserSaved({ name: "shruti munde" }), {
    ok: true,
    name: "shruti munde",
  });
});

// get value
Deno.test(async function getCollectin() {
  assertEquals(
    (await collection.findMany({ name: "shruti munde" }))[0].name,
    "shruti munde",
  );
});
