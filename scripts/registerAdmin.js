import mongoose from "mongoose";
import { MONGODB_CNX_STR } from "../src/config/config.js";
import { connect } from "../src/database/database.js";
import { getDaoUsers } from "../src/daos/users/users.dao.js";

const usersDao = getDaoUsers();

console.log("starting...");
console.log(MONGODB_CNX_STR);

await connect();

const deleted = await usersDao.deleteMany({ email: "admin@admin.com" });

console.log("user deleted",deleted);

const user = await usersDao.create({
  email: "admin@admin.com",
  password: "admin",
  first_name: "admin",
  last_name: "admin",
  age: ""
});

console.log("user to create",user);

const updatedUser = await usersDao.updateOne(
  { email: "admin@admin.com" },
  { $set: { role: "admin" } },
  { new: true }
);

console.log("updated user:",updatedUser);

await mongoose.disconnect();
