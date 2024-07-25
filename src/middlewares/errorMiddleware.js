// // errorMiddleware.js
// import errorDictionary from "../utils/errorDictionary.js";

// const errorMiddleware = (err, req, res, next) => {
//   if (err.code && errorDictionary[err.code]) {
//     const error = errorDictionary[err.code];
//     res.status(error.statusCode).json({ error: error.message });
//   } else {
//     //if error code is not in dictionary, send a generic error
//     res.status(500).json({ error: "An unexpected error occurred." });
//   }
//   next();
// };

// export default errorMiddleware;
