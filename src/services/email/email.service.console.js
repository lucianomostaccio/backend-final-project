export class EmailServiceConsole {
  constructor() {}

  async send({ to, subject, body }) {
    console.log(`to: ${to} - subject: ${subject} - message: ${body}`);
  }
}
