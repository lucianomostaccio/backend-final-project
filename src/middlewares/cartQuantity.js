import { getDaoCarts } from "../daos/carts/cart.dao.js";

export const addCartQuantityToLocals = async (req, res, next) => {
  if (req.user) {
    const daoCarts = getDaoCarts();
    const cart = await daoCarts.readOne({ userId: req.user._id });
    res.locals.cartQuantity = cart
      ? cart.products.reduce((sum, item) => sum + item.quantity, 0)
      : 0;
  } else {
    res.locals.cartQuantity = 0;
  }
  next();
};
