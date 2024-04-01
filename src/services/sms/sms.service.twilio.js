import twilio from "twilio";

export class SmsServiceTwilio {
  constructor({ sid, authToken, origin }) {
    this.client = twilio(sid, authToken);
    this.origin = origin;
  }

  async send({ to, body }) {
    console.log('Sending SMS to:', to); 
    console.log('SMS Body:', body); 
    const smsOptions = {
      from: this.origin,
      to,
      body,
    };
    console.log('Twilio SMS options before sending:', smsOptions); 
    try {
      const message = await this.client.messages.create(smsOptions);
      console.log('Twilio SMS response:', message); 
    } catch (error) {
      console.error('Error sending SMS through Twilio:', error);
    }
  }
}
