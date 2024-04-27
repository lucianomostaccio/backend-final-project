import { model } from "mongoose";
import { EXECUTION_MODE } from "../../config/config.js";

import { UsersDaoMongoose } from "./mongoose/users.dao.mongoose.js";
import { UsersDaoFiles } from "./files/users.dao.files.js";
import { usersSchema } from "./mongoose/users.model.mongoose.js";
import Logger from "../../utils/logger.js";
const PATH_USERS_FILE = "./db/users.json";

let daoUsers;

// @ts-ignore
if (EXECUTION_MODE === "online") {
  if (!daoUsers) {
    const usersModel = model("users", usersSchema);
    daoUsers = new UsersDaoMongoose(usersModel);
    Logger.info("using mongodb persistence - users");
    Logger.debug("using mongodb persistence - users");
  }
} else {
  daoUsers = new UsersDaoFiles(PATH_USERS_FILE);
  Logger.info("using files persistence - users");
  Logger.debug("using files persistence - users");
}

export function getDaoUsers() {
  return daoUsers;
}
