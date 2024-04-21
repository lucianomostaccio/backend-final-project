import { randomUUID } from "node:crypto";
import { DEFAULT_ROLE } from "../config/config";

export class User {
  #_id;
  #email;
  #password;
  #first_name;
  #last_name;
  #age;
  #profile_picture;
  #role;
  #orders;

  constructor({
    _id = randomUUID(),
    email,
    password,
    first_name,
    last_name,
    age,
    profile_picture,
    role,
    orders,
  }) {
    this.#_id = _id;
    this.email = email;
    this.password = password;
    this.first_name = first_name;
    this.last_name = last_name;
    this.age = age;
    this.profile_picture = profile_picture;
    this.role = role || DEFAULT_ROLE;
    this.orders = orders;
  }

  get _id() {
    return this.#_id;
  }

  get email() {
    return this.#email;
  }

  get password() {
    return this.#password;
  }

  get first_name() {
    return this.#first_name;
  }

  get last_name() {
    return this.#last_name;
  }

  get age() {
    return this.#age;
  }

  get profile_picture() {
    return this.#profile_picture;
  }

  get orders() {
    return this.#orders;
  }

  set email(value) {
    if (!value) throw new Error("email is mandatory");
    this.#email = value;
  }

  set password(value) {
    this.#password = value;
  }

  set first_name(value) {
    if (!value) throw new Error("first_name is mandatory");
    this.#first_name = value;
  }

  set last_name(value) {
    this.#last_name = value;
  }

  set age(value) {
    this.#age = value;
  }

  set profile_picture(value) {
    this.#profile_picture = value;
  }

  set orders(value) {
    this.#orders = value;
  }

  toPOJO() {
    return {
      _id: this.#_id,
      email: this.#email,
      password: this.password,
      first_name: this.#first_name,
      last_name: this.#last_name,
      age: this.#age,
      profile_picture: this.#profile_picture,
      role: this.#role,
      orders: this.#orders,
    };
  }
}
