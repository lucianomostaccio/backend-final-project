import { toPOJO } from "../../utils.js";
import Logger from "../../../utils/logger.js";

export class TicketsDaoMongoose {
  constructor(ticketsModel) {
    this.ticketsModel = ticketsModel;
  }

  async create(data) {
    try {
      Logger.debug("Creating new ticket in MongoDB");
      const ticket = await this.ticketsModel.create(data);
      Logger.info("Ticket created successfully with ID:", ticket._id);
      return toPOJO(ticket);
    } catch (error) {
      Logger.error("Error creating ticket in MongoDB:", error);
      throw error;
    }
  }

  async readOne(query) {
    try {
      const ticket = await this.ticketsModel
        .findOne(query)
        .populate("purchaser", "email first_name last_name")
        .lean();

      if (!ticket) {
        Logger.debug("No ticket found with query:", query);
        return null;
      }

      Logger.debug("Ticket found by ID:", ticket._id);
      return toPOJO(ticket);
    } catch (error) {
      Logger.error("Error reading ticket from MongoDB:", error);
      throw error;
    }
  }

  async readMany(query = {}) {
    try {
      Logger.debug("Fetching tickets with query:", query);
      const tickets = await this.ticketsModel
        .find(query)
        .populate("purchaser", "email first_name last_name")
        .lean();

      Logger.info(`Found ${tickets.length} tickets matching query`);
      return toPOJO(tickets);
    } catch (error) {
      Logger.error("Error reading multiple tickets from MongoDB:", error);
      throw error;
    }
  }

  async updateOne(query, data) {
    try {
      Logger.debug("Updating ticket with query:", query);
      const updatedTicket = await this.ticketsModel
        .findOneAndUpdate(query, data, { new: true })
        .lean();

      if (!updatedTicket) {
        Logger.warning("No ticket found to update with query:", query);
        return null;
      }

      Logger.info("Ticket updated successfully:", updatedTicket._id);
      return toPOJO(updatedTicket);
    } catch (error) {
      Logger.error("Error updating ticket in MongoDB:", error);
      throw error;
    }
  }

  async updateMany(query, data) {
    try {
      Logger.debug("Updating multiple tickets with query:", query);
      const result = await this.ticketsModel.updateMany(query, data);
      Logger.info(`Updated ${result.modifiedCount} tickets`);
      return { modifiedCount: result.modifiedCount };
    } catch (error) {
      Logger.error("Error updating multiple tickets in MongoDB:", error);
      throw error;
    }
  }

  async deleteOne(query) {
    try {
      Logger.debug("Deleting ticket with query:", query);
      const deletedTicket = await this.ticketsModel
        .findOneAndDelete(query)
        .lean();

      if (!deletedTicket) {
        Logger.warning("No ticket found to delete with query:", query);
        return null;
      }

      Logger.info("Ticket deleted successfully:", deletedTicket._id);
      return toPOJO(deletedTicket);
    } catch (error) {
      Logger.error("Error deleting ticket from MongoDB:", error);
      throw error;
    }
  }

  async deleteMany(query) {
    try {
      Logger.debug("Deleting multiple tickets with query:", query);
      const result = await this.ticketsModel.deleteMany(query);
      Logger.info(`Deleted ${result.deletedCount} tickets`);
      return { deletedCount: result.deletedCount };
    } catch (error) {
      Logger.error("Error deleting multiple tickets from MongoDB:", error);
      throw error;
    }
  }
}
