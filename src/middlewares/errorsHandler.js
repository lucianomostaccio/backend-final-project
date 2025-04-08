import Logger from "../utils/logger.js";

export function errorsHandler(error, req, res, next) {
  Logger.warning("Error type:", error["type"]);
  Logger.error("Error message:", error.message);

  // Set default values
  let statusCode = 500;
  let errorMessage = error.message || "Internal Server Error";
  let errorType = error["type"] || "INTERNAL_ERROR";

  switch (errorType) {
    case "INVALID_ARGUMENT":
      statusCode = 400;
      break;
    case "FAILED_AUTHENTICATION":
      Logger.error("Authentication failed:", errorMessage);
      statusCode = 401;
      break;
    case "FAILED_AUTHORIZATION":
      statusCode = 403;
      break;
    case "NOT_FOUND":
      statusCode = 404;
      break;
    case "VALIDATION_ERROR":
      statusCode = 422;
      break;
    case "INTERNAL_ERROR":
      Logger.error("Internal server error:", error);
      statusCode = 500;
      break;
    default:
      Logger.error("Unexpected error!", error);
      Logger.debug(JSON.stringify(error, null, 2));
      statusCode = 500;
  }

  res.status(statusCode).json({
    status: "error",
    message: errorMessage,
    code: statusCode,
  });
}
