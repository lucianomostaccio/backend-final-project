import { model } from "mongoose";
import { EXECUTION_MODE } from "../../config/config.js";

import { formDaoMongoose } from "./mongoose/form.dao.mongoose.js";

import { formSchema } from "./mongoose/form.model.mongoose.js";
import Logger from "../../utils/logger.js";
import { FormDaoFiles } from "./files/form.dao.files.js";
const PATH_FORMS_FILES = "./db/forms.json";

let daoForm;

// @ts-ignore
if (EXECUTION_MODE === "online") {
  if (!daoForm) {
    const formModel = model("contactforms", formSchema);
    daoForm = new formDaoMongoose(formModel);
    Logger.info("using mongodb persistence - forms");
    Logger.debug("using mongodb persistence - forms");
  }
} else {
  daoForm = new FormDaoFiles(PATH_FORMS_FILES);
  Logger.info("using files persistence - forms");
  Logger.debug("using files persistence - forms");
}

export function getDaoForm() {
  return daoForm;
}
