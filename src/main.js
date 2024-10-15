// server
import { app } from "./app/app.js";
import { PORT } from "./config/config.js";
import { connect } from "./database/database.js";
import Logger from "./utils/logger.js";

await connect();

// @ts-ignore
app.listen(PORT, () => {
  Logger.debug(`Server listening in port: ${PORT}`);
});
