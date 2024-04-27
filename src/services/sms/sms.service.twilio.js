import twilio from "twilio";
import Logger from "../../utils/logger.js";

export class SmsServiceTwilio {
  constructor({ sid, authToken, origin }) {
    this.client = twilio(sid, authToken);
    this.origin = origin;
  }

  async send({ to, body }) {
    Logger.info("Sending SMS to:", to);
    Logger.info("SMS Body:", body);
    const smsOptions = {
      from: this.origin,
      to,
      body,
    };
    Logger.info("Twilio SMS options before sending:", smsOptions);
    try {
      const message = await this.client.messages.create(smsOptions);
      Logger.info("Twilio SMS response:", message);
    } catch (error) {
      Logger.error("Error sending SMS through Twilio:", error);
    }
  }
}
