import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/app/lib/dbConnect";
import Order from "@/app/models/Order";
import User from "@/app/models/User";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const orders = await Order.find({})
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        // Calculate stats
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalOrders = orders.length;

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const todayRevenue = orders
            .filter(order => new Date(order.createdAt) >= startOfToday)
            .reduce((sum, order) => sum + order.totalAmount, 0);

        return NextResponse.json({
            orders,
            stats: {
                totalRevenue,
                totalOrders,
                todayRevenue
            }
        });
    } catch (error) {
        console.error("Admin Orders GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { orderId, status } = await req.json();
        if (!orderId || !status) {
            return NextResponse.json({ error: "Order ID and status required" }, { status: 400 });
        }

        await dbConnect();
        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Admin Orders PATCH Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
