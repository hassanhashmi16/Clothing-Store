import { dbConnect } from "../lib/dbConnect";
import Product from "../models/Product";

export default async function ProductGrid() {
    await dbConnect();
    const products = await Product.find({ featured: true });

    return (
        <>
            <main id="featured-products" className="p-8">
                <h1 className="text-2xl font-bold mb-6">Featured Products</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="border p-4 rounded-lg shadow-sm">
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-48 object-cover mb-4 rounded"
                            />
                            <h2 className="font-semibold">{product.name}</h2>
                            <p className="text-gray-600">${product.price}</p>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
}
