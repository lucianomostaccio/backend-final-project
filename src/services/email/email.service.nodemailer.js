import nodemailer from "nodemailer";

export class EmailServiceNodemailer {
  constructor(options) {
    this.origin = options.auth.user;
    console.log('Origin set to:', this.origin); // Esto debería mostrar el correo electrónico configurado
    this.transport = nodemailer.createTransport(options);
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

    await this.transport.sendMail(emailOptions);
    console.log(emailOptions);
  }
}
