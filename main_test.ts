import {assertEquals} from "@std/assert";
import * as EasyKv from "./mod.ts"; // Making Models

// Making Models
interface dataModel {
  name?: string;
  partner?: string;
  _id?: string | number;
  country?: string;
  favoriteGame?: "NEW STATE Mobile" | "PUBG";
}

//! Connecting Global database
const isConnected = await EasyKv.connect();
Deno.test("Database Connected", function dbConnected() {
  assertEquals(isConnected, true); // * If database is connected successfully
});

//! Creating collection and deleting existing data
const Duo = new EasyKv.Collection<dataModel>("duo");
await Duo.deleteMany({});

//! Demo data model
const testData = {
  name: "Shoaib Hossain",
  partner: "Shruti Munde",
  _id: "150055",
};
//! Saving first entry
const saveResponse = await Duo.save(testData);
Deno.test("Save Data", function saveData() {
  assertEquals(saveResponse.ok, true);
  assertEquals(saveResponse.value, testData);
  assertEquals(typeof saveResponse.versionstamp === "string", true);
});

//! Is exist and is unique?
const isExist = await Duo.isExist({ partner: "Shruti Munde" });
const isUnique = await Duo.isUnique({ name: "Shruti Munde" });
Deno.test("IsExist and IsUnique", function isInDatabase() {
  assertEquals(isExist, true);
  assertEquals(isUnique, true);
});

//! Getting data by id
const getResult = await Duo.findById("150055");

Deno.test("Get single Data", function getData() {
  assertEquals(getResult?.value, testData);
  assertEquals(getResult?.ok, true);
});

//! Getting data by Filtering. Example shows _id. Other criterial are allowed
const getManyResult = await Duo.findMany({ _id: "150055" });
Deno.test("Get multiple data", function getManyData() {
  assertEquals(getManyResult[0], testData);
  assertEquals(getManyResult[0].partner, "Shruti Munde");
});

//! Update option for updating data
const updateOption: dataModel = {
  name: "Shruti Munde",
  country: "Bangladesh",
  favoriteGame: "NEW STATE Mobile",
};
//! Updating data with options
const updateResponse = await Duo.updateById("150055", updateOption);
Deno.test("Update Data", function updateData() {
  assertEquals(updateResponse.dataNew, { ...testData, ...updateOption });
  assertEquals(updateResponse.dataOld, testData);
  assertEquals(updateResponse.ok, true);
});

//! Deleting all available entries
const deleteManyResponse = await Duo.deleteMany({});
Deno.test("Delete many data", function deleteData() {
  assertEquals(deleteManyResponse.Ok, true);
  assertEquals(deleteManyResponse.leftEntry, 0);
  assertEquals(
    deleteManyResponse.deletedEntry,
    deleteManyResponse.totalMatches,
  );
});

//! Disconnecting database connection
const dbDisconnect = await EasyKv.disconnect();
Deno.test("Disconnect Database", function disconnectDB() {
  assertEquals(dbDisconnect.ok, true);
});
