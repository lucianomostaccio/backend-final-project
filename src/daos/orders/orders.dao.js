import { model } from "mongoose";
import { EXECUTION_MODE } from "../../config/config.js";

import { OrdersDaoMongoose } from "./mongoose/orders.dao.mongoose.js";
import { OrdersDaoFiles } from "./files/orders.dao.files.js";
import { ordersSchema } from "./mongoose/orders.model.mongoose.js";
import Logger from "../../utils/logger.js";
const PATH_ORDERS_FILES = "../../../db/orders.json";

let daoOrders;

// @ts-ignore
if (EXECUTION_MODE === "online") {
  if (!daoOrders) {
    const ordersModel = model("orders", ordersSchema);
    daoOrders = new OrdersDaoMongoose(ordersModel);
    Logger.info("using mongodb persistence - orders");
    console.log("using mongodb persistence - orders")
  }
} else {
  daoOrders = new OrdersDaoFiles(PATH_ORDERS_FILES);
  Logger.info("using files persistence - orders");
  console.log("using files persistence - orders")
}

export function getDaoOrders() {
  return daoOrders;
}
