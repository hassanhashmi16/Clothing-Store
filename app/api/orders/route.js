import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/app/lib/dbConnect";
import Order from "@/app/models/Order";
import Cart from "@/app/models/Cart";
import Product from "@/app/models/Product"; // Ensure Product model is registered for populate

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { shippingDetails, subtotal, shippingCost, total, paymentMethod } = body;

        await dbConnect();

        // 1. Fetch the cart items
        const cart = await Cart.findOne({ userId: session.user.id }).populate("items.productId");

        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // 2. Format items for the Order model
        const orderItems = cart.items.map(item => ({
            productId: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.productId.images[0] || ""
        }));

        // 3. Create the order
        const order = new Order({
            userId: session.user.id,
            items: orderItems,
            totalAmount: total,
            shippingAddress: {
                street: shippingDetails.address,
                city: shippingDetails.city,
                state: shippingDetails.state,
                zipCode: shippingDetails.zipCode,
                country: shippingDetails.country
            },
            status: "pending",
            paymentStatus: paymentMethod === "cod" ? "pending" : "pending", // Update based on real payment integration later
            createdAt: new Date()
        });

        await order.save();

        // 4. Clear the cart
        cart.items = [];
        await cart.save();

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Order Creation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Orders GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
