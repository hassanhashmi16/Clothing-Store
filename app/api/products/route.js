import { NextResponse } from "next/server";
import Product from "@/app/models/Product";
import { dbConnect } from "@/app/lib/dbConnect";


export async function GET() {
    try {
        await dbConnect()
        const products = await Product.find({ featured: true })
        return NextResponse.json({
            success: true,
            data: products
        })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}