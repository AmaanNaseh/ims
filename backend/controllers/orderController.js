const Product = require("../models/Product");
const User = require("../models/User");
const Cart = require("../models/Cart");

exports.bookOrder = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product || product.quantity < quantity) {
      return res.status(400).json({ msg: "Not enough stock" });
    }

    // Deduct the quantity from product stock

    // Store user order on product document
    product.orders.push({
      user: req.user.id, // Store user ID
      quantity,
      date: new Date(), // Store the date of the order
    });

    await product.save();

    const user = await User.findById(req.user.id);
    user.orderHistory.push({
      product: product._id,
      quantity,
      date: new Date(),
    });
    await user.save();

    // Remove item from cart after successful booking
    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.products = cart.products.filter(
        (item) => item.productId.toString() !== productId
      );
      await cart.save();
    }

    res.json({ msg: "Order booked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error booking order" });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "orderHistory.product"
    );
    res.json(user.orderHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error fetching order history" });
  }
};
