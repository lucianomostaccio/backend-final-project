import { usersService } from "../services/index.js";
import Logger from "../utils/logger.js";

export const sessionsPost = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    Logger.debug(req.body);
    const user = await usersService.authenticate({ email, password });
    await usersService.updateLastLogin(user._id);
    Logger.debug("user authenticated", user);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
