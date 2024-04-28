import { ticketsService } from "../services/tickets.service.js";
import { cartsService } from "../services/carts.service.js";

export async function postController(req, res, next) {
  console.log("Received request to create a ticket for user:", req.user?._id);
  try {
    if (!req.user || !req.user._id) {
      console.log("Authentication error: User not found.");
      res
        .status(401)
        .json({ message: "Authentication error. User not found." });
      return;
    }

    const cart = await cartsService.readOne(req.user._id);
    if (!cart) {
      console.log("No cart found for user:", req.user._id);
      res.status(404).json({ message: "No cart found for this user." });
      return;
    }

    console.log("Calculating total price for cart:", cart._id);
    const totalPrice = await cartsService.calculateTotalPrice(cart._id);
    if (!totalPrice) {
      console.log("Failed to calculate total price for cart:", cart._id);
      res.status(500).json({ message: "Failed to calculate total price." });
      return;
    }

    console.log("Generating ticket for total price:", totalPrice);
    const ticketData = {
      code: [generateTicketCode()],
      amount: totalPrice,
      purchaser: req.user._id,
    };

    console.log("Ticket Data:", ticketData);

    const ticket = await ticketsService.addTicket(ticketData);
    console.log("Ticket created successfully:", ticket);

    console.log("Clearing cart post-ticket creation:", cart._id);
    const deleteResult = await cartsService.deleteCart(cart._id);
    console.log("Delete cart result:", deleteResult);
    if (!deleteResult) {
      console.error("Failed to clear cart after ticket creation");
    }

    res.created(ticket);
  } catch (error) {
    console.error("Error in ticket creation process:", error);
    next(error);
  }
}

function generateTicketCode() {
  return "TKT-" + Date.now();
}
