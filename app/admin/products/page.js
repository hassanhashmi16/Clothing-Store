'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Package, Tag, Layers, Star } from 'lucide-react';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/admin/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            setDeletingId(id);
            await axios.delete(`/api/admin/products?id=${id}`);
            setProducts(products.filter(p => p._id !== id));
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('Failed to delete product');
        } finally {
            setDeletingId(null);
        }
    };

    const toggleFeatured = async (product) => {
        try {
            const updated = await axios.patch('/api/admin/products', {
                id: product._id,
                featured: !product.featured
            });
            setProducts(products.map(p => p._id === product._id ? updated.data : p));
        } catch (error) {
            console.error('Failed to toggle featured status:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-semibold tracking-[0.4em] uppercase text-stone-900">
                    Product Catalog ({products.length})
                </h2>
                <Link
                    href="/admin/products/new"
                    className="flex items-center space-x-2 bg-stone-900 text-white px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-stone-800 transition-colors"
                >
                    <Plus size={14} />
                    <span>Add Product</span>
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20 bg-white border border-stone-100 italic text-stone-400 text-sm font-light">
                    No products found in the catalog.
                </div>
            ) : (
                <div className="grid gap-4">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white border border-stone-100 p-6 flex items-center justify-between group hover:border-stone-200 transition-colors">
                            <div className="flex items-center space-x-6">
                                <div className="w-16 h-20 bg-stone-50 overflow-hidden shrink-0 border border-stone-100">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="text-sm font-medium text-stone-900 tracking-tight">{product.name}</h3>
                                        {product.featured && (
                                            <Star size={12} className="text-amber-400 fill-amber-400" />
                                        )}
                                    </div>
                                    <div className="flex items-center flex-wrap gap-4 text-[10px] uppercase tracking-[0.1em] text-stone-400 font-medium">
                                        <div className="flex items-center space-x-1.5 text-stone-500">
                                            <Tag size={12} />
                                            <span>{product.category}</span>
                                        </div>
                                        <div className="flex items-center space-x-1.5">
                                            <Layers size={12} />
                                            <span>{product.subcategory}</span>
                                        </div>
                                        <div className="flex items-center space-x-1.5">
                                            <Package size={12} />
                                            <span className={`${product.stock < 10 ? 'text-rose-500 font-bold' : 'text-stone-500'}`}>
                                                {product.stock} in stock
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-8">
                                <div className="text-right">
                                    <p className="text-sm font-serif text-stone-900 italic">${product.price.toFixed(2)}</p>
                                    <p className="text-[9px] text-stone-400 uppercase tracking-widest">Base Price</p>
                                </div>
                                <div className="h-8 w-[1px] bg-stone-100"></div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => toggleFeatured(product)}
                                        className={`p-2 transition-colors ${product.featured ? 'text-amber-500 bg-amber-50' : 'text-stone-300 hover:text-stone-400 bg-stone-50'}`}
                                        title={product.featured ? "Remove from Featured" : "Mark as Featured"}
                                    >
                                        <Star size={14} className={product.featured ? 'fill-amber-500' : ''} />
                                    </button>
                                    <Link
                                        href={`/admin/products/edit/${product._id}`}
                                        className="p-2 text-stone-400 hover:text-stone-900 bg-stone-50 transition-colors"
                                    >
                                        <Edit2 size={14} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        disabled={deletingId === product._id}
                                        className="p-2 text-stone-400 hover:text-rose-500 bg-stone-50 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
