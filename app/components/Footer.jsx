import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        shop: [
            { name: 'New Arrivals', href: '/new-arrivals' },
            { name: 'Men', href: '/men' },
            { name: 'Women', href: '/women' },
            { name: 'Accessories', href: '/accessories' },
            { name: 'Sale', href: '/sale' },
        ],
        help: [
            { name: 'Customer Service', href: '/customer-service' },
            { name: 'Shipping & Returns', href: '/shipping-returns' },
            { name: 'Size Guide', href: '/size-guide' },
            { name: 'Track Order', href: '/track-order' },
            { name: 'FAQ', href: '/faq' },
        ],
        company: [
            { name: 'About Us', href: '/about' },
            { name: 'Sustainability', href: '/sustainability' },
            { name: 'Careers', href: '/careers' },
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Service', href: '/terms' },
        ],
    };

    const socialLinks = [
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Youtube, href: '#', label: 'Youtube' },
    ];

    return (
        <footer className="bg-[#FAF9F6] border-t border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="text-2xl font-serif tracking-tight text-stone-900">
                            ESSENTIEL
                        </Link>
                        <p className="text-stone-600 leading-relaxed max-w-xs">
                            Curated essentials for the modern wardrobe. Experience the perfect blend of timeless elegance and contemporary design.
                        </p>
                        <div className="flex space-x-5">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    className="text-stone-400 hover:text-stone-900 transition-colors duration-300"
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-widest mb-6">Shop</h3>
                        <ul className="space-y-4">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-stone-600 hover:text-stone-900 transition-colors duration-200 text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-widest mb-6">Support</h3>
                        <ul className="space-y-4">
                            {footerLinks.help.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-stone-600 hover:text-stone-900 transition-colors duration-200 text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-widest mb-6">Contact</h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3 text-stone-600">
                                <MapPin size={18} className="text-stone-400 mt-1 shrink-0" />
                                <span className="text-sm leading-relaxed">
                                    123 Fashion Ave, Suite 456<br />New York, NY 10001
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 text-stone-600">
                                <Phone size={18} className="text-stone-400 shrink-0" />
                                <span className="text-sm">+1 (555) 012-3456</span>
                            </div>
                            <div className="flex items-center space-x-3 text-stone-600">
                                <Mail size={18} className="text-stone-400 shrink-0" />
                                <span className="text-sm">support@essentiel.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-stone-500 text-xs tracking-wide">
                    <p>© {currentYear} ESSENTIEL. All rights reserved.</p>
                    <div className="flex space-x-8">
                        <Link href="/privacy" className="hover:text-stone-900 transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-stone-900 transition-colors">Terms</Link>
                        <Link href="/cookies" className="hover:text-stone-900 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
