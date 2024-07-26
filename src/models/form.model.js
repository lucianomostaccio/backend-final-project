import { randomUUID } from "node:crypto";

export class Form {
  #_id;
  #name;
  #date;
  #email;
  #text;

  constructor({ _id = randomUUID(), name, email, text }) {
    this.#_id = _id;
    this.#name = name;
    this.#date = new Date().toLocaleString("en-US", {
      timeZone: "America/Argentina/Buenos_Aires",
    });
    this.#email = email;
    this.#text = text;
  }

  get _id() {
    return this.#_id;
  }
  get name() {
    return this.#name;
  }
  get date() {
    return this.#date;
  }
  get email() {
    return this.#email;
  }
  get text() {
    return this.#text;
  }

  toPOJO() {
    return {
      _id: this.#_id,
      name: this.#name,
      date: this.#date,
      email: this.#email,
      text: this.#text,
    };
  }
}
