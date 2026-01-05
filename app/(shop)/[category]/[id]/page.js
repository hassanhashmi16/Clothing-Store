import React from 'react';
import { dbConnect } from "@/app/lib/dbConnect";
import Product from "@/app/models/Product";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from 'next/link';

export default async function ProductPage({ params }) {
    const { category, id } = await params;

    await dbConnect();
    const product = await Product.findById(id);

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

                        {/* Sizes */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-[10px] tracking-[0.2em] uppercase font-medium text-stone-900">Select Size</h2>
                                    <button className="text-[10px] tracking-[0.1em] text-stone-400 underline underline-offset-4 hover:text-stone-900 transition-colors">
                                        Size Guide
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            className="min-w-[48px] h-12 border border-stone-200 flex items-center justify-center text-xs tracking-widest hover:border-stone-900 transition-colors"
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Colors */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-[10px] tracking-[0.2em] uppercase font-medium text-stone-900 mb-4">Select Color</h2>
                                <div className="flex flex-wrap gap-4">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            title={color}
                                            className="group relative flex items-center justify-center"
                                        >
                                            <div
                                                className="w-8 h-8 rounded-full border border-stone-200 transition-transform group-hover:scale-110"
                                                style={{ backgroundColor: color.toLowerCase() }}
                                            />
                                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] tracking-widest text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase">
                                                {color}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Note about Cart */}
                        <div className="mt-auto pt-8 border-t border-stone-100">
                            <p className="text-[10px] italic text-stone-400 text-center">
                                Add to cart functionality coming soon
                            </p>
                        </div>
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
