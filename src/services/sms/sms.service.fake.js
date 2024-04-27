import { TWILIO_SMS_NUMBER } from "../../config/config.js";
import Logger from "../../utils/logger.js";

class SmsServiceFake {
  async send(to, body) {
    const smsOptions = {
      from: TWILIO_SMS_NUMBER,
      to,
      body,
    };

    Logger.info(smsOptions);
  }
}

export const fakeSmsService = new SmsServiceFake();
