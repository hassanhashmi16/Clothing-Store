'use client';

import React, { useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import { ShoppingBag, Check } from 'lucide-react';

export default function AddToCartSection({ product }) {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleAddToCart = async () => {
        if (!selectedSize && product.sizes?.length > 0) {
            alert('Please select a size');
            return;
        }

        setAdding(true);
        const result = await addToCart(product._id, quantity, selectedSize, selectedColor);
        setAdding(false);

        if (result) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        }
    };

    return (
        <div className="space-y-8">
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
                                onClick={() => setSelectedSize(size)}
                                className={`min-w-[48px] h-12 border flex items-center justify-center text-xs tracking-widest transition-all ${selectedSize === size
                                        ? 'border-stone-900 bg-stone-900 text-white'
                                        : 'border-stone-200 text-stone-900 hover:border-stone-400'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-[10px] tracking-[0.2em] uppercase font-medium text-stone-900 mb-4">Select Color</h2>
                    <div className="flex flex-wrap gap-4">
                        {product.colors.map((color) => (
                            <button
                                key={color}
                                title={color}
                                onClick={() => setSelectedColor(color)}
                                className="group relative flex items-center justify-center"
                            >
                                <div
                                    className={`w-8 h-8 rounded-full border transition-all ${selectedColor === color ? 'border-stone-900 scale-110' : 'border-stone-200'
                                        }`}
                                    style={{ backgroundColor: color.toLowerCase() }}
                                />
                                {selectedColor === color && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Check size={12} className={['white', 'light', 'yellow'].includes(color.toLowerCase()) ? 'text-stone-900' : 'text-white'} />
                                    </div>
                                )}
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] tracking-widest text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase">
                                    {color}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-8 border-t border-stone-100">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-stone-200 h-12">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-4 h-full hover:bg-stone-50 transition-colors"
                        >
                            -
                        </button>
                        <span className="px-4 text-sm font-medium w-12 text-center">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-4 h-full hover:bg-stone-50 transition-colors"
                        >
                            +
                        </button>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={adding}
                        className={`flex-grow h-12 flex items-center justify-center space-x-3 transition-all ${success
                                ? 'bg-green-600 text-white'
                                : 'bg-stone-900 text-white hover:bg-stone-800'
                            }`}
                    >
                        {adding ? (
                            <span className="text-xs uppercase tracking-widest animate-pulse">Adding...</span>
                        ) : success ? (
                            <>
                                <Check size={18} />
                                <span className="text-xs uppercase tracking-widest">Added to Cart</span>
                            </>
                        ) : (
                            <>
                                <ShoppingBag size={18} />
                                <span className="text-xs uppercase tracking-widest">Add to Bag</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
