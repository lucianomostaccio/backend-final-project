import Logger from "../utils/logger.js";

export function errorsHandler(error, req, res, next) {
  switch (error.type) {
    case "INVALID_ARGUMENT":
      res.status(400);
      break;
    case "FAILED_AUTHENTICATION":
      res.status(401);
      break;
    case "FAILED_AUTHORIZATION":
      res.status(403);
      break;
    case "INTERNAL_ERROR":
      res.status(500);
      break;
    default:
      Logger.warning("unexpected error!");
      Logger.debug(JSON.stringify(error, null, 2));
      res.status(500);
  }
  res.json({ status: "error", message: error.message });
}
