import { usersService } from '../services/index.js';

export const sessionsPost = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)
    const user = await usersService.authenticate({ email, password });
    await usersService.updateLastLogin(user._id);
    console.log("user authenticated", user)
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
