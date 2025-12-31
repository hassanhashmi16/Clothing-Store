import mongoose from "mongoose";
import Product from "./Product";
import User from "./User";

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    size: {
        type: String,
        required: true
    },

    color: {
        type: String,
        required: true
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true // one cart per user
    },

    items: {
        type: [cartItemSchema],
        default: []
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Cart = mongoose.models.carts || mongoose.model("carts", cartSchema)
export default Cart