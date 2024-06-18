import { getDaoUsers } from "../daos/users/users.dao.js";

export const addImagePathToLocals = async (req, res, next) => {
  if (req.user) {
    const usersDao = getDaoUsers();
    const email = req.user.email;
    const user = await usersDao.readOne({ email }, { password: 0 });

    if (user.profile_picture) {
      const basePath = process.env.BASE_URL || "http://localhost:8080";
      const normalizedImagePath = user.profile_picture.replace(/\\/g, "/");
      const imageUrlPath = normalizedImagePath.replace("src/static/", "");
      user.fullImageUrl = `${basePath}/${imageUrlPath}`;

      res.locals.fullImageUrl = user.fullImageUrl;
    }
  }
  next();
};