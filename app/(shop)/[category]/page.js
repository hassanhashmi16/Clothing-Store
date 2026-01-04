import React, { Suspense } from 'react';
import { dbConnect } from '@/app/lib/dbConnect';
import Product from '@/app/models/Product';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Link from 'next/link';
import SortDropdown from '@/app/components/SortDropdown';
import SearchBar from '@/app/components/SearchBar';

export default async function CategoryPage({ params, searchParams }) {
    const { category } = await params;
    const { sort, q } = await searchParams;

    await dbConnect();

    // Map sort parameter to Mongoose sort object
    let sortConfig = { createdAt: -1 }; // Default to newest
    if (sort === 'price-asc') {
        sortConfig = { price: 1 };
    } else if (sort === 'price-desc') {
        sortConfig = { price: -1 };
    }

    // Build database query
    const query = { category: category.toLowerCase() };
    if (q) {
        query.name = { $regex: q, $options: 'i' };
    }

    // Fetch products for the specific category with sorting and search
    const products = await Product.find(query).sort(sortConfig);

    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

    return (
        <div className="min-h-screen top-10 bg-white flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-serif tracking-tight text-stone-900 mb-4">
                        {categoryTitle} Collection
                    </h1>
                    <div className="h-px w-20 bg-stone-300 mx-auto" />

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-stone-100 pb-8">
                        <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                            <p className="text-stone-500 text-[10px] tracking-[0.2em] uppercase font-medium">
                                {products.length} Products Found
                            </p>
                            <div className="h-4 w-px bg-stone-200 hidden sm:block" />
                            <Suspense fallback={<div className="h-4 w-32 bg-stone-100 animate-pulse" />}>
                                <SearchBar />
                            </Suspense>
                        </div>
                        <div className="pt-2 sm:pt-0">
                            <Suspense fallback={<div className="h-4 w-20 bg-stone-100 animate-pulse" />}>
                                <SortDropdown />
                            </Suspense>
                        </div>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-stone-500 italic">No products found in this collection.</p>
                        <Link href="/" className="mt-8 inline-block text-stone-900 border-b border-stone-900 pb-1 text-sm tracking-widest hover:text-stone-600 hover:border-stone-600 transition-all">
                            RETURN TO HOME
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {products.map((product) => (
                            <Link
                                key={product._id}
                                href={`/products/${product._id}`}
                                className="group flex flex-col"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 rounded-sm mb-4">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-sm font-medium tracking-tight text-stone-900 group-hover:text-stone-600 transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-stone-500 font-light">
                                        ${product.price}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

// Generate static params if possible or just use dynamic rendering
export async function generateMetadata({ params }) {
    const { category } = await params;
    const title = category.charAt(0).toUpperCase() + category.slice(1);
    return {
        title: `${title} Collection | ELEGANCE`,
        description: `Explore our curated selection of ${category}'s premium clothing and accessories.`,
    };
}
