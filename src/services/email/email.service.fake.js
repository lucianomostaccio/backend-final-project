import { EMAIL_USER } from "../../config/config.js";

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

    console.log(JSON.stringify(emailOptions, null, 2));
  }
}

export const fakeEmailService = new FakeEmailService();
