'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Hero() {
    const [products, setProducts] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products')
                // The user updated the API to return { success: true, data: products }
                if (response.data.success) {
                    setProducts(response.data.data)
                } else if (Array.isArray(response.data)) {
                    // Fallback in case the user's change didn't stick or for older versions
                    setProducts(response.data )
                }
            } catch (error) {
                console.error('Error fetching products for carousel:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const nextSlide = useCallback(() => {
        if (products.length === 0) return
        setCurrentIndex((prevIndex) => (prevIndex === products.length - 1 ? 0 : prevIndex + 1))
    }, [products.length])

    const prevSlide = () => {
        if (products.length === 0) return
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - 1 : prevIndex - 1))
    }

    // Auto-play
    useEffect(() => {
        if (products.length > 0) {
            const interval = setInterval(nextSlide, 6000)
            return () => clearInterval(interval)
        }
    }, [products.length, nextSlide])

    const scrollToProducts = () => {
        const element = document.getElementById('featured-products')
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    if (loading) {
        return <div className="h-screen w-full bg-[#f9f7f2] animate-pulse flex items-center justify-center">
            <span className="text-accent-brown font-serif italic text-2xl uppercase tracking-widest animate-pulse">Loading Collection...</span>
        </div>
    }

    if (products.length === 0) {
        return (
            <div className="h-screen w-full bg-[#f9f7f2] flex items-center justify-center">
                <p className="text-accent-brown font-serif italic">No featured products found.</p>
            </div>
        )
    }

    return (
        <section className="relative h-[85vh] md:h-[90vh] min-h-[600px] w-full overflow-hidden bg-black">
            {/* Carousel Slides */}
            {products.map((product, index) => (
                <div
                    key={product._id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <Image
                        src={product.images?.[0] || '/images/hero.png'}
                        alt={product.name}
                        fill
                        priority={index === 0}
                        className={`object-cover object-center transition-transform duration-[10000ms] ${index === currentIndex ? 'scale-110' : 'scale-100'}`}
                    />
                    {/* Darker overlay for content readability */}
                    <div className="absolute inset-0 bg-black/30" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center text-center px-4 pt-20">
                        <div className={`max-w-4xl transition-all duration-1000 delay-300 transform ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                            <p className="text-white/80 text-[10px] md:text-xs font-medium tracking-[0.4em] uppercase mb-4 md:mb-6">
                                Featured Collection
                            </p>
                            <h1 className="text-white text-3xl md:text-7xl lg:text-8xl font-serif tracking-tighter mb-8 md:mb-10 leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                                <button
                                    onClick={scrollToProducts}
                                    className="px-8 md:px-12 py-4 md:py-5 bg-white text-foreground hover:bg-[#f9f7f2] hover:-translate-y-1 transition-all duration-300 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase rounded-none shadow-xl"
                                >
                                    Shop Now
                                </button>
                                <button className="px-8 md:px-12 py-4 md:py-5 bg-transparent text-white border border-white/40 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase rounded-none backdrop-blur-md">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Controls */}
            {products.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 p-2 text-white/50 hover:text-white transition-colors"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={48} strokeWidth={1} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-30 p-2 text-white/50 hover:text-white transition-colors"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={48} strokeWidth={1} />
                    </button>

                    {/* Progress Bar Indicators */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-4">
                        {products.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className="group py-4 px-1"
                            >
                                <div className={`h-[2px] w-8 md:w-16 transition-all duration-500 ${index === currentIndex ? 'bg-white w-12 md:w-24' : 'bg-white/20 group-hover:bg-white/40'}`} />
                            </button>
                        ))}
                    </div>
                </>
            )}

            {/* Bottom Scroll Tip */}
            <div
                onClick={scrollToProducts}
                className="absolute bottom-10 left-10 z-30 flex items-center gap-4 cursor-pointer group"
            >
                <div className="w-px h-12 bg-white/20 relative overflow-hidden hidden md:block">
                    <div className="absolute top-0 left-0 w-full h-full bg-white -translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </div>
                <div className="flex flex-col items-start gap-1">
                    <span className="text-white/60 text-[10px] uppercase tracking-[0.3em] font-bold">Scroll</span>
                    <ChevronDown className="text-white/60 group-hover:translate-y-1 transition-transform" size={16} />
                </div>
            </div>
        </section>
    )
}

