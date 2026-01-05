'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
    const { cart, loading, updateQuantity, removeFromCart, getCartTotal } = useCart();

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-300">
                            <ShoppingBag size={24} strokeWidth={1} />
                        </div>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400">Loading Bag</p>
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
                <div className="mb-12 text-center">
                    <h1 className="text-3xl font-serif text-stone-900 mb-2 uppercase tracking-tight">Shopping Bag</h1>
                    <p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase">
                        {cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'} in your curated selection
                    </p>
                </div>

                {cart.items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border-t border-stone-100">
                        <ShoppingBag size={48} strokeWidth={0.5} className="text-stone-300 mb-6" />
                        <p className="text-stone-500 font-light mb-8">Your shopping bag is currently empty.</p>
                        <Link
                            href="/"
                            className="px-8 py-3 bg-stone-900 text-white text-[10px] tracking-[0.2em] uppercase hover:bg-stone-800 transition-all flex items-center space-x-2"
                        >
                            <span>Explore Collection</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        {/* Items List */}
                        <div className="lg:col-span-2 space-y-8">
                            {cart.items.map((item) => (
                                <div key={item._id} className="flex space-x-6 pb-8 border-b border-stone-100 group">
                                    <div className="w-24 h-32 sm:w-32 sm:h-40 bg-stone-100 overflow-hidden rounded-sm flex-shrink-0">
                                        <img
                                            src={item.productId?.images?.[0] || 'https://via.placeholder.com/300x400'}
                                            alt={item.productId?.name}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                                        />
                                    </div>

                                    <div className="flex-grow flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-sm font-medium text-stone-900 uppercase tracking-wide">
                                                    {item.productId?.name}
                                                </h3>
                                                <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">
                                                    {item.productId?.subcategory}
                                                </p>
                                            </div>
                                            <p className="text-sm font-medium text-stone-900">
                                                ${(item.productId?.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="mt-2 space-y-1 text-[11px] text-stone-500 tracking-wide">
                                            <p><span className="text-stone-300 uppercase mr-2 text-[10px]">Size:</span> {item.size}</p>
                                            <p><span className="text-stone-300 uppercase mr-2 text-[10px]">Color:</span> {item.color}</p>
                                        </div>

                                        <div className="mt-auto flex justify-between items-center">
                                            <div className="flex items-center border border-stone-100">
                                                <button
                                                    onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                                                    className="p-1.5 hover:bg-stone-50 transition-colors text-stone-400 hover:text-stone-900"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="p-1.5 hover:bg-stone-50 transition-colors text-stone-400 hover:text-stone-900"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-stone-300 hover:text-red-400 transition-colors flex items-center space-x-1.5 group/del"
                                            >
                                                <Trash2 size={14} strokeWidth={1.5} />
                                                <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover/del:opacity-100 transition-opacity">Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Panel */}
                        <div className="lg:col-span-1">
                            <div className="bg-stone-50 p-8 rounded-sm sticky top-32">
                                <h2 className="text-[11px] font-semibold tracking-[0.3em] uppercase text-stone-900 mb-8 pb-4 border-b border-stone-200">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-xs tracking-wide text-stone-600">
                                        <span>Subtotal</span>
                                        <span>${getCartTotal().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs tracking-wide text-stone-600">
                                        <span>Shipping</span>
                                        <span className="text-[10px] uppercase tracking-tighter text-stone-400">Calculated at checkout</span>
                                    </div>
                                    <div className="pt-4 border-t border-stone-200 flex justify-between">
                                        <span className="text-sm font-medium uppercase tracking-widest text-stone-900">Total</span>
                                        <span className="text-lg font-serif text-stone-900">${getCartTotal().toFixed(2)}</span>
                                    </div>
                                </div>

                                <button className="w-full bg-stone-900 text-white py-4 text-[10px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-stone-800 transition-all flex items-center justify-center space-x-3 mb-4">
                                    <span>Secure Checkout</span>
                                    <ArrowRight size={14} />
                                </button>

                                <p className="text-[9px] text-stone-400 text-center uppercase tracking-widest leading-relaxed">
                                    Complimentary shipping on orders over $500. <br />
                                    Prices include all duties and taxes.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
