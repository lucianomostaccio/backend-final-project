import { randomUUID } from "node:crypto";

export class Product {
  #_id;
  #title;
  #description;
  #code;
  #price;
  #status;
  #stock;
  #category;
  #thumbnails;

  constructor({
    _id = randomUUID(),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  }) {
    this.#_id = _id;
    this.#title = title;
    this.#description = description;
    this.#code = code;
    this.#price = price;
    this.#status = status;
    this.#stock = stock;
    this.#category = category;
    this.#thumbnails = thumbnails;
  }

  get _id() {
    return this.#_id;
  }
  get title() {
    return this.#title;
  }
  get description() {
    return this.#description;
  }
  get code() {
    return this.#code;
  }
  get price() {
    return this.#price;
  }
  get status() {
    return this.#status;
  }
  get stock() {
    return this.#stock;
  }
  get category() {
    return this.#category;
  }
  get thumbnails() {
    return this.#thumbnails;
  }

  set title(value) {
    if (!value) throw new Error("title is mandatory");
    this.#title = value;
  }
  set price(value) {
    if (!value) throw new Error("price is mandatory");
    if (value <= 0) throw new Error("price must be greater than 0");
    this.#price = value;
  }

  toPOJO() {
    return {
      _id: this.#_id,
      title: this.#title,
      description: this.#description,
      code: this.#code,
      price: this.#price,
      status: this.#status,
      stock: this.#stock,
      category: this.#category,
      thumbnails: this.#thumbnails,
    };
  }
}
