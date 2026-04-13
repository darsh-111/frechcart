"use client"
import React from 'react'
import { ShoppingCart, Check, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/Context/CartContext'
import { Addtocard } from "@/actions/card.actions"
import { toast } from 'sonner'

export default function WishlistRow({ product, removeItem }: { product: any, removeItem: (id: string) => void }) {
    const { cartItems, refreshCartCount } = useCart();

    // بنشيك: هل المنتج ده موجود في الكارت؟
    const isInCart = cartItems?.some((item: any) =>
        item.product._id === product._id || item.product.id === product._id
    );

    const handleAddToCart = async () => {
        const res = await Addtocard(product._id);
        if (res.status === "success") {
            toast.success("Added to cart successfully");
            await refreshCartCount(); // دي اللي بتحدث الزرار فوراً
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 p-6 items-center gap-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
            {/* منتج */}
            <div className="md:col-span-6 flex items-center gap-4">
            <Link href={`/productdetails/${product.id}` }>
                <img src={product.imageCover} alt="" className="w-16 h-16 object-contain rounded-xl border p-1 bg-white" />
        </Link>
                <div>
                    <span className="text-[10px] text-green-600 font-bold uppercase">{product.category?.name}</span>
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{product.title}</h3>
                </div>
            </div>
            {/* سعر */}
            <div className="md:col-span-2 text-center font-black text-gray-900">{product.price} EGP</div>

            {/* حالة Status */}
            <div className="md:col-span-2 flex justify-center">
                {isInCart ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] bg-[#E8F5E9] text-[#198754] px-3 py-1.5 rounded-full font-black">
                        <ShoppingCart size={10} /> In Cart
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full font-black">
                        In Stock
                    </span>
                )}
            </div>

            {/* أزرار Actions */}
            <div className="md:col-span-2 flex items-center justify-end gap-2">
                {isInCart ? (
                    <Link href="/cart" className="flex items-center gap-2 bg-white border border-gray-200 text-gray-950 px-4 py-2 rounded-xl text-[11px] font-black hover:bg-gray-50 shadow-sm">
                        <Check size={14} className="text-[#198754]" /> View Cart
                    </Link>
                ) : (
                    <button onClick={handleAddToCart} className="flex items-center gap-2 bg-[#198754] text-white px-4 py-2 rounded-xl text-[11px] font-black hover:bg-[#157347] shadow-md">
                        <ShoppingCart size={14} /> Add to Cart
                    </button>
                )}

                <button onClick={() => removeItem(product._id)} className="p-2 text-gray-400 hover:text-red-600 border rounded-lg">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    )
}