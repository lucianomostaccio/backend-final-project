import { Ticket } from "../models/tickets.model.js";
import { getDaoTickets } from "../daos/tickets/tickets.dao.js";
import { getDaoUsers } from "../daos/users/users.dao.js";
import Logger from "../utils/logger.js";

const ticketsDao = getDaoTickets();
const usersDao = getDaoUsers();

export class TicketsService {
  constructor(emailService) {
    this.emailService = emailService;
  }

  // Add a new ticket to the database
  async addTicket(ticketData) {
    try {
      Logger.debug("Adding new ticket:", ticketData);

      // Ensure the code is set correctly
      if (!ticketData.code || ticketData.code === "") {
        ticketData.code = `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`;
      }

      // 1. Retrieve the purchaser's details by purchaser ID
      const purchaserId = ticketData.purchaser;
      let user;
      try {
        // Fetch user details from the database based on purchaser ID
        user = await usersDao.readOne({ _id: purchaserId });
        if (!user || !user.email) {
          throw new Error("Email not found for purchaser");
        }
        Logger.debug(`Email for purchaser ${purchaserId}: ${user.email}`);
      } catch (error) {
        Logger.error("Error fetching purchaser details:", error);
        throw new Error("Failed to fetch purchaser email");
      }

      // 2. Send an email to the purchaser before proceeding with ticket creation
      try {
        if (this.emailService) {
          Logger.info("Sending ticket creation email");
          await this.emailService.send(
            user.email,
            "Ticket Created Successfully",
            `Your ticket with code ${ticketData.code} is being processed. Thanks for your purchase!`
          );
          Logger.info(
            "Ticket creation email sent successfully to:",
            user.email
          );
        }
      } catch (error) {
        Logger.error("Failed to send ticket creation email:", error);
        // Continue with ticket creation even if email fails
      }

      // 3. Create the ticket in the database after sending the email
      const ticket = new Ticket(ticketData); // Create a new Ticket instance
      Logger.debug("Generated ticket _id:", ticket._id);
      const savedTicket = await ticketsDao.create(ticket.toPOJO()); // Save the ticket in the DB
      Logger.info("Ticket created successfully");

      // 4. Update user record with new ticket reference
      try {
        await usersDao.updateOne(
          { _id: purchaserId },
          { $push: { tickets: ticket._id } }
        );
        Logger.info("User record updated with new ticket reference");
      } catch (error) {
        Logger.error(
          "Failed to update user record with ticket reference:",
          error
        );
        // Continue even if user update fails - the ticket has been created
      }

      return savedTicket; // Return the newly created ticket
    } catch (error) {
      Logger.error("Error adding ticket:", error);
      throw new Error(`Failed to add ticket: ${error.message}`);
    }
  }

  // Retrieve a ticket by ID
  async getTicketById(ticketId) {
    try {
      const ticket = await ticketsDao.readOne({ _id: ticketId });
      if (!ticket) {
        const error = new Error("Ticket not found");
        error.type = "NOT_FOUND";
        throw error;
      }
      Logger.debug("Ticket retrieved successfully");
      return ticket;
    } catch (error) {
      Logger.error("Error retrieving ticket:", error);
      throw error;
    }
  }

  // Get all tickets for a user
  async getTicketsByUser(userId) {
    try {
      const tickets = await ticketsDao.readMany({ purchaser: userId });
      Logger.debug(`Retrieved ${tickets.length} tickets for user ${userId}`);
      return tickets;
    } catch (error) {
      Logger.error("Error retrieving user tickets:", error);
      throw error;
    }
  }

  // Update a ticket
  async updateTicket(ticketId, updateData) {
    try {
      const ticketToUpdate = await ticketsDao.readOne({ _id: ticketId });
      if (!ticketToUpdate) {
        const error = new Error("Ticket not found");
        error.type = "NOT_FOUND";
        throw error;
      }

      const updatedTicket = await ticketsDao.updateOne(
        { _id: ticketId },
        updateData
      );
      Logger.info("Ticket updated successfully");
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
        const error = new Error("Ticket not found");
        error.type = "NOT_FOUND";
        throw error;
      }

      // Remove reference from user if possible
      try {
        if (deletedTicket.purchaser) {
          await usersDao.updateOne(
            { _id: deletedTicket.purchaser },
            { $pull: { tickets: ticketId } }
          );
          Logger.info("Removed ticket reference from user record");
        }
      } catch (userError) {
        Logger.warning(
          "Could not update user record after ticket deletion:",
          userError
        );
        // Continue even if user update fails - the ticket has been deleted
      }

      Logger.info("Ticket deleted successfully");
      return deletedTicket;
    } catch (error) {
      Logger.error("Error deleting ticket:", error);
      throw error;
    }
  }
}
