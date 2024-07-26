import { Form } from "../models/form.model.js";
import { getDaoForm } from "../daos/forms/form.dao.js";
import Logger from "../utils/logger.js";

const formDao = getDaoForm();

class FormService {
  // Add a new ticket to the database
  async addContactForm(formData) {
    try {
      console.log("Adding contactFormData:", formData);
      const form = new Form(formData);
      console.log("Generated Form _id:", form._id);
      console.log("Form created in addTicket:", form);
      const savedForm = await formDao.create(form.toPOJO());
      console.log("Form created successfully:", savedForm);
      return savedForm;
    } catch (error) {
      console.log("Error adding form:", error);
      throw new Error("Failed to add form");
    }
  }
}

// Retrieve a ticket by ID
//   async getTicketById(ticketId) {
//     try {
//       const ticket = await ticketsDao.readOne({ _id: ticketId });
//       if (!ticket) {
//         Logger.error("Ticket not found:", ticketId);
//         throw new Error("Ticket not found");
//       }
//       Logger.debug("Ticket retrieved successfully:", ticket);
//       return ticket;
//     } catch (error) {
//       Logger.error("Error retrieving ticket:", error);
//       throw error;
//     }
//   }

export const formService = new FormService();
