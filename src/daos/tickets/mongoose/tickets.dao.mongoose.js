import { toPOJO } from "../../utils.js";

export class TicketsDaoMongoose {
  constructor(ticketsModel) {
    this.ticketsModel = ticketsModel;
  }

  async create(data) {
    const ticket = await this.ticketsModel.create(data);
    return toPOJO(ticket);
  }

  async readOne(query) {
    return toPOJO(await this.ticketsModel.findOne(query).lean());
  }

  async readMany(query) {
    return toPOJO(await this.ticketsModel.find(query).lean());
  }

  async updateOne(query, data) {
    throw new Error("NOT IMPLEMENTED");
  }

  async updateMany(query, data) {
    throw new Error("NOT IMPLEMENTED");
  }

  async deleteOne(query) {
    return toPOJO(await this.ticketsModel.findOneAndDelete(query).lean());
  }

  async deleteMany(query) {
    throw new Error("NOT IMPLEMENTED");
  }
}
