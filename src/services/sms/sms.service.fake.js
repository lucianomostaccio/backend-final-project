import { TWILIO_SMS_NUMBER } from "../../config/config.js";

class SmsServiceFake {
  async send(to, body) {
    const smsOptions = {
      from: TWILIO_SMS_NUMBER,
      to,
      body
    };

    console.log(smsOptions);
  }
}

export const fakeSmsService = new SmsServiceFake();
