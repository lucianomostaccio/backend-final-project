import { toPOJO } from "../../utils.js";

export class formDaoMongoose {
  constructor(formModel) {
    this.formModel = formModel;
  }

  async create(data) {
    console.log("Form to create dao mongoose:", data);
    const Form = await this.formModel.create(data);
    console.log("Form created in create dao mongoose:", Form);
    return toPOJO(Form);
  }
}
