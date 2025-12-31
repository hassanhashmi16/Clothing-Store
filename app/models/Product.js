import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true,
        enum: ["men", "women"]
    },

    subcategory: {
        type: String,
        required: true
    },

    sizes: {
        type: [String], // ["S", "M", "L", "XL"]
        required: true
    },

    colors: {
        type: [String], // ["Black", "White", "Blue"]
        required: true
    },

    images: {
        type: [String], // image URLs
        required: true
    },

    stock: {
        type: Number,
        required: true
    },

    featured: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Product = mongoose.models.products || mongoose.model("products", productSchema)
export default Product