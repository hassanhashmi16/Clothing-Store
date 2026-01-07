import { dbConnect } from "../lib/dbConnect";
import Product from "../models/Product";
import Link from "next/link";

export default async function ProductGrid() {
    await dbConnect();

    // Fetch products for both categories
    const menProducts = await Product.find({ category: "men" }).limit(4);
    const womenProducts = await Product.find({ category: "women" }).limit(4);

    const CategorySection = ({ title, products, link }) => (
        <section className="mb-16">
            <div className="flex justify-between items-center mb-8">
                <Link href={link} className="group flex items-center gap-2">
                    <h2 className="text-3xl font-light tracking-widest uppercase transition-colors group-hover:text-amber-800">
                        {title}
                    </h2>
                    <span className="h-[1px] w-12 bg-black/20 group-hover:w-20 group-hover:bg-amber-800 transition-all duration-300"></span>
                </Link>
                <Link href={link} className="text-sm uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                    View All
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <Link key={product._id} href={`/${product.category}/${product._id}`} className="group flex flex-col cursor-pointer">
                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-sm mb-4">
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-sm font-medium tracking-tight text-gray-900 line-clamp-1">{product.name}</h3>
                            <p className="text-sm text-gray-500 font-light">${product.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );

    return (
        <main id="products-grid" className="max-w-7xl mx-auto px-6 py-20 bg-white">
            <CategorySection
                title="Men"
                products={menProducts}
                link="/men"
            />
            <CategorySection
                title="Women"
                products={womenProducts}
                link="/women"
            />
        </main>
    );
}
