'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
    const pathname = usePathname();

    const tabs = [
        { name: 'Orders', href: '/admin/orders' },
        { name: 'Products', href: '/admin/products' },
    ];

    return (
        <div className="flex flex-col space-y-8 mb-12">
            <div className="flex items-center justify-between border-b border-stone-200 pb-6">
                <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-stone-900 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.1)]"></div>
                    <h1 className="text-[14px] font-serif text-stone-900 italic tracking-widest">
                        ELEGANCE // <span className="text-[11px] font-sans not-italic font-semibold tracking-[0.4em] text-stone-400">ARCHIVE</span>
                    </h1>
                </div>

                <Link
                    href="/"
                    className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 transition-colors group"
                >
                    <span>Return to Shop</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
            </div>

            <nav className="flex items-center space-x-8">
                {tabs.map((tab) => {
                    const isActive = pathname.startsWith(tab.href);
                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={`text-[11px] font-semibold tracking-[0.4em] uppercase transition-colors relative py-1 ${isActive
                                    ? 'text-stone-900'
                                    : 'text-stone-300 hover:text-stone-500'
                                }`}
                        >
                            {tab.name}
                            {isActive && (
                                <div className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-stone-900 animate-in fade-in slide-in-from-left-2 duration-500"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
