import { NextResponse } from "next/server";
import Product from "@/app/models/Product";
import { dbConnect } from "@/app/lib/dbConnect";


export async function GET(request) {
    try {
        await dbConnect()
        const { searchParams } = new URL(request.url)

        // Minimal query building
        const query = {}

        const category = searchParams.get('category')
        if (category) query.category = category

        const featured = searchParams.get('featured')
        if (featured) query.featured = featured === 'true'

        const sizes = searchParams.get('sizes')
        if (sizes) query.sizes = { $in: sizes.split(',') }

        const search = searchParams.get('search')
        if (search) query.name = { $regex: search, $options: 'i' }

        const products = await Product.find(query).sort({ createdAt: -1 })

        return NextResponse.json({
            success: true,
            count: products.length,
            data: products
        })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        await dbConnect()
        const body = await request.json()
        const product = await Product.create(body)
        return NextResponse.json({
            success: true,
            data: product
        })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}