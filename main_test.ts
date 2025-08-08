import { assert, assertEquals, assertExists } from "jsr:@std/assert";
import {
  Collection,
  connect,
  disconnect,
  type EKDataModel,
  type EKDeleteCount,
  type EKFindEntry,
  type EKFindManyEntry,
  type EKSaveResponse,
  type EKUpdateType,
  getKv,
} from "./mod.ts";

// Define a test data model
interface User extends EKDataModel {
  name: string;
  age: number;
  email?: string;
  country?: string;
  _id?: string;
}

const TEST_ID = crypto.randomUUID();
const TEST_USER: User = {
  name: "Shoaib Hossain",
  age: 20,
  email: "sihab@danbo.dn",
  country: "Bangladesh",
  _id: TEST_ID,
};

Deno.test("Connect to database", async () => {
  const result = await connect();
  assert(result.ok);

  const disRes = disconnect();
  assert(disRes.ok);
});

Deno.test("Collection: Save new user", async () => {
  await connect();
  const users = new Collection<User>("users");
  const res: EKSaveResponse<User> = await users.save(TEST_USER);

  assert(res.ok);
  assertExists(res.id);
  assert(typeof res.versionstamp === "string" || res.versionstamp === null);
  disconnect();
});

Deno.test("Collection: Find by ID", async () => {
  await connect();
  const users = new Collection<User>("users");
  const res: EKFindEntry<User> = await users.findById(TEST_ID);

  assert(res.ok);
  assertEquals(res.value?.name, "Shoaib Hossain");
  assertEquals(res.value?.age, 20);
  disconnect();
});

Deno.test("Collection: Find many users", async () => {
  await connect();
  const users = new Collection<User>("users");
  const many: EKFindManyEntry<User>[] = await users.findMany({
    name: "Shoaib Hossain",
  });

  assert(Array.isArray(many));
  assert(many.some((u) => u.value._id === TEST_ID));
  disconnect();
});

Deno.test("Collection: isExist and isUnique", async () => {
  await connect();
  const users = new Collection<User>("users");
  const exists = await users.isExist({ email: "sihab@danbo.dn" });
  const unique = await users.isUnique({ email: "shruti@danbo.dn" });

  assertEquals(exists, true);
  assertEquals(unique, true);
  disconnect();
});

Deno.test("Collection: Update by ID", async () => {
  await connect();
  const users = new Collection<User>("users");
  const update: Partial<User> = { name: "Shruti Munde", country: "IN" };
  const res = await users.updateById(TEST_ID, update);
  assert(res.ok);
  // Optionally, check the updated value
  const after = await users.findById(TEST_ID);
  assertEquals(after.value?.name, "Shruti Munde");
  assertEquals(after.value?.country, "IN");
  disconnect();
});

Deno.test("Collection: findOneAndUpdate", async () => {
  await connect();
  const users = new Collection<User>("users");
  const res: EKUpdateType<User> = await users.findOneAndUpdate({
    name: "Shruti Munde",
  }, {
    email: "shruti@danbo.dn",
  });
  assert(res.ok);
  const after = await users.findById(TEST_ID);
  assertEquals(after.value?.email, "shruti@danbo.dn");
  disconnect();
});

Deno.test("Collection: Delete by ID", async () => {
  await connect();
  const users = new Collection<User>("users");
  const res = await users.delete(TEST_ID);
  assert(res.ok);
  const after = await users.findById(TEST_ID);
  assertEquals(after.ok, false);
  disconnect();
});

Deno.test("Collection: Save multiple and deleteMany", async () => {
  await connect();
  const users = new Collection<User>("users");
  // Save multiple users
  await users.save({ name: "Shoaib", age: 18, _id: "shoaib" });
  await users.save({ name: "Shruti", age: 18, _id: "shruti" });

  // Delete all users with age 22
  const delRes: EKDeleteCount = await users.deleteMany({ age: 18 });
  assert(delRes.ok);
  assertEquals(delRes.left, 0);
  disconnect();
});

Deno.test("Collection: Delete entire collection", async () => {
  await connect();
  const users = new Collection<User>("users");
  // Save a user to ensure collection is not empty
  await users.save({ name: "Darkness", age: 1, _id: "dn" });
  const deleted = await users.deleteCollection({
    wantsToRemoveEveryThingOfThisCollection: true,
  });
  assert(deleted);
  const all = await users.findMany({});
  assertEquals(all.values.length, 0);
  disconnect();
});

Deno.test("Get database kv", async () => {
  await connect();
  const kv = getKv();
  assert(kv);
  disconnect();
});

Deno.test("Disconnect from database", async () => {
  await connect();
  const res = disconnect();
  assert(res.ok);
});
