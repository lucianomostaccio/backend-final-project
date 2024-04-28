import { randomUUID } from "node:crypto";

export class Ticket {
  #_id;
  #code;
  #ticketDate;
  #amount;
  #purchaser;

  constructor({ _id = randomUUID(), code = [], amount, purchaser }) {
    this.#_id = _id;
    this.#code = code;
    this.#ticketDate = new Date();
    this.#amount = amount;
    this.#purchaser = purchaser;
  }

  get _id() {
    return this.#_id;
  }
  get code() {
    return this.#code;
  }
  get ticketDate() {
    return this.#ticketDate;
  }
  get amount() {
    return this.#amount;
  }
  get purchaser() {
    return this.#purchaser;
  }

  toPOJO() {
    return {
      _id: this.#_id,
      code: this.#code,
      ticketDate: this.#ticketDate,
      amount: this.#amount,
      purchaser: this.#purchaser,
    };
  }
}
