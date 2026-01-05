import React from 'react';
import { dbConnect } from "@/app/lib/dbConnect";
import Product from "@/app/models/Product";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from 'next/link';
import AddToCartSection from "@/app/components/AddToCartSection";

export default async function ProductPage({ params }) {
    const { category, id } = await params;

    await dbConnect();
    const product = await Product.findById(id).lean();

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center pt-32">
                    <div className="text-center">
                        <h1 className="text-2xl font-serif text-stone-900 mb-4">Product Not Found</h1>
                        <Link href={`/${category}`} className="text-stone-500 hover:text-stone-900 underline underline-offset-4 text-sm tracking-widest uppercase">
                            Back to Collection
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Breadcrumbs */}
                <nav className="mb-12">
                    <ol className="flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase text-stone-400">
                        <li><Link href="/" className="hover:text-stone-900 transition-colors">Home</Link></li>
                        <li><span className="mx-2">/</span></li>
                        <li><Link href={`/${category}`} className="hover:text-stone-900 transition-colors">{category}</Link></li>
                        <li><span className="mx-2">/</span></li>
                        <li className="text-stone-900 truncate">{product.name}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[3/4] bg-stone-100 overflow-hidden rounded-sm">
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.slice(1).map((img, idx) => (
                                    <div key={idx} className="aspect-[3/4] bg-stone-100 overflow-hidden rounded-sm">
                                        <img
                                            src={img}
                                            alt={`${product.name} view ${idx + 2}`}
                                            className="w-full h-full object-cover hover:opacity-80 transition-opacity cursor-pointer"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-2">
                                {product.subcategory}
                            </p>
                            <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 mb-4">
                                {product.name}
                            </h1>
                            <p className="text-xl text-stone-600 font-light">
                                ${product.price}
                            </p>
                        </div>

                        {product.description && (
                            <div className="mb-12">
                                <h2 className="text-[10px] tracking-[0.2em] uppercase font-medium text-stone-900 mb-4">Description</h2>
                                <p className="text-stone-500 leading-relaxed font-light">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Interactive Section */}
                        <AddToCartSection product={JSON.parse(JSON.stringify(product))} />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    await dbConnect();
    const product = await Product.findById(id);

    return {
        title: product ? `${product.name} | ELEGANCE` : 'Product Not Found',
        description: product?.description || 'View our premium collection.',
    };
}
