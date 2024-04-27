import Logger from "../../utils/logger.js";

export class EmailServiceConsole {
  constructor() {}

  async send({ to, subject, body }) {
    Logger.info(`to: ${to} - subject: ${subject} - message: ${body}`);
  }
}
