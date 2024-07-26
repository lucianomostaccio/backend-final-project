import { formService } from "../services/contact.service.js";

export async function postController(req, res, next) {
  try {
    const form = await formService.addContactForm(req.body);
    res.created(form);
  } catch (error) {
    next(error);
  }
}
