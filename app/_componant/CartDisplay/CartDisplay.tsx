"use client"
import React, { useTransition } from 'react'
import { Trash2, Plus, Minus, Loader2, ShoppingBag, ShieldCheck, Truck, Tag, Lock, ArrowLeft, ArrowRight } from "lucide-react";
import { ClearCart, RemoveCartItem, UpdateProductQuantity } from "@/actions/card.actions";
import Link from 'next/link';
import { toast } from 'sonner';
import { ICartData } from '@/api/routemisr.type/cart.type';
import { useCart } from '@/Context/CartContext';

export default function CartDisplay({ initialData }: { initialData: ICartData }) {
    // استدعاء refreshCartCount و setCartCount من الـ Context
    const { refreshCartCount, setCartCount } = useCart();
    const [isPending, startTransition] = useTransition();

    const cartItems = initialData?.data?.products || [];
    const totalPrice = initialData?.data?.totalCartPrice || 0;
    const itemsCount = initialData?.numOfCartItems || 0;

    // تحديث الكمية (زائد وناقص) مع تحديث الـ Navbar
    const handleUpdate = (id: string, count: number) => {
        startTransition(async () => {
            try {
                await UpdateProductQuantity(id, count);
                await refreshCartCount(); // تحديث رقم السلة في الـ Navbar فوراً
            } catch (error) {
                toast.error("Error updating quantity");
            }
        });
    };

    // حذف منتج واحد مع تحديث الـ Navbar
    const handleRemove = (id: string) => {
        startTransition(async () => {
            try {
                await RemoveCartItem(id);
                await refreshCartCount(); // تحديث رقم السلة في الـ Navbar فوراً
            } catch (error) {
                toast.error("Error removing item");
            }
        });
    };

    // مسح العربة بالكامل
    const handleClearCart = () => {
        startTransition(async () => {
            try {
                const res = await ClearCart();
                if (res.success) {
                    toast.success("Cart cleared successfully");
                    setCartCount(0); // تصفير الـ Navbar فوراً
                } else {
                    toast.error("Could not clear cart");
                }
            } catch (error) {
                toast.error("An error occurred");
            }
        });
    };

    // حالة العربة فارغة
    if (!initialData || cartItems.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-4">
                <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
                    <ShoppingBag className="w-16 h-16 text-gray-200" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 text-center max-w-sm mb-8 leading-relaxed">
                    Looks like you haven't added anything to your cart yet.
                    Start exploring our products!
                </p>
                <Link href="/" className="flex items-center gap-2 bg-[#198754] text-white px-10 py-3 rounded-xl font-bold hover:bg-[#157347] transition-all shadow-lg active:scale-95">
                    Start Shopping <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#f9fafb] min-h-screen pb-10">
            <div className="container mx-auto px-4 py-8">

                {/* العنوان العلوي */}
                <div className="flex items-center gap-4 mb-2">
                    <div className="bg-green-600 p-3 rounded-2xl shadow-lg text-white">
                        <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
                    </div>
                </div>
                <p className="font-bold text-xl mb-10 text-gray-600">You have <span className="text-green-600">{itemsCount} items</span> in your cart</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* عمود المنتجات */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item: any) => (
                            <div key={item._id} className={`relative flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-all ${isPending ? "opacity-50 grayscale-[0.5]" : ""}`}>
                                <Link href={`/productdetails/${item.product.id}`}>
                                    <div className="w-24 h-32 flex-shrink-0 bg-gray-50 rounded-xl p-2 cursor-pointer">
                                        <img src={item.product.imageCover} className="w-full h-full object-contain" alt={item.product.title} />
                                    </div>
                                </Link>
                                <div className="flex-1 space-y-1">
                                    <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{item.product.title}</h3>
                                    <span className="text-[10px] uppercase font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                        {item.product.category?.name || "Fashion"}
                                    </span>
                                    <div className="flex items-center gap-3 mt-4 bg-gray-50 w-fit rounded-lg p-1 border">
                                        <button onClick={() => handleUpdate(item.product._id, item.count - 1)} disabled={item.count <= 1 || isPending} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30"><Minus className="w-4 h-4" /></button>
                                        <span className="font-black w-8 text-center text-lg">{item.count}</span>
                                        <button onClick={() => handleUpdate(item.product._id, item.count + 1)} disabled={isPending} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm"><Plus className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col justify-between h-32">
                                    <button onClick={() => handleRemove(item.product._id)} disabled={isPending} className="text-red-300 hover:text-red-500 p-2 self-end"><Trash2 className="w-5 h-5" /></button>
                                    <div>
                                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Total</p>
                                        <p className="font-black text-xl text-gray-900">{item.price * item.count} <span className="text-[10px]">EGP</span></p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* أزرار أسفل القائمة */}
                        <div className="flex justify-between items-center pt-4 border-t border-dashed">
                            <Link href="/" className="flex items-center gap-2 text-[#198754] font-bold hover:underline transition-all">
                                <ArrowLeft className="w-5 h-5" /> Continue Shopping
                            </Link>

                            <button
                                onClick={handleClearCart}
                                disabled={isPending}
                                className="flex items-center gap-2 text-gray-400 font-bold hover:text-red-500 transition-all text-sm"
                            >
                                <Trash2 className="w-4 h-4" /> Clear all items
                            </button>
                        </div>
                    </div>

                    {/* ملخص الطلب */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-10">
                            <div className="bg-green-600 p-5 rounded-2xl text-white mb-6 shadow-lg shadow-green-100">
                                <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                                    <Tag className="w-5 h-5" /> Order Summary
                                </h2>
                                <p className="text-sm opacity-80 font-medium">{itemsCount} items in your cart</p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-xl flex items-center gap-3 mb-6 border border-green-100">
                                <Truck className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-green-800 font-bold text-sm">Free Shipping!</p>
                                    <p className="text-green-700 text-[10px] font-bold">You qualify for free delivery</p>
                                </div>
                            </div>

                            <div className="space-y-4 text-gray-600 mb-6 pb-6 border-b border-dashed">
                                <div className="flex justify-between font-medium"><span>Subtotal</span><span className="font-black text-gray-900">{totalPrice} EGP</span></div>
                                <div className="flex justify-between font-bold"><span>Shipping</span><span className="text-green-600 uppercase italic text-sm tracking-tighter">Free</span></div>
                            </div>

                            <div className="flex justify-between items-center mb-8">
                                <span className="text-lg font-bold text-gray-400 uppercase italic">Total</span>
                                <span className="text-3xl font-black text-green-600 tracking-tighter">{totalPrice} EGP</span>
                            </div>

                            <Link href={"checkout"}><button className="w-full bg-[#198754] text-white py-5 rounded-2xl font-black text-xl hover:bg-[#157347] shadow-xl shadow-green-50 transition-all flex items-center justify-center gap-3 active:scale-95">
                                <Lock className="w-6 h-6" /> SECURE CHECKOUT
                            </button></Link>

                            <Link href="/" className="w-full mt-4 flex items-center justify-center gap-2 text-gray-400 font-bold hover:text-green-600 transition-all py-2 text-sm group">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* لودر التحديث العائم */}
            {isPending && (
                <div className="fixed bottom-10 right-10 bg-white p-4 rounded-full shadow-2xl border border-green-50 flex items-center justify-center z-50">
                    <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
                </div>
            )}
        </div>
    )
}