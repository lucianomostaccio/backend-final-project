import cookieParser from "cookie-parser";
import { COOKIE_SECRET } from "../config/config.js";
import csrf from "lusca/lib/csrf";

export const cookies = cookieParser(COOKIE_SECRET);
export const csrfProtection = csrf({
    cookie: true, 
});
