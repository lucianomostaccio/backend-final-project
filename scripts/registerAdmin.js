import mongoose from "mongoose";
import { connect } from "../src/database/database.js";
import Logger from "../src/utils/logger.js";
import { getDaoUsers } from "../src/daos/users/users.dao.js";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../src/config/config.js";
import { createHash } from "../src/utils/hashing.js";

const daoUsers = getDaoUsers();

async function registerAdmin() {
  try {
    console.log("connecting to register admin");
    await connect();
    console.log("deleting admin user if any");
    await daoUsers.deleteMany({ email: ADMIN_EMAIL });
    const admingHashedPassword = await createHash(ADMIN_PASSWORD);

    console.log("saving admin user data");
    const adminData = {
      first_name: "Admin",
      last_name: "User",
      email: ADMIN_EMAIL,
      password: admingHashedPassword,
      role: "admin",
      profile_picture: "",
    };

    console.log("final step adding admin user");
    const adminUser = await daoUsers.create(adminData).catch((error) => {
      Logger.error("Error during admin user creation:", error);
      throw error;
    });

    Logger.info(`Administrador creado: ${adminUser.email}`);
    console.log(`Administrador creado: ${adminUser.email}`);
    mongoose.disconnect();
  } catch (error) {
    Logger.error("Error registrando administrador:", error);
  }
}

registerAdmin();
