import { getSmsService } from "./sms/sms.service.js";
import { UsersService } from "./users.service.js";
import { getDaoUsers } from "../daos/users/users.dao.js";
import { getDaoProducts } from "../daos/products/products.dao.js";
import { getEmailService } from "./email/email.service.js";
import { isValidPassword, createHash } from "../utils/hashing.js";
import { TicketsService } from "./tickets.service.js";
const smsService = getSmsService();
const usersDao = getDaoUsers();
const productsDao = getDaoProducts();
const emailService = getEmailService();

export const usersService = new UsersService({
  usersDao,
  productsDao,
  smsService,
  emailService,
  hashing: { isValidPassword, createHash },
});

export const ticketsService = new TicketsService(emailService);
