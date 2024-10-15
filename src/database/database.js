import { connect as connectToMongoose } from "mongoose";
import {
  EXECUTION_MODE,
  MONGO_URL,
} from "../config/config.js";
import Logger from "../utils/logger.js";

// initialize server
export async function connect() {
  // @ts-ignore
  if (EXECUTION_MODE === "online") {
    try {
      // @ts-ignore
      await connectToMongoose(MONGO_URL);
      console.log(`connected to DB: "${MONGO_URL}"`);
      Logger.debug(`connected to DB: "${MONGO_URL}"`);
    } catch (error) {
      Logger.error("Error connecting to DB:", error);
      console.error("Error connecting to DB:", error);
    }
  } else {
    Logger.info("working with local files persistence");
    Logger.debug("working with local files persistence");
  }
}
