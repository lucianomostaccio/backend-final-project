import fs from "fs/promises";
import { matches } from "../../utils.js";

export class TicketsDaoFiles {
  constructor(path) {
    this.path = path;
  }

  async #readTickets() {
    try {
      return JSON.parse(await fs.readFile(this.path, "utf-8"));
    } catch (error) {
      console.error("Error reading tickets from file:", error);
      return [];
    }
  }

  async #writeTickets(tickets) {
    try {
      await fs.writeFile(this.path, JSON.stringify(tickets, null, 2));
    } catch (error) {
      console.error("Error writing tickets to file:", error);
    }
  }

  async create(ticketPojo) {
    const tickets = await this.#readTickets();
    tickets.push(ticketPojo);
    await this.#writeTickets(tickets);
    return ticketPojo;
  }

  async readOne(query) {
    const tickets = await this.#readTickets();
    const searched = tickets.find(matches(query));
    return searched;
    // return tickets.find(ticket => ticket._id === query._id);
  }

  async readMany(query) {
    const tickets = await this.#readTickets();
    const manySearched = tickets.filter(matches(query));
    return tickets;
  }

  async updateOne(query, data) {
    throw new Error("NOT IMPLEMENTED");
  }

  async updateMany(query, data) {
    throw new Error("NOT IMPLEMENTED");
  }

  async deleteOne(query) {
    const tickets = await this.#readTickets();
    const indexSearched = tickets.findIndex(matches(query));
    if (indexSearched !== -1) {
      const [searched] = tickets.splice(indexSearched, 1);
      await this.#writeTickets(tickets);
      return searched;
    }
    return null;
  }

  async deleteMany(query) {
    throw new Error("NOT IMPLEMENTED");
  }
}
