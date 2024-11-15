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

### Firstly, make a collection :

```typescript
import { Collecion } from "@easykv/easykv";

// make a collection or model
const User = new Collection("user");

// another collection can be
const Product = new Collection("product");
```

<span style="color: #00ffd0; font-weight: bold">Defination :</span> DenoKV
supports multiple keys. We use first key as collection. Here, use passed `user`
string in parameter. This will make a new collection to database as user.

### save some data to database.

```typescript
import { Collecion } from "@easykv/easykv";

// make a collection or model
const User = new Collection("user");

// this data will be stored in database
const data = {
    name: "MrSIHAB",
    age: 19,
    country: "Bangladesh",
    dn: "Dark-Ness",
};

const result = await User.save(data);

console.log(result.ok); // boolean
console.log(result.versionstamp);
console.log(result.data); // The saved data
```

<span style="color: #00ffd0; font-weight: bold">Defination :</span> Save data as
`object{}`. We made a object of data. To save the data, we used
`collection.save()` function and passed the data as object. This function
returns `Promise<object>`. Basically the returned object contains three data:
`ok`, `versionstamp`, `data`. Ok is a boolean value tells if the process was
succesfull. And `data` will provide the same data from database if was
successfully saved. You can pass a `_id` into the data. If you don't, EasyKv
will autometically generate one. Be carefull to pass `_id`. It sould always be
unique. If you try to save more data with same `_id`, it will throw an error.

### Get data from Database

```typescript
const User = new Collection("user");

// get data by findById function
const data = await User.findById(id);

// if you pass id to this function, it will return that data to you.

console.log(data.name);
console.log(data.age);
console.log(data.country);
console.log(data.dn);
```

<span style="color: #00ffd0; font-weight: bold">Defination :</span> Pass a id to
`collection.findById(_id)` to get that data. Remember `_id` always acts like an
identifyer.

<div align="center">

### Search or filter data

</div>

```typescript
// importing the User collection which we have made.
import { User } from "./path/user.ts"; // Collection

const filter = {
    name: "Shruti Munde",
    age: 20,
};

const filterData: [] = await User.findMany(filter);
// note: findMany will return a [array] of {object => data}

console.log(filterData[index]);
// as filterData is a array, index must be a number
```

<span style="color: #00ffd0; font-weight: bold">Defination :</span>
`collection.findMany({options})` let's you find a fillted array of data. Leave
an empty object`{}` to get all available data of that collection. For example:

```ts
const allData = await collection.findMany({});
```

More Options are about launch...
