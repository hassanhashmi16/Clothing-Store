'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, User, Search, Menu, X, LogOut } from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Navbar() {
    const { data: session, status } = useSession()
    const pathname = usePathname()
    const isHome = pathname === '/'
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const shouldShowGlass = !isHome || isScrolled

    const navLinks = [
        { name: 'Men', href: '/men' },
        { name: 'Women', href: '/women' },
        { name: 'Collections', href: '/collections' },
        { name: 'Sale', href: '/sale' },
    ]

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
                        <button className={`${shouldShowGlass ? 'text-foreground/80 hover:text-foreground' : 'text-white/80 hover:text-white'} transition-colors hidden sm:block`}>
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

                        <button className={`${shouldShowGlass ? 'text-foreground/80 hover:text-foreground' : 'text-white/80 hover:text-white'} transition-colors relative`}>
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
                    <div className="pt-4 border-t border-foreground/5 space-y-4">
                        <button className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors w-full">
                            <Search size={20} strokeWidth={1.5} />
                            <span className="text-sm">Search</span>
                        </button>

                        {status === 'authenticated' ? (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    {session.user.image ? (
                                        <img src={session.user.image} alt={session.user.name} className="w-8 h-8 rounded-full" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-accent-brown/10 flex items-center justify-center text-accent-brown">
                                            <User size={16} strokeWidth={1.5} />
                                        </div>
                                    )}
                                    <span className="text-sm font-medium">{session.user.name}</span>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="flex items-center space-x-2 text-foreground/80 hover:text-accent-brown transition-colors w-full"
                                >
                                    <LogOut size={ 20} strokeWidth={1.5} />
                                    <span className="text-sm">Sign Out</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => signIn('google')}
                                className="flex items-center space-x-2 text-foreground/80 hover:text-accent-brown transition-colors w-full"
                            >
                                <User size={20} strokeWidth={1.5} />
                                <span className="text-sm">Login with Google</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
