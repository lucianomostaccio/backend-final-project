import { model } from "mongoose";
import { EXECUTION_MODE } from "../../config/config.js";

import { TicketsDaoMongoose } from "./mongoose/tickets.dao.mongoose.js";
import { TicketsDaoFiles } from "./files/tickets.dao.files.js";
import { ticketsSchema } from "./mongoose/tickets.model.mongoose.js";
import Logger from "../../utils/logger.js";
const PATH_ORDERS_FILES = "./db/tickets.json";

let daoTickets;

// @ts-ignore
if (EXECUTION_MODE === "online") {
  if (!daoTickets) {
    const ticketsModel = model("tickets", ticketsSchema);
    ticketsModel.syncIndexes();
    daoTickets = new TicketsDaoMongoose(ticketsModel);
    Logger.info("using mongodb persistence - tickets");
    Logger.debug("using mongodb persistence - tickets");
  }
} else {
  daoTickets = new TicketsDaoFiles(PATH_ORDERS_FILES);
  Logger.info("using files persistence - tickets");
  Logger.debug("using files persistence - tickets");
}

export function getDaoTickets() {
  return daoTickets;
}
