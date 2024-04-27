import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const MONGODB_CNX_STR = process.env.MONGODB_CNX_STR || 'mongodb://127.0.0.1/luciano_14'
export const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1/luciano_14'
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
export const DEFAULT_USER_AVATAR_PATH = process.env.DEFAULT_USER_AVATAR_PATH;
export const DEFAULT_ROLE = 'user'
export const EMAIL_USER = process.env.EMAIL_USER || "test email user";
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const ADMIN_SMS_NUMBER = process.env.ADMIN_SMS_NUMBER;
export const TWILIO_SMS_NUMBER = process.env.TWILIO_SMS_NUMBER;


export const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || "";
export const COOKIE_SECRET = process.env.COOKIE_SECRET || "";

export const EXECUTION_MODE = "online";
// export const EXECUTION_MODE = "offline;"
export const NODE_ENV = "prod";
// export const NODE_ENV = "dev"

export const SWAGGER_CONFIG = {
  definition: {
    openapi: "3.0.1",
    info: {
      version: "1",
      title: "Swagger doc final project",
      description: "Swagger documentation for my final project",
    },
  },
  apis: ["./docs/**/*.yaml"],
};

export const NODEMAILER_GMAIL_OPTIONS = {
  service: "gmail",
  port: 587,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  origin: process.env.EMAIL_USER,
};

export const TWILIO_SMS_OPTIONS = {
  sid: process.env.TWILIO_SID,
  authToken: process.env.TWILIO_TOKEN,
  origin: process.env.TWILIO_SMS_NUMBER,
};
