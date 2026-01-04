'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

const SORT_OPTIONS = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
];

export default function SortDropdown() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentSort = searchParams.get('sort') || 'newest';
    const currentLabel = SORT_OPTIONS.find(opt => opt.value === currentSort)?.label || 'Newest';

    const handleSort = (value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === 'newest') {
            params.delete('sort');
        } else {
            params.set('sort', value);
        }
        router.push(`?${params.toString()}`, { scroll: false });
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 group"
            >
                <span className="text-stone-500 text-[10px] tracking-[0.2em] uppercase font-medium">Sort by:</span>
                <span className="text-stone-900 text-[10px] tracking-[0.2em] uppercase font-bold border-b border-transparent group-hover:border-stone-900 transition-all flex items-center gap-1">
                    {currentLabel}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-48 bg-white border border-stone-100 shadow-xl z-50 py-2 origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSort(option.value)}
                            className={`w-full text-left px-6 py-2.5 text-[10px] tracking-[0.15em] uppercase transition-colors
                                ${currentSort === option.value
                                    ? 'bg-stone-50 text-stone-900 font-bold'
                                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
