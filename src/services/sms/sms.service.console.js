export class SmsServiceConsole {
  constructor() {
  }

  async enviar({ to, body }) {
    console.log(`to: ${to} - body: ${body}`)
  }
}
