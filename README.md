<div align="center">

# EasyKV by MrSIHAB

The easy solution of Deno KV database

</div>

## Intruduction

EasyKV is a top layer of Deno's built in KV(Key, Value) database. It helps to
use Deno KV more esay and efficiently. It's very easy to get started with
easyKV. EasyKV provides some built in helper functions. These functions let's
you make, create, update, search and delete data in Deno KV. Some says deno's kv
database is just for storing some tokens Or short term data. It's not for
complex program. But, what if it is? I like to keep things simple and make
things simple.\
But datbase? Database wasn't simple either.\
Though Deno KV was built in, it was a easy option to get started. But using
DenoKv in big project wasn't easy. So I made this EasyKV to make my workflow
easy and your's too. EasyKV was designed to use Deno Kv to production level.

# Installation

EasyKv was only made for Deno to work with Deno's KV database

Run this to install EasyKV:

```console
deno add jsr:@easykv/easykv
```

Or,\
Import directly

```typescript
import * as easykv from "jsr:@easykv/easykv";
```

# Use methods

- Firstly, make a collection :

```typescript
import { Collecion } from "@easykv/easykv";

// make a collection or model
const User = new Collection("user");

// another collection can be
const Product = new Collection("product");
```

Defination: DenoKV supports multiple keys. We use first key as collection. Here,
use passed `user` string in parameter. This will make a new collection to
database as user.

- save some data to database.

```typescript
import { Collecion } from "@easykv/easykv";

// make a collection or model
const User = new Collection("user");

// this data will be stored in database
const data = {
    name: "MrSIHAB",
    age: 19,
    country: "Bangladesh",
};

const result = await User.save(data);

console.log(result.ok);
```
