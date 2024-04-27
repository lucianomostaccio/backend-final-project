import Logger from "../../utils/logger.js";

export class SmsServiceConsole {
  constructor() {}

  async send({ to, body }) {
    Logger.info(`to: ${to} - body: ${body}`);
  }
}
