import Logger from "../../../utils/logger.js";
import { toPOJO } from "../../utils.js";

export class UsersDaoMongoose {
  constructor(usersModel) {
    this.usersModel = usersModel;
  }

  async create(data) {
    const user = await this.usersModel.create(data);
    return toPOJO(user);
  }

  async readOne(email) {
    Logger.debug("accessed readOne with email:", email);
    const userDoc = await this.usersModel.findOne(email).lean();
    Logger.debug("readOne userDoc", userDoc);
    return toPOJO(userDoc); // Apply toPOJO and return in a single step
  }

  async readMany(query) {
    return toPOJO(await this.usersModel.find(query).lean());
  }

  async updateOne(query, data) {
    await this.usersModel.updateOne(query, data);
    return toPOJO(await this.usersModel.findOne(query).lean());
  }

  async updateMany(query, data) {
    await this.usersModel.updateMany(query, data);
    return toPOJO(await this.usersModel.find(query).lean());
  }

  async deleteOne(query) {
    return toPOJO(await this.usersModel.findOneAndDelete(query).lean());
  }

  async deleteMany(query) {
    const deleteResult = await this.usersModel.deleteMany(query);
    return { deletedCount: deleteResult.deletedCount };
  }
}
