import { assertEquals } from "@std/assert";
import * as EasyKv from "./mod.ts";

//! Connecting Global database
const isConnected = await EasyKv.connect();
Deno.test(function dbConnected() {
  assertEquals(isConnected, true); // * If database is connected successfully
});

//! Creating collection and deleting existing datas
const Duo = new EasyKv.Collection("duo");
await Duo.deleteMany({});

//! Demo data model
const testData = {
  name: "Shoaib Hossain",
  partner: "Shruti Munde",
  _id: "150055",
};
//! Saving first entry
const saveResponse = await Duo.save(testData);
Deno.test(function saveData() {
  assertEquals(saveResponse.ok, true);
  assertEquals(saveResponse.value, testData);
  assertEquals(typeof saveResponse.versionstamp === "string", true);
});

//! Is exist and is unique?
const isExist = await Duo.isExist({ partner: "Shruti Munde" });
const isUnique = await Duo.isUnique({ name: "Shruti Munde" });
Deno.test(function isInDatabase() {
  assertEquals(isExist, true);
  assertEquals(isUnique, true);
});

//! Getting data by id
const getResult = await Duo.findById("150055");

Deno.test(function getData() {
  assertEquals(getResult?.value, testData);
  assertEquals(getResult?.ok, true);
});

//! Getting data by Filtering. Example shows _id. Other criterial are allowed
const getManyResult = await Duo.findMany({ _id: "150055" });
Deno.test(function getManyData() {
  assertEquals(getManyResult[0], testData);
  assertEquals(getManyResult[0].partner, "Shruti Munde");
});

//! Update option for updating data
const updateOption = {
  country: "Bangladesh",
  favoriteGame: "NEW STATE MOBILE",
};
//! Updating data with options
const updateResponse = await Duo.updateById("150055", updateOption);
Deno.test(function updateData() {
  assertEquals(updateResponse.dataNew, { ...testData, ...updateOption });
  assertEquals(updateResponse.dataOld, testData);
  assertEquals(updateResponse.ok, true);
});

//! Deleting all avilable entries
const deleteManyResponse = await Duo.deleteMany({});
Deno.test(function deleteData() {
  assertEquals(deleteManyResponse.allOk, true);
  assertEquals(deleteManyResponse.leftEntry, 0);
  assertEquals(
    deleteManyResponse.deletedEntry,
    deleteManyResponse.totalmatches,
  );
});

//! Disconnecting database connection
const dbDisconnect = await EasyKv.disconnect();
Deno.test(function disconnectDB() {
  assertEquals(dbDisconnect.ok, true);
});
