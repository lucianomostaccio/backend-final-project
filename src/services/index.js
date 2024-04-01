// import { getDaoCarts } from '../daos/Carts/Carts.dao.js'
// import { productsService } from './products.service.js'
// import { NewslettersService } from './newsletters.service.js'
// import { CartsService } from './Carts.service.js'
import { getSmsService } from "./sms/sms.service.js";
import { UsersService } from "./users.service.js";
import { getDaoUsers } from "../daos/users/users.dao.js";
import { getDaoProducts } from "../daos/products/products.dao.js";
import { getEmailService } from "./email/email.service.js";
import { isValidPassword, createHash } from "../utils/hashing.js";

// const CartsDao = getDaoCarts()
// export const CartsService = new CartsService({ CartsDao, productsService })

// const suscriptoresDao = getDaoSuscriptores()
// export const newslettersService = new NewslettersService({ suscriptoresDao, emailService })

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
