'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Truck, CheckCircle2, Clock, ChevronDown, User, MapPin, ExternalLink } from 'lucide-react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        todayRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/admin/orders');
            setOrders(response.data.orders);
            setStats(response.data.stats);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            setUpdatingId(orderId);
            await axios.patch('/api/admin/orders', { orderId, status: newStatus });
            // Local update
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={14} className="text-stone-400" />;
            case 'processing': return <Package size={14} className="text-amber-500" />;
            case 'shipped': return <Truck size={14} className="text-blue-500" />;
            case 'delivered': return <CheckCircle2 size={14} className="text-green-500" />;
            default: return <Clock size={14} />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Analytics Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 border border-stone-100 hover:border-stone-200 transition-colors">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-3 font-semibold">Lifetime Revenue</p>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-serif text-stone-900 italic">${stats.totalRevenue.toFixed(2)}</span>
                    </div>
                </div>

                <div className="bg-white p-8 border border-stone-100 hover:border-stone-200 transition-colors">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-3 font-semibold">Total Orders</p>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-serif text-stone-900 italic">{stats.totalOrders}</span>
                        <span className="text-[10px] text-stone-300 uppercase tracking-widest">Processed</span>
                    </div>
                </div>

                <div className="bg-white p-8 border border-stone-100 hover:border-stone-200 transition-colors">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-3 font-semibold">Today's Sales</p>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-serif text-stone-900 italic">${stats.todayRevenue.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-[11px] font-semibold tracking-[0.4em] uppercase text-stone-900">
                        Recent Orders
                    </h2>
                </div>
                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-stone-100 italic text-stone-400 text-sm font-light">
                        No orders found.
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white border border-stone-100 overflow-hidden group hover:border-stone-200 transition-colors">
                                {/* Header Info */}
                                <div className="p-6 border-b border-stone-50 flex flex-wrap items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-900">
                                                Order #{order._id.slice(-8)}
                                            </span>
                                            <div className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest flex items-center space-x-1.5 ${order.status === 'pending' ? 'bg-stone-50 text-stone-400' :
                                                order.status === 'processing' ? 'bg-amber-50 text-amber-600' :
                                                    order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                                                        'bg-green-50 text-green-600'
                                                }`}>
                                                {getStatusIcon(order.status)}
                                                <span>{order.status}</span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-stone-400 tracking-widest uppercase font-light">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-stone-900 tracking-tight">${order.totalAmount.toFixed(2)}</p>
                                            <p className="text-[9px] text-stone-400 uppercase tracking-widest">{order.items.length} Items</p>
                                        </div>
                                        <div className="h-8 w-[1px] bg-stone-100"></div>

                                        {/* Action Select */}
                                        <div className="relative group/select">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                                disabled={updatingId === order._id}
                                                className="appearance-none bg-stone-50 border border-stone-100 text-[10px] uppercase tracking-[0.2em] px-4 py-2 pr-10 focus:outline-none focus:border-stone-900 transition-colors cursor-pointer disabled:opacity-50 font-medium"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-stone-50/30">
                                    {/* Customer */}
                                    <div className="space-y-3">
                                        <h3 className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-semibold border-b border-stone-100 pb-2">Customer</h3>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-white border border-stone-100 flex items-center justify-center text-stone-400 shrink-0">
                                                <User size={14} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-medium text-stone-900 truncate">{order.userId?.name || 'Guest'}</p>
                                                <p className="text-[10px] text-stone-400 truncate font-light tracking-wide">{order.userId?.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping */}
                                    <div className="space-y-3">
                                        <h3 className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-semibold border-b border-stone-100 pb-2">Shipping Information</h3>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-white border border-stone-100 flex items-center justify-center text-stone-400 shrink-0">
                                                <MapPin size={14} />
                                            </div>
                                            <div className="text-[10px] text-stone-500 font-light leading-relaxed tracking-wide">
                                                <p className="text-stone-800 font-medium truncate mb-0.5">{order.shippingAddress.street}</p>
                                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                                <p>{order.shippingAddress.country}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items Preview */}
                                    <div className="space-y-3">
                                        <h3 className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-semibold border-b border-stone-100 pb-2">Order Summary</h3>
                                        <div className="flex -space-x-3 overflow-hidden h-10 items-center">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-stone-100 z-[10]">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="relative w-10 h-10 rounded-full border-2 border-white bg-stone-900 flex items-center justify-center z-[11]">
                                                    <span className="text-[8px] text-white font-medium">+{order.items.length - 3}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
