'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'men',
        subcategory: '',
        stock: '',
        featured: false,
    });

    const [images, setImages] = useState(['']);
    const [sizes, setSizes] = useState(['S', 'M', 'L', 'XL']);
    const [colors, setColors] = useState(['Black', 'White']);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleArrayChange = (setter, index, value) => {
        setter(prev => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    };

    const addArrayItem = (setter) => setter(prev => [...prev, '']);
    const removeArrayItem = (setter, index) => setter(prev => prev.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                images: images.filter(img => img.trim() !== ''),
                sizes: sizes.filter(s => s.trim() !== ''),
                colors: colors.filter(c => c.trim() !== ''),
            };

            await axios.post('/api/admin/products', productData);
            router.push('/admin/products');
            router.refresh();
        } catch (error) {
            console.error('Failed to create product:', error);
            alert('Error creating product. Please check all fields.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/products"
                    className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 transition-colors"
                >
                    <ArrowLeft size={14} />
                    <span>Back to Catalog</span>
                </Link>
                <h1 className="text-[11px] font-semibold tracking-[0.4em] uppercase text-stone-900">
                    New Product Entry
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-16">
                {/* Basic Info */}
                <section className="space-y-8">
                    <div className="border-l-2 border-stone-900 pl-6">
                        <h2 className="text-[10px] uppercase tracking-[0.3em] text-stone-900 font-bold mb-1">Essential Details</h2>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest">Base identification and pricing</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium">Product Name</label>
                            <input
                                required
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-900 transition-colors"
                                placeholder="e.g. Minimalist Wool Overcoat"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium">Price (USD)</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-900 transition-colors"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium">Description</label>
                        <textarea
                            required
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-900 transition-colors resize-none"
                            placeholder="Describe the aesthetic and materials..."
                        />
                    </div>
                </section>

                {/* Classification */}
                <section className="space-y-8">
                    <div className="border-l-2 border-stone-900 pl-6">
                        <h2 className="text-[10px] uppercase tracking-[0.3em] text-stone-900 font-bold mb-1">Classification</h2>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest">Category and Inventory placement</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium">Primary Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-900 transition-colors uppercase tracking-widest appearance-none"
                            >
                                <option value="men">Men</option>
                                <option value="women">Women</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium">Subcategory</label>
                            <input
                                required
                                type="text"
                                name="subcategory"
                                value={formData.subcategory}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-900 transition-colors"
                                placeholder="e.g. Outerwear, Knitwear"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium">Stock Count</label>
                            <input
                                required
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-900 transition-colors"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </section>

                {/* Images */}
                <section className="space-y-8">
                    <div className="border-l-2 border-stone-900 pl-6">
                        <h2 className="text-[10px] uppercase tracking-[0.3em] text-stone-900 font-bold mb-1">Visual Assets</h2>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest">High-resolution image URLs</p>
                    </div>

                    <div className="space-y-4">
                        {images.map((url, index) => (
                            <div key={index} className="flex items-center space-x-4">
                                <div className="flex-grow space-y-2">
                                    <input
                                        required={index === 0}
                                        type="url"
                                        value={url}
                                        onChange={(e) => handleArrayChange(setImages, index, e.target.value)}
                                        className="w-full bg-white border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-900 transition-colors"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>
                                {images.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem(setImages, index)}
                                        className="p-3 text-stone-400 hover:text-rose-500 transition-colors bg-white border border-stone-100"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem(setImages)}
                            className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] text-stone-500 hover:text-stone-900 transition-colors font-medium border border-dashed border-stone-200 w-full justify-center py-4"
                        >
                            <Plus size={14} />
                            <span>Add Another Image URL</span>
                        </button>
                    </div>
                </section>

                {/* Variants */}
                <section className="space-y-8">
                    <div className="border-l-2 border-stone-900 pl-6">
                        <h2 className="text-[10px] uppercase tracking-[0.3em] text-stone-900 font-bold mb-1">Variants</h2>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest">Available sizing and colorways</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Sizes */}
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium">Available Sizes</label>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((size, index) => (
                                    <div key={index} className="flex items-center space-x-1 bg-white border border-stone-100 pl-3 pr-1 py-1">
                                        <input
                                            value={size}
                                            onChange={(e) => handleArrayChange(setSizes, index, e.target.value)}
                                            className="w-12 text-sm focus:outline-none border-0 p-0 text-center font-medium"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem(setSizes, index)}
                                            className="p-1 text-stone-300 hover:text-stone-600"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem(setSizes)}
                                    className="p-1.5 bg-stone-900 text-white hover:bg-stone-800 transition-colors"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Colors */}
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium">Color Palette</label>
                            <div className="flex flex-wrap gap-2">
                                {colors.map((color, index) => (
                                    <div key={index} className="flex items-center space-x-1 bg-white border border-stone-100 pl-3 pr-1 py-1">
                                        <input
                                            value={color}
                                            onChange={(e) => handleArrayChange(setColors, index, e.target.value)}
                                            className="w-20 text-sm focus:outline-none border-0 p-0 font-medium"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem(setColors, index)}
                                            className="p-1 text-stone-300 hover:text-stone-600"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem(setColors)}
                                    className="p-1.5 bg-stone-900 text-white hover:bg-stone-800 transition-colors"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="pt-12 border-t border-stone-100 flex items-center justify-between">
                    <label className="flex items-center space-x-4 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleInputChange}
                                className="sr-only"
                            />
                            <div className={`w-12 h-6 rounded-full border border-stone-200 transition-colors ${formData.featured ? 'bg-stone-900' : 'bg-stone-50'}`}></div>
                            <div className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-300 ${formData.featured ? 'translate-x-6 bg-white' : 'bg-stone-200'}`}></div>
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 group-hover:text-stone-900 transition-colors font-medium">Feature in Hero Collections</span>
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-stone-900 text-white px-12 py-4 text-[11px] uppercase tracking-[0.3em] font-semibold hover:bg-stone-800 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Publish Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}
