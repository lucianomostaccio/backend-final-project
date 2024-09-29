import nodemailer from "nodemailer";
// import Logger from "../../utils/logger.js";

export class EmailServiceNodemailer {
  constructor(options) {
    this.origin = options.auth.user;

    this.transport = nodemailer.createTransport({
      ...options,
    });
  }

  async send(to, subject, text, attachments = []) {
    const emailOptions = {
      from: this.origin,
      to,
      subject,
      text,
    };

    if (attachments.length > 0) {
      emailOptions.attachments = attachments;
    }

    try {
      await this.transport.sendMail(emailOptions);
      console.log("Email sent successfully:", emailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}
