import Logger from "../utils/logger.js";

export function errorsHandler(error, req, res, next) {
  console.log("Error handler invoked:");
  console.log("Error type:", error["type"]);
  console.log("Error message:", error.message);

  switch (error["type"]) {
    case "INVALID_ARGUMENT":
      res.status(400);
      break;
    case "FAILED_AUTHENTICATION":
      console.log("failed authentication errorsHandler");
      res.status(401);
      break;
    case "FAILED_AUTHORIZATION":
      res.status(403);
      break;
    case "INTERNAL_ERROR":
      console.log("internal error");
      res.status(500);
      break;
    default:
      Logger.warning("unexpected error!");
      Logger.debug(JSON.stringify(error, null, 2));
      res.status(500);
  }
  res.json({ status: "error", message: error.message });
}
