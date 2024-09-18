import { getDaoUsers } from "../daos/users/users.dao.js";

export const addImagePathToLocals = async (req, res, next) => {
  if (req.user) {
    const usersDao = getDaoUsers();
    const email = req.user.email;
    const user = await usersDao.readOne({ email }, { password: 0 });

    if (user.profile_picture) {
      let fullImageUrl;

      // Verify if the image path is an absolute URL (starts with http:// or https://)
      if (/^https?:\/\//.test(user.profile_picture)) {
        fullImageUrl = user.profile_picture; // absolute URL, do not modify
      } else {
        // URL is relative, so we need to prepend the base URL
        const basePath = process.env.BASE_URL || "http://localhost:8080";
        const normalizedImagePath = user.profile_picture.replace(/\\/g, "/");
        const imageUrlPath = normalizedImagePath.replace("src/static/", "");
        fullImageUrl = `${basePath}/${imageUrlPath}`;
      }

      res.locals.fullImageUrl = fullImageUrl;
    }
  }
  next();
};
