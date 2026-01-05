import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/app/lib/dbConnect";
import Cart from "@/app/models/Cart";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const cart = await Cart.findOne({ userId: session.user.id }).populate("items.productId");

        return NextResponse.json(cart || { items: [] });
    } catch (error) {
        console.error("Cart GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId, quantity, size, color } = await req.json();

        await dbConnect();
        let cart = await Cart.findOne({ userId: session.user.id });

        if (!cart) {
            cart = new Cart({ userId: session.user.id, items: [] });
        }

        // Check if item with same productId, size, and color already exists
        const itemIndex = cart.items.findIndex(
            (item) =>
                item.productId.toString() === productId &&
                item.size === size &&
                item.color === color
        );

        if (itemIndex > -1) {
            // Update quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({ productId, quantity, size, color });
        }

        cart.updatedAt = Date.now();
        await cart.save();

        return NextResponse.json(cart);
    } catch (error) {
        console.error("Cart POST Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const itemId = searchParams.get("itemId");

        if (!itemId) {
            return NextResponse.json({ error: "Item ID required" }, { status: 400 });
        }

        await dbConnect();
        const cart = await Cart.findOne({ userId: session.user.id });

        if (!cart) {
            return NextResponse.json({ error: "Cart not found" }, { status: 404 });
        }

        cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
        cart.updatedAt = Date.now();
        await cart.save();

        return NextResponse.json(cart);
    } catch (error) {
        console.error("Cart DELETE Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { itemId, quantity } = await req.json();

        if (!itemId || quantity < 1) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        await dbConnect();
        const cart = await Cart.findOne({ userId: session.user.id });

        if (!cart) {
            return NextResponse.json({ error: "Cart not found" }, { status: 404 });
        }

        const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            cart.updatedAt = Date.now();
            await cart.save();

            // Return populated cart
            const populatedCart = await Cart.findOne({ userId: session.user.id }).populate("items.productId");
            return NextResponse.json(populatedCart);
        } else {
            return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
        }
    } catch (error) {
        console.error("Cart PATCH Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
