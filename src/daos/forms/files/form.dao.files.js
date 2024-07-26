import fs from "fs/promises";
import { matches } from "../../utils.js";

export class FormDaoFiles {
  constructor(path) {
    this.path = path;
  }
  async #writeForms(forms) {
    try {
      await fs.writeFile(this.path, JSON.stringify(forms, null, 2));
    } catch (error) {
      console.error("Error writing forms to file:", error);
    }
  }
}
