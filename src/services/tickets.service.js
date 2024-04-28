import { Ticket } from "../models/tickets.model.js";
import { getDaoTickets } from "../daos/tickets/tickets.dao.js";
import Logger from "../utils/logger.js";

const ticketsDao = getDaoTickets();

class TicketsService {
  // Add a new ticket to the database
  async addTicket(ticketData) {
    try {
      console.log("Adding ticketData:", ticketData);
      const ticket = new Ticket(ticketData);
      console.log('Generated ticket _id:', ticket._id);
      console.log("Ticket created in addTicket:", ticket);
      const savedTicket = await ticketsDao.create(ticket.toPOJO());
      console.log("Ticket created successfully:", savedTicket);
      return savedTicket;
    } catch (error) {
      console.log("Error adding ticket:", error);
      throw new Error("Failed to add ticket");
    }
  }

  // Retrieve a ticket by ID
  async getTicketById(ticketId) {
    try {
      const ticket = await ticketsDao.readOne({ _id: ticketId });
      if (!ticket) {
        Logger.error("Ticket not found:", ticketId);
        throw new Error("Ticket not found");
      }
      Logger.debug("Ticket retrieved successfully:", ticket);
      return ticket;
    } catch (error) {
      Logger.error("Error retrieving ticket:", error);
      throw error;
    }
  }

  // Update a ticket
  async updateTicket(ticketId, updateData) {
    try {
      const ticketToUpdate = await ticketsDao.readOne({ _id: ticketId });
      if (!ticketToUpdate) {
        Logger.warning("Ticket not found for update:", ticketId);
        throw new Error("Ticket not found");
      }

      const updatedTicket = await ticketsDao.updateOne(
        { _id: ticketId },
        updateData
      );
      Logger.info("Ticket updated successfully:", updatedTicket);
      return updatedTicket;
    } catch (error) {
      Logger.error("Error updating ticket:", error);
      throw error;
    }
  }

  // Delete a ticket
  async deleteTicket(ticketId) {
    try {
      const deletedTicket = await ticketsDao.deleteOne({ _id: ticketId });
      if (!deletedTicket) {
        Logger.warning("Ticket not found for deletion:", ticketId);
        throw new Error("Ticket not found");
      }
      Logger.info("Ticket deleted successfully:", deletedTicket);
      return deletedTicket;
    } catch (error) {
      Logger.error("Error deleting ticket:", error);
      throw error;
    }
  }
}
export const ticketsService = new TicketsService();