import { getDaoCarts } from "../daos/carts/cart.dao.js";

export const addCartQuantityToLocals = async (req, res, next) => {
  if (req.user) {
    console.log("req.user exists in cart quantity middleware", req.user);
    const daoCarts = getDaoCarts();
    const cart = await daoCarts.readOne({ userId: req.user._id });
    console.log("cart found", cart);
    res.locals.cartQuantity = cart
      ? cart.products.reduce((sum, item) => sum + item.quantity, 0)
      : 0;
  } else {
    console.log("req.user does not exist in cart quantity middleware", req.user);
    res.locals.cartQuantity = 0;
  }
  next();
};
