'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from 'lucide-react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="flex-grow flex items-center justify-center py-20 px-4">
            <div className="max-w-md w-full text-center space-y-10">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-stone-100 rounded-full scale-150 -z-10 animate-pulse"></div>
                    <CheckCircle2 size={80} className="text-stone-900 mx-auto" strokeWidth={1} />
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-serif text-stone-900 italic tracking-tight">
                        Thank you for your order
                    </h1>
                    <p className="text-stone-500 text-sm uppercase tracking-[0.2em] font-light px-8">
                        Your order has been received and is being prepared for shipment.
                    </p>
                </div>

                {orderId && (
                    <div className="bg-stone-50 p-6 border border-stone-100 rounded-sm">
                        <p className="text-[10px] text-stone-400 uppercase tracking-[0.3em] mb-2">Order Reference</p>
                        <p className="text-sm font-mono text-stone-900 select-all">#{orderId}</p>
                    </div>
                )}

                <div className="space-y-4 pt-6">
                    <Link
                        href="/"
                        className="w-full py-5 bg-stone-900 text-white text-[11px] font-semibold tracking-[0.4em] uppercase hover:bg-stone-800 transition-all flex items-center justify-center space-x-3 group"
                    >
                        <span>Continue Shopping</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href="/orders"
                        className="block text-[10px] text-stone-400 uppercase tracking-[0.3em] hover:text-stone-900 transition-colors"
                    >
                        View Order History
                    </Link>
                </div>

                <div className="pt-10 flex justify-center space-x-8 text-stone-300">
                    <div className="flex items-center space-x-2">
                        <Package size={16} strokeWidth={1} />
                        <span className="text-[9px] uppercase tracking-widest text-stone-400">Tracked</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ShoppingBag size={16} strokeWidth={1} />
                        <span className="text-[9px] uppercase tracking-widest text-stone-400">Insured</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Navbar />
            <Suspense fallback={
                <div className="flex-grow flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin"></div>
                </div>
            }>
                <SuccessContent />
            </Suspense>
            <Footer />
        </div>
    );
}
