import {
  EXECUTION_MODE,
  TWILIO_SMS_OPTIONS,
  NODE_ENV,
} from "../../config/config.js";
import Logger from "../../utils/logger.js";
import { SmsServiceConsole } from "./sms.service.console.js";
import { fakeSmsService } from "./sms.service.fake.js";
import { SmsServiceTwilio } from "./sms.service.twilio.js";

let smsService;

// @ts-ignore
if (EXECUTION_MODE === "online" && NODE_ENV === "prod") {
  if (!smsService) {
    smsService = new SmsServiceTwilio(TWILIO_SMS_OPTIONS);
    Logger.info("Sending SMS using Twilio");
  }
  // @ts-ignore
} else if (EXECUTION_MODE === "offline" && NODE_ENV === "dev") {
  smsService = new SmsServiceConsole();
  Logger.info("Sending SMS using console");
} else {
  smsService = fakeSmsService;
  Logger.info("Sending SMS using fake service");
}

export function getSmsService() {
  return smsService;
}
