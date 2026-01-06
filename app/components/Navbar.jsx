'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, User, Search, Menu, X, LogOut } from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useCart } from '@/app/context/CartContext'
import axios from 'axios'

export default function Navbar() {
    const { data: session, status } = useSession()
    const { getCartCount } = useCart()
    const pathname = usePathname()
    const isHome = pathname === '/'
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const shouldShowGlass = !isHome || isScrolled

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (isSearchOpen && allProducts.length === 0) {
            axios.get('/api/products')
                .then(res => setAllProducts(res.data))
                .catch(err => console.error("Search fetch error:", err))
        }
    }, [isSearchOpen])

    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = allProducts.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setSearchResults(filtered.slice(0, 4))
        } else {
            setSearchResults([])
        }
    }, [searchQuery, allProducts])

    const navLinks = [
        { name: 'Men', href: '/men' },
        { name: 'Women', href: '/women' },
        { name: 'Collections', href: '/collections' },
        { name: 'Sale', href: '/sale' },
    ]

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            // In a real app, redirect to search page
            // router.push(`/search?q=${searchQuery}`)
            console.log("Searching for:", searchQuery)
            setIsSearchOpen(false)
            setSearchQuery('')
        }
    }

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${shouldShowGlass ? 'glass-nav py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`${shouldShowGlass ? 'text-foreground' : 'text-white'} hover:text-accent-brown transition-colors`}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Left Section: Nav Links (Desktop) */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`nav-link text-sm font-medium tracking-wide ${shouldShowGlass ? 'text-foreground/80 hover:text-foreground' : 'text-white/80 hover:text-white'} transition-colors`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Center Section: Logo */}
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <Link href="/" className="group">
                            <span className={`text-2xl font-serif tracking-tighter ${shouldShowGlass ? 'text-foreground' : 'text-white'} group-hover:text-accent-brown transition-colors`}>
                                ELEGANCE
                            </span>
                        </Link>
                    </div>

                    {/* Right Section: Icons */}
                    <div className="flex items-center space-x-5">
                        {session?.user?.role === 'admin' && (
                            <Link
                                href="/admin/orders"
                                className={`hidden sm:flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${shouldShowGlass ? 'border-accent-brown/20 text-accent-brown hover:bg-accent-brown/5' : 'border-white/20 text-white hover:bg-white/10'} transition-all`}
                            >
                                <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                                <span>Dashboard</span>
                            </Link>
                        )}

                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={`${shouldShowGlass ? 'text-foreground/80 hover:text-foreground' : 'text-white/80 hover:text-white'} transition-colors hidden sm:block`}
                        >
                            <Search size={20} strokeWidth={1.5} />
                        </button>

                        <div className="relative">
                            {status === 'authenticated' ? (
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center space-x-2 group"
                                    >
                                        {session.user.image ? (
                                            <img src={session.user.image} alt={session.user.name} className="w-8 h-8 rounded-full border border-accent-brown/20 group-hover:border-accent-brown transition-all" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-accent-brown/10 flex items-center justify-center text-accent-brown border border-accent-brown/20 group-hover:border-accent-brown transition-all">
                                                <User size={16} strokeWidth={1.5} />
                                            </div>
                                        )}
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-foreground/5 shadow-xl py-2 z-50 rounded-sm">
                                            <div className="px-4 py-2 border-b border-foreground/5 mb-2">
                                                <p className="text-xs text-foreground/50 uppercase tracking-widest font-semibold">User</p>
                                                <p className="text-sm font-medium truncate">{session.user.name}</p>
                                            </div>
                                            <button
                                                onClick={() => signOut()}
                                                className="w-full text-left px-4 py-2 text-sm text-foreground/70 hover:text-accent-brown hover:bg-accent-brown/5 flex items-center space-x-2 transition-colors"
                                            >
                                                <LogOut size={16} strokeWidth={1.5} />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => signIn('google')}
                                    className={`${shouldShowGlass ? 'text-foreground/80 hover:text-foreground' : 'text-white/80 hover:text-white'} transition-colors flex items-center space-x-1`}
                                >
                                    <User size={20} strokeWidth={1.5} />
                                    <span className="text-sm font-medium hidden sm:block">Login</span>
                                </button>
                            )}
                        </div>

                        {session?.user?.role !== 'admin' && (
                            <Link
                                href="/cart"
                                className={`${shouldShowGlass ? 'text-foreground/80 hover:text-foreground' : 'text-white/80 hover:text-white'} transition-colors relative`}
                            >
                                <ShoppingBag size={20} strokeWidth={1.5} />
                                <span className="absolute -top-1 -right-1 bg-accent-brown text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                    {getCartCount()}
                                </span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Overlay) */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-background border-t border-foreground/5 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 py-4 space-y-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="block text-base font-medium text-foreground/80 hover:text-foreground transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {session?.user?.role === 'admin' && (
                        <Link
                            href="/admin/orders"
                            className="flex items-center space-x-2 text-sm font-bold text-accent-brown transition-colors uppercase tracking-widest pt-4 border-t border-foreground/5"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <div className="w-1.5 h-1.5 bg-accent-brown rounded-full animate-pulse"></div>
                            <span>Dashboard</span>
                        </Link>
                    )}
                    <div className="pt-4 border-t border-foreground/5 space-y-4">
                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false)
                                setIsSearchOpen(true)
                            }}
                            className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors w-full"
                        >
                            <Search size={20} strokeWidth={1.5} />
                            <span className="text-sm">Search</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Overlay */}
            <div className={`fixed inset-0 z-[60] bg-white transition-all duration-500 overflow-hidden ${isSearchOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
                    <div className="flex justify-end py-8">
                        <button
                            onClick={() => setIsSearchOpen(false)}
                            className="text-stone-400 hover:text-stone-900 transition-colors flex items-center space-x-2 uppercase text-[10px] tracking-[0.2em] font-semibold"
                        >
                            <span>Close</span>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-grow flex items-center justify-center">
                        <form onSubmit={handleSearch} className="w-full max-w-4xl space-y-8">
                            <div className="relative group">
                                <input
                                    autoFocus={isSearchOpen}
                                    type="text"
                                    placeholder="Search our collection..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent border-b border-stone-100 py-6 text-4xl sm:text-6xl font-serif italic text-stone-900 placeholder:text-stone-100 focus:outline-none focus:border-stone-900 transition-all duration-500"
                                />
                                <button type="submit" className="absolute right-0 bottom-8 text-stone-300 group-focus-within:text-stone-900 transition-colors">
                                    <Search size={32} strokeWidth={1} />
                                </button>
                            </div>

                            {searchResults.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pt-12 animate-in fade-in duration-500">
                                    {searchResults.map((product) => (
                                        <Link
                                            key={product._id}
                                            href={`/${product.category}/${product._id}`}
                                            onClick={() => setIsSearchOpen(false)}
                                            className="group space-y-4"
                                        >
                                            <div className="aspect-[3/4] overflow-hidden bg-stone-50 border border-stone-100">
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-[10px] uppercase tracking-[0.2em] text-stone-900 font-medium">{product.name}</h4>
                                                <p className="text-[10px] text-stone-400 font-serif italic">${product.price.toFixed(2)}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-wrap gap-4 pt-12 border-t border-stone-50">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold">Quick Search:</span>
                                {['New Arrivals', 'Silk Blends', 'Minimalist Coats', 'Archives'].map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => setSearchQuery(tag)}
                                        className="text-[10px] uppercase tracking-[0.2em] text-stone-900 hover:text-stone-400 transition-colors font-medium underline underline-offset-4 decoration-stone-200"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </nav>
    )
}
