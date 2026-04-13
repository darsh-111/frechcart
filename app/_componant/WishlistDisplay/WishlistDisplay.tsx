"use client"
import React, { useTransition, useState, useEffect } from 'react'
import { Trash2, ShoppingCart, Heart, ArrowRight, Loader2 } from "lucide-react";
import { RemoveFromWishlist } from "@/actions/wishlist.actions";
import { Addtocard } from "@/actions/card.actions";
import Link from 'next/link';
import { toast } from 'sonner';
import { useWishlist } from '@/Context/wishlistContext';
import { useCart } from '@/Context/CartContext';
import { useRouter } from 'next/navigation';
import WishlistRow from '../WishlistRow/WishlistRow';

export default function WishlistDisplay({ initialData }: { initialData: any }) {
    const { refreshWishlistCount } = useWishlist();
    const { refreshCartCount } = useCart();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // نستخدم الـ state عشان لما نحذف حاجة تختفي فوراً
    const [wishlistItems, setWishlistItems] = useState(initialData?.data || []);

    useEffect(() => {
        setWishlistItems(initialData?.data || []);
    }, [initialData]);

    // فانكشن الحذف
    const handleRemove = (id: string) => {
        startTransition(async () => {
            const res = await RemoveFromWishlist(id);
            if (res.status === "success") {
                toast.success("Removed from wishlist");
                // بنشيل المنتج من الـ UI فوراً
                setWishlistItems((prev: any) => prev.filter((item: any) => item._id !== id));
                await refreshWishlistCount();
            }
        });
    };

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
                <Heart className="w-16 h-16 text-gray-200 mb-4" />
                <h2 className="text-xl font-bold text-gray-900">Your wishlist is empty</h2>
                <Link href="/" className="mt-4 text-green-600 font-bold flex items-center gap-2">
                    Explore Products <ArrowRight size={18} />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-red-50 p-4 rounded-2xl shadow-sm">
                    <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-gray-900">My Wishlist</h1>
                    <p className="text-gray-500 font-medium">{wishlistItems.length} items saved</p>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                {/* Desktop Header */}
                <div className="hidden md:grid grid-cols-12 p-6 bg-gray-50/50 border-b text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Wishlist Items List */}
                <div className="divide-y divide-gray-50">
                    {wishlistItems.map((item: any) => (
                        <WishlistRow
                            key={item._id}
                            product={item}
                            removeItem={handleRemove} // بعتنا فانكشن الحذف
                        />
                    ))}
                </div>
            </div>

            {/* Back to Shopping */}
            <Link href="/" className="inline-flex items-center gap-2 mt-8 text-gray-400 font-bold hover:text-gray-900 transition-colors text-sm group">
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Continue Shopping
            </Link>

            {/* Global Loader */}
            {isPending && (
                <div className="fixed inset-0 bg-white/40 backdrop-blur-[2px] z-50 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
                </div>
            )}
        </div>
    )
}