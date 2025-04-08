import fs from "fs/promises";
import { matches, toPOJO } from "../../utils.js";
import Logger from "../../../utils/logger.js";

export class TicketsDaoFiles {
  constructor(path) {
    this.path = path;
  }

  async #readTickets() {
    try {
      return toPOJO(await fs.readFile(this.path, "utf-8"));
    } catch (error) {
      Logger.error("Error reading tickets from file:", error);
      return [];
    }
  }

  async #writeTickets(tickets) {
    try {
      await fs.writeFile(this.path, JSON.stringify(tickets, null, 2));
    } catch (error) {
      Logger.error("Error writing tickets to file:", error);
    }
  }

  async create(ticketPojo) {
    const tickets = await this.#readTickets();
    tickets.push(ticketPojo);
    await this.#writeTickets(tickets);
    Logger.info("Ticket created successfully");
    return ticketPojo;
  }

  async readOne(query) {
    const tickets = await this.#readTickets();
    const searched = tickets.find(matches(query));
    return searched;
  }

  async readMany(query) {
    const tickets = await this.#readTickets();
    const manySearched = tickets.filter(matches(query));
    return manySearched; // Fixed: return filtered tickets instead of all tickets
  }

  async updateOne(query, data) {
    const tickets = await this.#readTickets();
    const index = tickets.findIndex(matches(query));
    if (index === -1) {
      throw new Error("Ticket not found");
    }
    tickets[index] = { ...tickets[index], ...data };
    await this.#writeTickets(tickets);
    Logger.info("Ticket updated successfully");
    return tickets[index];
  }

  async updateMany(query, data) {
    const tickets = await this.#readTickets();
    const updatedTickets = tickets.map((ticket) => {
      if (matches(query)(ticket)) {
        return { ...ticket, ...data };
      }
      return ticket;
    });
    await this.#writeTickets(updatedTickets);
    return updatedTickets.filter(matches(query));
  }

  async deleteOne(query) {
    const tickets = await this.#readTickets();
    const indexSearched = tickets.findIndex(matches(query));
    if (indexSearched !== -1) {
      const [searched] = tickets.splice(indexSearched, 1);
      await this.#writeTickets(tickets);
      Logger.info("Ticket deleted successfully");
      return searched;
    }
    return null;
  }

  async deleteMany(query) {
    const tickets = await this.#readTickets();
    const remainingTickets = tickets.filter(
      (ticket) => !matches(query)(ticket)
    );
    const deletedTickets = tickets.filter((ticket) => matches(query)(ticket));
    await this.#writeTickets(remainingTickets);
    Logger.info(`${deletedTickets.length} tickets deleted successfully`);
    return deletedTickets;
  }
}
