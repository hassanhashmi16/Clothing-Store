import mongoose from "mongoose";
import Product from "./Product";
import User from "./User";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
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
    },

    image: {
        type: String,
        required: true
    }
});

const shippingAddressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: {
        type: [orderItemSchema],
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    shippingAddress: {
        type: shippingAddressSchema,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered"],
        default: "pending"
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.models.orders || mongoose.model("orders", orderSchema)
export default Order