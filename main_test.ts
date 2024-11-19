import { assertEquals } from "@std/assert";
import * as EasyKv from "./mod.ts";

Deno.test(async function database() {
  //! Connecting Global database
  const isConnected = await EasyKv.connect();
  assertEquals(isConnected, true); // * If database is connected successfully

  //! Creating collection and deleting existing datas
  const Duo = new EasyKv.Collection("duo");
  await Duo.deleteMany({});

  //! Demo data model
  const testData: EasyKv.EasyKvDataModel = {
    name: "Shoaib Hossain",
    partner: "Shruti Munde",
    _id: "150055",
  };
  //! Saving first entry
  const saveResponse = await Duo.save(testData);
  assertEquals(saveResponse.ok, true);

  //! Getting data by id
  const getResult = await Duo.findById("150055");
  assertEquals(getResult, testData);

  //! Getting data by Filtering. Example shows _id. Other criterial are allowed
  const getManyResult = await Duo.findMany({ _id: "150055" });
  assertEquals(getManyResult[0], testData);

  //! Update option for updating data
  const updateOption = {
    country: "Bangladesh",
    favoriteGame: "NEW STATE MOBILE",
  };
  //! Updating data with options
  const updateResponse = await Duo.updateById("150055", updateOption);
  assertEquals(updateResponse.dataNew, { ...testData, ...updateOption });

  //! Deleting all avilable entries
  const deleteManyResponse = await Duo.deleteMany({});
  assertEquals(deleteManyResponse.allOk, true);

  //! Disconnecting database connection
  const dbDisconnect = await EasyKv.disconnect();
  assertEquals(dbDisconnect.ok, true);
});
