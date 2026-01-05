import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
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

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    emailVerified: {
        type: Date,
        default: null
    },

    image: {
        type: String // Google profile pic
    },

    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    },

    addresses: {
        type: [addressSchema],
        default: []
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.models.users || mongoose.model("users", userSchema)
export default User