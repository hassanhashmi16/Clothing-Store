'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: 'Men', href: '/men' },
        { name: 'Women', href: '/women' },
        { name: 'Collections', href: '/collections' },
        { name: 'Sale', href: '/sale' },
    ]

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-foreground hover:text-accent-brown transition-colors"
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
                                className="nav-link text-sm font-medium tracking-wide text-foreground/80 hover:text-foreground"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Center Section: Logo */}
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <Link href="/" className="group">
                            <span className="text-2xl font-serif tracking-tighter text-foreground group-hover:text-accent-brown transition-colors">
                                ELEGANCE
                            </span>
                        </Link>
                    </div>

                    {/* Right Section: Icons */}
                    <div className="flex items-center space-x-5">
                        <button className="text-foreground/80 hover:text-foreground transition-colors hidden sm:block">
                            <Search size={20} strokeWidth={1.5} />
                        </button>
                        <button className="text-foreground/80 hover:text-foreground transition-colors">
                            <User size={20} strokeWidth={1.5} />
                        </button>
                        <button className="text-foreground/80 hover:text-foreground transition-colors relative">
                            <ShoppingBag size={20} strokeWidth={1.5} />
                            <span className="absolute -top-1 -right-1 bg-accent-brown text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                0
                            </span>
                        </button>
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
                    <div className="pt-2">
                        <button className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors">
                            <Search size={20} strokeWidth={1.5} />
                            <span className="text-sm">Search</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
