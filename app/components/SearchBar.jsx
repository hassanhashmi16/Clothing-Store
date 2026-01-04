'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [isPending, setIsPending] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const timeoutRef = useRef(null);

    const updateSearch = (value) => {
        setIsPending(true);
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('q', value);
        } else {
            params.delete('q');
        }

        router.push(`?${params.toString()}`, { scroll: false });
        setTimeout(() => setIsPending(false), 300);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            updateSearch(value);
        }, 500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            updateSearch(query);
            e.target.blur();
        }
    };

    const clearSearch = () => {
        setQuery('');
        updateSearch('');
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div className="relative w-full max-w-[200px] sm:max-w-xs group">
            <div className={`flex items-center gap-3 border-b transition-all duration-500 ${isFocused ? 'border-stone-800' : 'border-stone-200'
                }`}>
                <Search className={`w-3.5 h-3.5 transition-colors duration-500 ${isFocused ? 'text-stone-800' : 'text-stone-400'
                    }`} />
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="SEARCH..."
                    className="flex-grow bg-transparent border-none py-2 focus:ring-0 outline-none text-[10px] tracking-[0.2em] uppercase text-stone-900 placeholder:text-stone-300"
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="p-1 hover:bg-stone-50 transition-colors"
                    >
                        <X className="w-3 h-3 text-stone-400" />
                    </button>
                )}
            </div>

            {/* Status indicator line */}
            <div className={`absolute -bottom-px left-0 h-[1.5px] bg-stone-900 transition-all duration-700 ease-in-out ${isPending ? 'w-full opacity-100' : 'w-0 opacity-0'
                }`} />
        </div>
    );
}
