import { Ticket } from "../models/tickets.model.js";
import { getDaoTickets } from "../daos/tickets/tickets.dao.js";
import { getDaoUsers } from "../daos/users/users.dao.js";
import Logger from "../utils/logger.js";

const ticketsDao = getDaoTickets();
const usersDao = getDaoUsers();

export class TicketsService {
  constructor(emailService) {
    this.emailService = emailService;
    console.log("tickets service email service injected:", this.emailService);

    // Verify transport
    // this.emailService.transport.verify(function (error, success) {
    //   if (error) {
    //     console.log("Error verifying email transport:", error);
    //   } else {
    //     console.log("Email transport is ready to send messages:", success);
    //   }
    // });
  }

  // Add a new ticket to the database
  async addTicket(ticketData) {
    try {
      console.log("Adding ticketData:", ticketData);

      // 1. Retrieve the purchaser's details by purchaser ID
      const purchaserId = ticketData.purchaser;
      let user;
      try {
        // Fetch user details from the database based on purchaser ID
        user = await usersDao.readOne({ _id: purchaserId });
        if (!user || !user.email) {
          throw new Error("Email not found for purchaser");
        }
        console.log(`Email for purchaser ${purchaserId}:`, user.email);
      } catch (error) {
        Logger.error("Error fetching purchaser details:", error);
        throw new Error("Failed to fetch purchaser email");
      }

      // 2. Send an email to the purchaser before proceeding with ticket creation
      try {
        if (!this.emailService || typeof this.emailService.send !== 'function') {
          throw new Error("Email service is not available or 'send' method is missing");
        }
        console.log("Sending ticket creation email to:", user.email);
        await this.emailService.send(
          user.email,
          "Ticket Created Successfully",
          `Your ticket with code ${ticketData.code} is being processed.`
        );
        console.log("Ticket creation email sent successfully to:", user.email);
      } catch (error) {
        Logger.error("Failed to send ticket creation email:", error);
      }

      // 3. Create the ticket in the database after sending the email
      const ticket = new Ticket(ticketData); // Create a new Ticket instance
      console.log("Generated ticket _id:", ticket._id);
      const savedTicket = await ticketsDao.create(ticket.toPOJO()); // Save the ticket in the DB
      console.log("Ticket created successfully:", savedTicket);

      return savedTicket; // Return the newly created ticket
    } catch (error) {
      Logger.error("Error adding ticket:", error);
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
