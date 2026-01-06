'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useCart } from '@/app/context/CartContext';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { ChevronRight, ShoppingBag, Truck, CreditCard, ShieldCheck, Wallet, Loader2 } from 'lucide-react';

export default function ShippingPage() {
    const { cart, getCartTotal, clearCart } = useCart();
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: session?.user?.email || '',
        firstName: session?.user?.name?.split(' ')[0] || '',
        lastName: session?.user?.name?.split(' ').slice(1).join(' ') || '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Pakistan',
        shippingMethod: 'standard',
        paymentMethod: 'cod'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const subtotal = getCartTotal();
    const shippingCost = formData.shippingMethod === 'express' ? 25 : 0;
    const total = subtotal + shippingCost;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!session) {
            alert('Please sign in to complete your order');
            return;
        }

        if (cart.items.length === 0) {
            alert('Your bag is empty');
            return;
        }

        try {
            setLoading(true);
            const orderData = {
                shippingDetails: {
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    country: formData.country,
                },
                subtotal,
                shippingCost,
                total,
                paymentMethod: formData.paymentMethod
            };

            const response = await axios.post('/api/orders', orderData);

            if (response.status === 201) {
                // Cart is cleared by the backend, but we update context too
                clearCart();
                router.push(`/checkout/success?orderId=${response.data._id}`);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert(error.response?.data?.error || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-4 mb-12 text-[11px] uppercase tracking-[0.2em] justify-center">
                    <Link href="/cart" className="text-stone-400 hover:text-stone-900 transition-colors">Bag</Link>
                    <ChevronRight size={14} className="text-stone-300" />
                    <span className="text-stone-900 font-medium tracking-widest underline decoration-stone-200 underline-offset-8">Checkout</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    {/* Left Column: Information & Options */}
                    <div className="lg:col-span-7 space-y-12 order-2 lg:order-1">
                        {/* 1. Details */}
                        <section>
                            <h2 className="text-[11px] font-semibold tracking-[0.4em] uppercase text-stone-900 mb-8 border-b border-stone-100 pb-3">
                                01. Shipping Details
                            </h2>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                <div className="col-span-2">
                                    <label className="text-[9px] uppercase tracking-[0.2em] text-stone-400 block mb-1 font-light">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-0 py-2 bg-transparent border-b border-stone-100 text-sm focus:outline-none focus:border-stone-900 transition-colors placeholder:text-stone-200 font-light"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.2em] text-stone-400 block mb-1 font-light">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="..."
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full px-0 py-2 bg-transparent border-b border-stone-100 text-sm focus:outline-none focus:border-stone-900 transition-colors placeholder:text-stone-200 font-light"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.2em] text-stone-400 block mb-1 font-light">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="..."
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-0 py-2 bg-transparent border-b border-stone-100 text-sm focus:outline-none focus:border-stone-900 transition-colors placeholder:text-stone-200 font-light"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[9px] uppercase tracking-[0.2em] text-stone-400 block mb-1 font-light">Street Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="..."
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-0 py-2 bg-transparent border-b border-stone-100 text-sm focus:outline-none focus:border-stone-900 transition-colors placeholder:text-stone-200 font-light"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.2em] text-stone-400 block mb-1 font-light">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="..."
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-0 py-2 bg-transparent border-b border-stone-100 text-sm focus:outline-none focus:border-stone-900 transition-colors placeholder:text-stone-200 font-light"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.2em] text-stone-400 block mb-1 font-light">State / Province</label>
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="..."
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="w-full px-0 py-2 bg-transparent border-b border-stone-100 text-sm focus:outline-none focus:border-stone-900 transition-colors placeholder:text-stone-200 font-light"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.2em] text-stone-400 block mb-1 font-light">Zip / Postal Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        placeholder="..."
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        className="w-full px-0 py-2 bg-transparent border-b border-stone-100 text-sm focus:outline-none focus:border-stone-900 transition-colors placeholder:text-stone-200 font-light"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.2em] text-stone-400 block mb-1 font-light">Country</label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="w-full px-0 py-2 bg-transparent border-b border-stone-100 text-sm focus:outline-none focus:border-stone-900 transition-colors text-stone-600 font-light appearance-none"
                                    >
                                        <option value="Pakistan">Pakistan</option>
                                        <option value="United States">United States</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* 2. Mode */}
                        <section>
                            <h2 className="text-[11px] font-semibold tracking-[0.4em] uppercase text-stone-900 mb-8 border-b border-stone-100 pb-3">
                                02. Shipping Method
                            </h2>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, shippingMethod: 'standard' }))}
                                    className={`flex-1 p-5 border transition-all text-left ${formData.shippingMethod === 'standard' ? 'border-stone-900 bg-stone-50' : 'border-stone-100 hover:border-stone-200'}`}
                                >
                                    <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-stone-900">Standard</p>
                                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1 font-light italic">Free • 3-5 Days</p>
                                </button>
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, shippingMethod: 'express' }))}
                                    className={`flex-1 p-5 border transition-all text-left ${formData.shippingMethod === 'express' ? 'border-stone-900 bg-stone-50' : 'border-stone-100 hover:border-stone-200'}`}
                                >
                                    <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-stone-900">Express</p>
                                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1 font-light italic">$25 • 1-2 Days</p>
                                </button>
                            </div>
                        </section>

                        {/* 3. Payment */}
                        <section>
                            <h2 className="text-[11px] font-semibold tracking-[0.4em] uppercase text-stone-900 mb-8 border-b border-stone-100 pb-3">
                                03. Payment Method
                            </h2>
                            <div className="space-y-3">
                                <label className={`flex items-center justify-between p-5 border cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-stone-900 bg-stone-50' : 'border-stone-100 hover:border-stone-200'}`}>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={handleInputChange}
                                            className="mr-4 accent-stone-900"
                                        />
                                        <div>
                                            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-stone-900">Cash on Delivery</p>
                                            <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1 font-light italic">Pay when you receive</p>
                                        </div>
                                    </div>
                                    <Wallet size={16} className="text-stone-300" strokeWidth={1} />
                                </label>
                                <label className={`flex items-center justify-between p-5 border cursor-pointer transition-all ${formData.paymentMethod === 'online' ? 'border-stone-900 bg-stone-50' : 'border-stone-100 hover:border-stone-200'}`}>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online"
                                            checked={formData.paymentMethod === 'online'}
                                            onChange={handleInputChange}
                                            className="mr-4 accent-stone-900"
                                        />
                                        <div>
                                            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-stone-900">Online Payment</p>
                                            <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1 font-light italic">Card / Digital Wallet</p>
                                        </div>
                                    </div>
                                    <CreditCard size={16} className="text-stone-300" strokeWidth={1} />
                                </label>
                            </div>
                        </section>

                        <div className="pt-8 text-center sm:text-left">
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full sm:w-auto px-12 py-5 bg-stone-900 text-white text-[11px] font-semibold tracking-[0.3em] uppercase hover:bg-stone-800 disabled:bg-stone-400 transition-all flex items-center justify-center space-x-4 group mx-auto sm:mx-0"
                            >
                                {loading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <>
                                        <span>{formData.paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'}</span>
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            <p className="mt-4 text-[9px] text-stone-400 tracking-[0.2em] uppercase font-light">
                                SSL Secure checkout encryption enabled
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Mini Summary */}
                    <div className="lg:col-span-5 order-1 lg:order-2">
                        <div className="bg-stone-50 p-8 sticky top-32">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-[11px] font-semibold tracking-[0.4em] uppercase text-stone-900">
                                    Summary
                                </h2>
                                <p className="text-[10px] text-stone-400 uppercase tracking-[0.1em]">
                                    {cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'}
                                </p>
                            </div>

                            <div className="max-h-80 overflow-y-auto pr-4 mb-8 space-y-6 scrollbar-thin scrollbar-thumb-stone-200">
                                {cart.items.map((item) => (
                                    <div key={item._id} className="flex space-x-4">
                                        <div className="relative w-14 h-18 bg-white border border-stone-100 flex-shrink-0">
                                            <img
                                                src={item.productId?.images?.[0] || 'https://via.placeholder.com/300x400'}
                                                alt={item.productId?.name}
                                                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                                            />
                                        </div>
                                        <div className="flex-grow pt-1">
                                            <h3 className="text-[11px] font-medium text-stone-900 uppercase tracking-wide line-clamp-1">
                                                {item.productId?.name}
                                            </h3>
                                            <p className="text-[9px] text-stone-400 uppercase tracking-[0.1em] mt-1 font-light">
                                                {item.size} / QTY {item.quantity}
                                            </p>
                                        </div>
                                        <p className="text-[11px] font-medium text-stone-900 pt-1">
                                            ${(item.productId?.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-stone-200">
                                <div className="flex justify-between text-[11px] tracking-[0.1em] text-stone-500 uppercase font-light">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] tracking-[0.1em] text-stone-500 uppercase font-light">
                                    <span>Shipping</span>
                                    <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                                </div>
                                <div className="pt-6 mt-4 border-t border-stone-900 flex justify-between items-baseline">
                                    <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-stone-900">Total</span>
                                    <span className="text-2xl font-serif text-stone-900 tracking-tight">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}