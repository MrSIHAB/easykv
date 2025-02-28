<div align="center">

# EasyKV

## By MrSIHAB

A lightweight and flexible library that let you use DenoKv easily.

[![Lib Version](https://img.shields.io/badge/Version-v0.2.0-0cb)](https://jsr.io/@easykv/easykv)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/MrSIHAB/EasyKV/blob/main/LICENSE)
[![Deno Version](https://img.shields.io/badge/Deno-2.0-white)](https://deno.com)

<a href="https://www.buymeacoffee.com/mrsihab"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=mrsihab&button_colour=00DFDF&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>

<!-- [![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](#) -->

</div>

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [Saving Data](#save-some-data-to-the-database)
  - [Querying Data](#get-data-from-the-database)
  - [update Data](#update-data-by-id)
  - [Delete Entry](#delete-an-entry)
- [Contributing](#contributing)
- [License](#license)

<!-- - [Features](#features) -->

## Intruduction

EasyKV is a high-level abstraction layer for Deno's built-in KV (Key-Value)
database. It simplifies working with Deno KV, making it easier and more
efficient to use. Whether you're new to Deno KV or planning to use it in
large-scale applications, EasyKV provides the tools to streamline your workflow.

With EasyKV, you can:

- Easily interact with Deno KV.
- Save, update, and delete data effortlessly.
- Query, filter, and manage data with ease.
- Retrieve multiple records simultaneously using flexible filters.

## Quick Start

```js
/*
This is an example of EasyKv with Hono framework.
Note: EasyKv is not dependent to any frameworks. It's directly made with Deno's core
elements. So, it will work with any deno environment.
*/

import * as EasyKV from 'jsr:@easykv/easykv'
import { Hono } from 'jsr:@hono/hono'

const app = new Hono(); // Initializing handler app 
await easyKv.connect("/db") // Connecting Database to specific path or URL
const UserCollection = await new EasyKv.Collection("user") // Creating new user collection

// Listening /user route
app.get("/user", async (context)=> {
const { name, age, hobby } = c.req.body; // Getting data from frontend
const user = { _id: 1, name, age, hobby }; // making User object
await UserCollection.save(user); // Saving user to database
})

Deno.serve(app)// Listening app
```

## Database Structure

DenoKv's multiple key system unlocks the flexibility of databse. This can follow
multiple structure like SQL, NoSQl, TreeShape etc. This EasyKv library is highly
inspired by mongoose. The Structure I made for this is:

- **Database**: The main database. You can specify the database location by
  `EasyVk.connect(location)` [Reference=>](#connect-database)
- **Collection**: The collection is the main and most used class of this
  library. Collection is a group. A group where you gonna save all similar types
  of entries. For example: A `User` collection contains all user's data. A
  collection works like a _**model**_ of other orms(e.g. Mongoose).
  [Reference=>](#create-a-collection)
- **Enrty**: After creating a collection, you can save data as `JSON` or
  `Object{}` format. Each `object` which is being saved is called `entry`.
- **Data**: The information an `entry` contains is called `data`.

```bash
Database      
       |--- Collections
       |    |---------- Entry
       |    |           |------ Key: value
       |    |           |------ Key: value
       |    |           |------ Key: value
       |    |           
       |    |           
       |    |---------- Entry
       |                |------ Key: value
       |                |------ Key: value
       |                |------ Key: value
       |                
       |--- Collections
       |    |---------- Entry
       |    |           |------ Key: value
       |    |           |------ Key: value
       |    |           |------ Key: value
       |    |           
       |    |---------- Entry
       |    |           |------ Key: value
       |    |           |------ Key: value
       |    |           |------ Key: value
       |    |           
       |    |---------- Entry
       |                |------ Key: value
       |                |------ Key: value
       |                |------ Key: value
```

## Installation

EasyKV is designed exclusively for Deno to simplify working with its built-in KV
(Key-Value) database. Follow these steps to install and start using EasyKV in
your project:

#### Prerequisites

- Deno v2.0 or higher is recommended.

### Install via Deno Official Repository

Run the following command in your terminal to add EasyKv to your project:

```console
deno add easykv
```

### Install via JSR

Run the following command in your terminal to add EasyKV to your project:

```console
deno add jsr:@easykv/easykv
```

### Import Directly

Alternatively, you can directly import EasyKV into your project:

```typescript
import * as easykv from "jsr:@easykv/easykv";
// Or...
import * as easykv from "https://deno.land/x/easykv";
```


## API Reference

- [Database](#connect-database)
  - [Collection](#create-a-collection)
    - [Save data](#save-some-data-to-the-database)
    - [Get Data](#get-data-from-the-database)
    - [Search or Filter Data](#search-or-filter-data)
    - [Update Data By ID](#update-data-by-id)
    - [Filter data and update many data](#filter-one-data-and-update-it)
    - [Delete Entry](#delete-an-entry)
    - [isExist & isUnique](#isexist-and-isuniqe)
  - [Delete Collection](#delete-whole-collection)
  - [Get all entry of a collection](#search-or-filter-data)
- [Get Kv DataBase instance]()
- [Connect Database]()
- [Disconnect Database]()

### Connect Database

```ts
import * as EasyKv from "@easykv/easykv";

await EasyKv.connect();
// If you have any specific remote locaion or local path,
//you can pass that in parameter.
```

<span style="color: #00ffd0; font-weight: bold">Definition:</span> EasyKv comes
with a `connect()` function. This allows you to connect your DenoKV database.
Just call this function to create a local datdbase.

- If you wants to connect a remote database here, you can pass the link to the
  parameter. Ex. `connect(location)`
- If you want to include a local path, you can also do that like this :
  `connect("./database")`.\
  **Note:** in that case, you have to give read and write permission. to give
  _read_ & _write_ permission you can pass `-RW` flag while running.

```bash
deno run -RW --unstable-kv main.ts
```

### Create a Collection

```typescript
import { Collection } from "@easykv/easykv";

// Create a "User" collection or model
const User = new Collection("user");

// Example: Create another collection for products
const Product = new Collection("product");
```

<span style="color: #00ffd0; font-weight: bold">Definition:</span> Deno KV
supports hierarchical keys, and EasyKV uses the first key as the collection
name. For instance, the string `"user"` passed in the parameter creates a
collection called `user` in the database. This acts as the base namespace for
all keys stored under this collection. Collections in EasyKV act like models in
traditional ORMs (e.g., Mongoose). They group related data under a common
namespace, enabling you to manage users, products, or other entities in an
organized way.

### Save Some Data to the Database

```typescript
import { Collection } from "@easykv/easykv";

// Create a collection or model
const User = new Collection("user");

// Data to be stored in the database
const data = {
    name: "MrSIHAB",
    age: 19,
    country: "Bangladesh",
    dn: "Dark-Ness",
};

// Save the data to the "user" collection
const result = await User.save(data);

// Log the result
console.log(result.ok); // Boolean indicating if the save was successful
console.log(result.versionstamp); // The version stamp for the saved data
console.log(result.data); // The saved data from the database
```

<span style="color: #00ffd0; font-weight: bold">Definition:</span> The `save()`
function accepts a data object (e.g., `{}`) to store in the collection. Here, we
created a `data` object and used `collection.save(data)` to save it. This
function returns a `Promise<object>`, which resolves to an object containing
three properties:

- `ok`: A boolean value indicating whether the save operation was successful.
- `versionstamp`: A unique identifier (timestamp) for the saved version of the
  data.
- `data`: The saved data from the database, which will be returned if the save
  was successful.

You can also pass a custom `_id` to the data. If you don't provide an `_id`,
EasyKV will automatically generate one. Be cautious when providing a custom
`_id`, as it must be unique. Attempting to save data with a duplicate `_id` will
result in an error.

You can provide custom `_id` like this way:

```typescript
const dataWithId = {
    _id: "custom-id-1234", // Custom _id
    name: "MrSIHAB",
    age: 19,
    country: "Bangladesh",
    dn: "Dark-Ness",
};

await User.save(dataWithId);
```

### Get Data from the Database

```typescript
const User = new Collection("user");

// Retrieve data by using the findById function
const data = await User.findById(id);

// If you pass the _id, it will return the corresponding data
console.log(data.name); // Access the name property
console.log(data.age); // Access the age property
console.log(data.country); // Access the country property
console.log(data.dn); // Access the dn property
```

<span style="color: #00ffd0; font-weight: bold">Definition:</span> The
`findById()` function allows you to retrieve data by passing the unique `_id`.
The `_id` acts as the identifier for the specific entry in the collection. By
calling `collection.findById(_id)`, it returns the data associated with that
`_id`. If no data is found for the given `_id`, it will return `null` or an
empty response. To handle null response, you can use `ifelse` :

```typescript
if (data) {
    console.log(data.name);
} else {
    console.log("No data found for this ID.");
}
```

### Search or Filter Data

```typescript
// Import the User collection that we created
import { User } from "./path/user.ts"; // Collection

// Define the filter object
const filter = {
    name: "Shruti Munde",
    age: 20,
};

// Use findMany to search/filter data based on the criteria
const filteredData: [] = await User.findMany(filter);
// Note: findMany will return an array of matching data objects

// Handling a case where no data matches
if (filteredData.length === 0) {
    console.log("No users found matching the filter.");
} else {
    console.log(filteredData[0]); // Display the first match, for example
}

// As filterData is an array, ensure the index is a number
```

<span style="color: #00ffd0; font-weight: bold">Definition:</span> The
collection.findMany({options}) function allows you to retrieve an array of data
that matches the provided filter criteria. If you pass an empty object {}, it
will return all available data in the collection.

For example, to retrieve all data:

```ts
const allData = await collection.findMany({});
```

### Update data by ID

```ts
// Existing data to update
const userId = "0055"; // Assume this ID exists in the database
const updateOptions = {
    name: "SIHAB",
    age: 20, // Updated age
};

try {
    const result = await User.updateById(userId, updateOptions);

    console.log("Update successful:", result.ok);
    console.log("Versionstamp:", result.versionstamp);
    console.log("Updated data:", result.dataNew);
    console.log("Updated data:", result.dataOld);
} catch (error) {
    console.error("Error updating data:", error.message);
}
```

<span style="color: #00ffd0; font-weight: bold">Definition:</span>
`updatebyId()` fanction takes the `ID` of a entry and update the with the given
`updateOptions`. The function returns:

- `ok`: if the process was successfull,
- `versionstamp`: VersionStamp of the data
- `dataOld`: Existing data before update.
- `dataNew`: The data after updateing the Previous entry.

The function will return an `Error` if no previous data is available in
database.

### Filter One Data and Update it.

```ts
const filter = {
    name: "Shoaib Hossain",
    email: "MrSIHAB@hotmail.com",
};

const updateOptions = {
    name: "Sihab"
    friends: ["Shruti Munde"],
    followers: ["Jhon", "Doe", "Danbo", "others"],
};

const result = await User.findOneAndUpdate(filter, UpdteOptions);
```

<span style="color: #00ffd0; font-weight: bold">Definition:</span> This funtion
works similer as Previous `collection.updateById()` function. But it take an
`object` instead of `id`. You can pass Id as filterOption`{_id: id}`. This
funtion filters al entry and find the atual entry to update. If multiple entry
match with the filter criteria, it will update the `first one`. So, make sure
the given critera finds unique one.

### Delete an Entry

```ts
const result = await User.delete(id); // returns a boolean value

if (result) {
    console.log("User Was removed successfully");
}
```

<span style="color: #00ffd0; font-weight: bold">Definition:</span>
`Collection.delete()` function requires the `id` of an entry to remove it
completely.

### Delete whole collection

```ts
const isDeleted = await User.deletCollection({
    wantsToRemoveEveryThingOfThisCollection: true, // Just for reduce accidents
});
if (isDeleted) {
    console.log("All the information of this collection was deleted!!!");
}
```

<span style="color: #00ffd0; font-weight: bold">Definition:</span> Internally it
uses deleteMany function to delete every entry.
`wantsToRemoveEveryThingOfThisCollection` was included to reduce accidents.

### IsExist and IsUniqe

```ts
const criteria = {
    name: "Shaoib Hossain",
    age: 105,
};

const isExist = await User.isExist(criteria); // returns boolean(false)
const isUnique = await User.isUnique(criteria); // returns boolean(true)
```

<span style="color: #00ffd0; font-weight: bold">Definition:</span> `IsExist()`
ckecks if any entry exists in database with given criteria. If any entry matchs,
it returns `true` else `false`.\
The `isUnique()` function do just it's opposite. Internally it calls the
`isExist()` function and returns it's opposite(`true`=>`false` || `false` =>
`true`).

## License

This project(**EasyKv**) is licensed under the [MIT License](LICENSE).
