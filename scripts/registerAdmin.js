import mongoose from "mongoose";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  MONGODB_CNX_STR,
} from "../src/config/config.js";
import { connect } from "../src/database/database.js";
import { getDaoUsers } from "../src/daos/users/users.dao.js";
import { createHash } from "../src/utils/hashing.js";

const usersDao = getDaoUsers();

await connect();

const deleted = await usersDao.deleteMany({ email: ADMIN_EMAIL });

const hashedPass = createHash(ADMIN_PASSWORD);

const user = await usersDao.create({
  email: ADMIN_EMAIL,
  password: hashedPass,
  first_name: "admin",
  last_name: "admin",
  age: "",
  role: "admin",
});

await mongoose.disconnect();
