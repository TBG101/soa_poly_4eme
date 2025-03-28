import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema({
  productId: String,
  quantity: Number,
  status: String,
});
const Order = mongoose.model("Order", OrderSchema);

export default Order;
