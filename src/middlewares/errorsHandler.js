import Logger from "../utils/logger.js";

export function errorsHandler(error, req, res, next) {
  Logger.warning("Error type:", error["type"]);
  Logger.error("Error message:", error.message);

  switch (error["type"]) {
    case "INVALID_ARGUMENT":
      res.status(400);
      break;
    case "FAILED_AUTHENTICATION":
      Logger.error("failed authentication errorsHandler");
      res.status(401);
      break;
    case "FAILED_AUTHORIZATION":
      res.status(403);
      break;
    case "INTERNAL_ERROR":
      Logger.error("internal error");
      res
        .status(500)
        .json({ error: "Internal Server Error", message: error.message });
      break;
    default:
      Logger.error("unexpected error!");
      Logger.debug(JSON.stringify(error, null, 2));
      res.status(500);
  }
  res.json({ status: "error", message: error.message });
}
