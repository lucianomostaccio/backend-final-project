import {
  EXECUTION_MODE,
  NODEMAILER_GMAIL_OPTIONS,
  NODE_ENV,
} from "../../config/config.js";
import { EmailServiceConsole } from "./email.service.console.js";
import { EmailServiceNodemailer } from "./email.service.nodemailer.js";
import { fakeEmailService } from "./email.service.fake.js";
import Logger from "../../utils/logger.js";

let emailService;

// @ts-ignore
if (EXECUTION_MODE === "online" && NODE_ENV === "prod") {
  if (!emailService) {
    emailService = new EmailServiceNodemailer(NODEMAILER_GMAIL_OPTIONS);
    Logger.info("sending emails using gmail");
  }
  // @ts-ignore
} else if (EXECUTION_MODE === "offline" && NODE_ENV === "dev") {
  emailService = new EmailServiceConsole();
  Logger.info("sending emails using console");
  // @ts-ignore
} else {
  emailService = fakeEmailService;
  Logger.info("Sending EMAIL using fake service");
}

export function getEmailService() {
  return emailService;
}
