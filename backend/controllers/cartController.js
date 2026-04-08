import Cart from "../models/cart.model.js";

// ✅ ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity: 1 }]
      });
    } else {
      const item = cart.items.find(
        i => i.productId.toString() === productId
      );

      if (item) {
        item.quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }

      await cart.save();
    }

    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ GET CART (with product details)
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate("items.productId");

    if (!cart) return res.json({ items: [], total: 0 });

    // calculate total
    const total = cart.items.reduce((acc, item) => {
      return acc + item.productId.price * item.quantity;
    }, 0);

    res.json({ cart, total });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ REMOVE ITEM
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });

    cart.items = cart.items.filter(
      i => i.productId.toString() !== productId
    );

    await cart.save();

    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ UPDATE QUANTITY
export const updateQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });

    const item = cart.items.find(
      i => i.productId.toString() === productId
    );

    if (item) {
      item.quantity = quantity;
    }

    await cart.save();

    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ CLEAR CART
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: "Cart cleared" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};