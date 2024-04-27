import { EMAIL_USER } from "../../config/config.js";
import Logger from "../../utils/logger.js";

class FakeEmailService {
  async send(to, subject, body, attachments = []) {
    const emailOptions = {
      from: EMAIL_USER,
      to,
      subject,
      text: body,
    };

    if (attachments.length > 0) {
      emailOptions.attachments = attachments;
    }

    Logger.info(JSON.stringify(emailOptions, null, 2));
  }
}

export const fakeEmailService = new FakeEmailService();
