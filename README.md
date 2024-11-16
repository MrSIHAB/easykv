<div align="center">

# EasyKV by MrSIHAB

A lightweight and flexible library for working with Deno KV. Inspired by
Mongoose, EasyKV simplifies database interactions in Deno applications.

[![Lib Version](https://img.shields.io/badge/Version-v0.1.1-0cb)](https://jsr.io/@easykv/easykv)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/MrSIHAB/EasyKV/blob/main/LICENSE)
[![Deno Version](https://img.shields.io/badge/Deno-2.0-white)](https://deno.com)

<!-- [![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](#) -->

</div>

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
  - [Defining a Schema](#defining-a-schema)
  - [Saving Data](#saving-data)
  - [Querying Data](#querying-data)
- [Quick Start](#quick-start)
- [Features](#features)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Intruduction

EasyKV is a high-level abstraction layer for Deno's built-in KV (Key-Value)
database. It simplifies working with Deno KV, making it easier and more
efficient to use. Whether you're new to Deno KV or planning to use it in
large-scale applications, EasyKV provides the tools to streamline your workflow.

We think: Deno KV is often perceived as a simple database, suitable only for
storing tokens or short-term data, and not ideal for complex programs.
`But what if it could handle more?` At its core, EasyKV was built to unlock the
full potential of Deno KV and make it production-ready for larger projects.

With EasyKV, I wanted to take something simple and make it even simpler without
compromising on flexibility or power. While Deno KV is a great built-in option,
it can be challenging to scale for big projects. That's why I created EasyKV—not
just to make my workflow easier, but to make yours easier too.

With EasyKV, you can:

- Easily interact with Deno KV.
- Save, update, and delete data effortlessly.
- Query, filter, and manage data with ease.
- Retrieve multiple records simultaneously using flexible filters.

## Installation

EasyKV is designed exclusively for Deno to simplify working with its built-in KV
(Key-Value) database. Follow these steps to install and start using EasyKV in
your project:

#### Prerequisites

- Deno v2.0 or higher is recommended.

### Install via JSR

Run the following command in your terminal to add EasyKV to your project:

```console
deno add jsr:@easykv/easykv
```

### Import Directly

Alternatively, you can directly import EasyKV into your project:

```typescript
import * as easykv from "jsr:@easykv/easykv";
```

## Quick Start

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

### Update a data by ID

```ts
// Existing data to update
const userId = "0055"; // Assume this ID exists in the database
const updateOptions = {
    name: "SIHAB",
    age: 20, // Updated age
};

try {
    const result = await User.updateOne(userId, updateOptions);

    console.log("Update successful:", result.ok);
    console.log("Versionstamp:", result.versionstamp);
    console.log("Updated data:", result.updatedData);
} catch (error) {
    console.error("Error updating data:", error.message);
}
```

<span style="color: #00ffd0; font-weight: bold">Definition:</span> `updateOne()`
fanction takes the `ID` of a entry and update the with the given
`updateOptions`. The function returns:

- `ok`: if the process was successfull,
- `versionstamp`: VersionStamp of the data
- `updatedData`: The data after updateing the Previous entry.

The function will return an `Error` if no previous data is available in
database.

More Options are about launch...
