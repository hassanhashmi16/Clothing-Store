'use client';


import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const CartContext = createContext();

export function CartProvider({ children }) {
    const { data: session, status } = useSession();
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);

    // Fetch cart when session is available
    useEffect(() => {
        if (status === 'authenticated') {
            fetchCart();
        } else if (status === 'unauthenticated') {
            setCart({ items: [] });
            setLoading(false);
        }
    }, [status]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/cart');
            setCart(response.data);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity, size, color) => {
        try {
            if (status !== 'authenticated') {
                alert('Please sign in to add items to cart');
                return;
            }

            const response = await axios.post('/api/cart', {
                productId,
                quantity,
                size,
                color,
            });

            // Update local state with the returned cart
            setCart(response.data);
            return true;
        } catch (error) {
            console.error('Failed to add to cart:', error);
            return false;
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const response = await axios.delete(`/api/cart?itemId=${itemId}`);
            // For delete, we might need a fresh populate from server or handle it locally
            await fetchCart();
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            const response = await axios.patch('/api/cart', {
                itemId,
                quantity,
            });
            setCart(response.data);
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    const clearCart = async () => {
        try {
            await axios.put('/api/cart');
            setCart({ items: [] });
        } catch (error) {
            console.error('Failed to clear cart:', error);
        }
    };

    const getCartCount = () => {
        return cart.items.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartTotal = () => {
        return cart.items.reduce((total, item) => {
            // Assuming productId is populated and has a price field
            const price = item.productId?.price || 0;
            return total + price * item.quantity;
        }, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                addToCart,
                removeFromCart,
                updateQuantity,
                getCartCount,
                getCartTotal,
                fetchCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
