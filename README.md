<div align="center">

# EasyKV

## By MrSIHAB

Most commonly used helper functions for DenoKv. Less broiler-plate codes\
A lightweight, type-safe, and flexible ORM for Deno KV.

[![Lib Version](https://img.shields.io/badge/EasyKV-v2.0-white)](https://jsr.io/@easykv/easykv)
[![License](https://img.shields.io/badge/license-MIT-white)](https://github.com/MrSIHAB/EasyKV/blob/main/LICENSE)
[![Deno Version](https://img.shields.io/badge/Deno-2.0+-white)](https://deno.com)\
[![Scope](https://jsr.io/badges/@easykv?logoColor=white&color=white&labelColor=555)](//jsr.io/@easykv)
[![Version](https://jsr.io/badges/@easykv/easykv?logoColor=white&color=white&labelColor=555)](//jsr.io/@easykv/easykv)
[![Score](https://jsr.io/badges/@easykv/easykv/score?logoColor=white&color=white&labelColor=555)](//jsr.io/@easykv/easykv/score)\
[![DenoLand](https://shield.deno.dev/x/easykv)](https://deno.land/x/easykv)

</div>

---

## Introduction

**EasyKV** is a high-level abstraction layer for Deno's built-in KV (Key-Value)
database.\
It makes working with Deno KV simple, type-safe, and efficient—ideal for both
small and large-scale applications.

- **Type-safe**: Define your own models and get full TypeScript support.
- **Familiar API**: Inspired by Mongoose and other popular ORMs.
- **Atomic operations**: Safe for concurrent and production use.
- **No dependencies**: Built directly on Deno’s core.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Database Structure](#database-structure)
- [API Reference](#api-reference)
  - [Connect/Disconnect](#connectdisconnect)
  - [Collections](#collections)
  - [CRUD Operations](#crud-operations)
  - [Advanced Queries](#advanced-queries)
  - [Delete Collection](#delete-whole-collection)
  - [Type Definitions](#type-definitions)
- [License](#license)

---

## Installation

**Deno v2.0 or higher is recommended.**

Install via [JSR](https://jsr.io/@easykv/easykv):

```sh
deno add jsr:@easykv/easykv
```

Import via URL:

```typescript
import * as easykv from "jsr:@easykv/easykv";
// Or...
import * as easykv from "https://deno.land/x/easykv/mod.ts";
```

> ⚠️ **Note:**\
> Deno KV is currently an unstable API.\
> **You must run your project with the `--unstable-kv` flag** or Deno KV will
> not work and your app will fail to start.\
> This is a requirement of Deno itself, not of EasyKV.
>
> **Example:**
>
> ```sh
> deno run --unstable-kv main.ts
> ```

---

## Quick Start

```typescript
import { Collection, connect, disconnect } from "jsr:@easykv/easykv";

// Define your data model
interface User {
  name: string;
  age: number;
}

// Connect to the database (optional: specify a path)
await connect();

// Create a collection instance
const users = new Collection<User>("users");

// Save a new user
await users.save({ name: "Alice", age: 30 });

// Find by ID
const result = await users.findById("some-id");

// Find many users
const allAlices = await users.findMany({ name: "Alice" });

// Update by ID
await users.updateById("some-id", { age: 31 });

// Delete by ID
await users.delete("some-id");

// Disconnect when done (optional)
disconnect();
```

---

## Database Structure

EasyKV uses Deno KV’s hierarchical keys to organize your data:

```
Database
  └── Collection (namespace)
        └── Entry (document)
              └── Key: value
```

- **Database**: The main Deno KV instance.
- **Collection**: A group of related entries (like a table or model).
- **Entry**: An individual document (object) in a collection.

---

## API Reference

### Connect/Disconnect

```typescript
import { connect, disconnect, getKv } from "jsr:@easykv/easykv";

// Connect to the database (optional: specify a path)
await connect("./mydb");

// Disconnect from the database
disconnect();

// Get the raw Deno.Kv instance (advanced use)
const kv = getKv();
```

### Collections

```typescript
import { Collection } from "jsr:@easykv/easykv";

// Define a model
interface Product {
  name: string;
  price: number;
}

// Create a collection
const products = new Collection<Product>("products");
```

### CRUD Operations

#### Save Data

```typescript
const result = await products.save({ name: "Book", price: 10 });
console.log(result.ok, result.id, result.versionstamp);
```

#### Find by ID

```typescript
const found = await products.findById("some-id");
if (found.ok) {
  console.log(found.value);
}
```

#### Find Many

```typescript
const books = await products.findMany({ name: "Book" });
const all = await products.findMany({});
```

#### Update by ID

```typescript
const updateResult = await products.updateById("some-id", { price: 12 });
console.log(updateResult.ok, updateResult.versionstamp);
```

#### Find One and Update

```typescript
const updateResult = await products.findOneAndUpdate({ name: "Book" }, {
  price: 15,
});
```

#### Delete by ID

```typescript
const delResult = await products.delete("some-id");
console.log(delResult.ok);
```

#### Delete Many

```typescript
const stats = await products.deleteMany({ price: 10 });
console.log(stats.deletedEntry, stats.leftEntry);
```

---

### Advanced Queries

#### Check Existence and Uniqueness

```typescript
const exists = await products.isExist({ name: "Book" });
const isUnique = await products.isUnique({ name: "Book" });
```

---

### Delete Whole Collection

```typescript
const deleted = await products.deleteCollection({
  wantsToRemoveEveryThingOfThisCollection: true,
});
if (deleted) {
  console.log("Collection deleted!");
}
```

---

### Type Definitions

EasyKV provides types for advanced use and type-safety:

- `EKDataModel`: Base type for all models.
- `EKSaveResponse<T>`: Result of a save operation.
- `EKFindById<T>`: Result of a find-by-ID operation.
- `EKUpdateType<T>`: Result of an update operation.
- `EKDeleteCount`: Result of a delete-many operation.
- `EKDisconnectKvType`: Result of a disconnect operation.

---

## License

This project (**EasyKV**) is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Made with ❤️ by MrSIHAB</sub>
</div>
