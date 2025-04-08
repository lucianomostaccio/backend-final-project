import { cartsService } from "../services/carts.service.js";
import { ticketsService } from "../services/index.js";
import Logger from "../utils/logger.js";

export async function postController(req, res, next) {
  Logger.debug("Processing ticket creation request for user:", req.user?._id);
  try {
    if (!req.user || !req.user._id) {
      Logger.warning(
        "Authentication error: User not found for ticket creation"
      );
      return res.status(401).json({
        error:
          "Authentication failed. User authentication is required to create a ticket.",
      });
    }

    const cart = await cartsService.readOne(req.user._id);
    if (!cart) {
      Logger.warning("No cart found for user:", req.user._id);
      return res.status(404).json({
        error: "No cart found for this user.",
      });
    }

    // Check if cart is empty
    if (!cart.products || cart.products.length === 0) {
      Logger.warning(
        "Attempted purchase with empty cart for user:",
        req.user._id
      );
      return res.status(400).json({
        error: "Cannot create ticket for an empty cart.",
      });
    }

    Logger.debug("Calculating total price for cart:", cart._id);
    const totalPrice = await cartsService.calculateTotalPrice(cart._id);
    if (!totalPrice) {
      Logger.error("Failed to calculate total price for cart:", cart._id);
      return res.status(500).json({
        error: "Failed to calculate total price.",
      });
    }

    Logger.debug("Generating ticket for total price:", totalPrice);
    const ticketData = {
      code: generateTicketCode(),
      amount: totalPrice,
      purchaser: req.user._id,
    };

    Logger.debug("Creating ticket with data:", ticketData);

    const ticket = await ticketsService.addTicket(ticketData);
    Logger.info("Ticket created successfully with ID:", ticket._id);

    // Instead of deleting the cart, we'll clear its products
    Logger.debug("Clearing cart after ticket creation:", cart._id);
    try {
      await cartsService.clearCart(cart._id);
      Logger.info("Cart cleared successfully after purchase");
    } catch (clearError) {
      Logger.error("Failed to clear cart after ticket creation:", clearError);
      // We don't want to fail the whole operation if clearing the cart fails
      // The ticket has been created successfully
    }

    res.status(201).json(ticket);
  } catch (error) {
    Logger.error("Error in ticket creation process:", error);
    res.status(500).json({
      error: "An internal error occurred while processing the ticket.",
    });
  }
}

function generateTicketCode() {
  return `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;
}

export async function getController(req, res, next) {
  try {
    const { ticketId } = req.params;

    if (ticketId) {
      Logger.debug("Fetching ticket by ID:", ticketId);
      const ticket = await ticketsService.getTicketById(ticketId);
      return res.status(200).json(ticket);
    }

    if (req.user && req.user._id) {
      Logger.debug("Fetching all tickets for user:", req.user._id);
      const tickets = await ticketsService.getTicketsByUser(req.user._id);
      return res.status(200).json(tickets);
    }

    return res.status(401).json({
      error:
        "Authentication failed. User authentication is required to view tickets.",
    });
  } catch (error) {
    Logger.error("Error retrieving tickets:", error);
    res.status(500).json({
      error: "An error occurred while retrieving tickets.",
    });
  }
}
