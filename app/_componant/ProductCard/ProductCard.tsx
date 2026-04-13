"use client"
import { Product } from "@/api/routemisr.type/routemisr.type";
import { Heart, Eye, RefreshCw, Star } from "lucide-react";
import Addbtn from './../Addbtn/Addbtn';
import { useWishlist } from "@/Context/wishlistContext";
import { AddToWishlist, RemoveFromWishlist } from "@/actions/wishlist.actions"; 
import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import WishlistBtn from '../Addbtn/WishlistBtn';
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
    const { refreshWishlistCount } = useWishlist();
    const [isPending, startTransition] = useTransition();

    // حالة محلية عشان القلب يتغير فوراً أمام اليوزر (Optimistic UI)
    const [isFav, setIsFav] = useState(false);

  
    async function toggleWishlist() {
        startTransition(async () => {
            if (isFav) {
                // حذف
                const res = await RemoveFromWishlist(product._id);
                if (res.status === "success") {
                    setIsFav(false);
                    toast.error("Removed from wishlist");
                }
            } else {
                // إضافة
                const res = await AddToWishlist(product._id);
                if (res.status === "success") {
                    setIsFav(true);
                    toast.success("Added to wishlist ❤️");
                }
            }
            // تحديث الرقم في الـ Navbar
            await refreshWishlistCount();
        });
    }

    if (!product) return null;

    const hasDiscount = !!(product.priceAfterDiscount && product.priceAfterDiscount < product.price);
    const discountPercentage = hasDiscount
        ? Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100)
        : 0;

    return (
        <div className="group relative bg-white rounded-xl border border-gray-100 p-4 pt-10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col">

            {/* شارة الخصم */}
            {hasDiscount && (
                <div className="absolute top-[50px] left-0 z-20 bg-[#f03a3a] text-white text-[11px] font-bold px-2 rounded-br-lg rounded-tl-xl shadow-sm">
                    -{discountPercentage}%
                </div>
            )}

            {/* الأزرار الجانبية */}
            <div className="absolute top-4 right-4 flex flex-col gap-2.5 z-20 transition-all transform duration-300">
                {/* زر القلب المعدل */}
              
                <WishlistBtn
                    productId={product._id}
                    onlyIcon={true}
                    classs="w-9 h-9 rounded-full border shadow-sm"
                />

                <button className="p-2.5 bg-white rounded-full shadow-md hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors">
                    <RefreshCw size={15} />
                </button>
                <Link href={`/productdetails/${product._id}`} >
                    <button className="p-2.5 bg-white rounded-full shadow-md hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors">
                        <Eye size={15} />
                    </button></Link>
            </div>

            {/* صورة المنتج */}
            <div className="relative overflow-hidden rounded-lg flex items-center justify-center h-48">
                <img
                    src={product.imageCover}
                    alt={product.title}
                    className="object-contain w-full h-full transition-transform duration-500 "
                />
            </div>

            {/* بيانات المنتج */}
            <div className="flex-1 flex flex-col px-1 mt-4">
                <p className="text-[10px] text-[#198754] font-semibold uppercase tracking-wider">
                    {product.category?.name || "Category"}
                </p>
                <h3 className="font-medium text-gray-800 text-sm line-clamp-2 leading-tight min-h-[40px]">
                    {product.title}
                </h3>

                {/* التقييم */}
                <div className="flex items-center gap-1.5 my-2">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={11}
                                fill={i < Math.floor(product.ratingsAverage) ? "currentColor" : "none"}
                                className={i < Math.floor(product.ratingsAverage) ? "" : "text-gray-300"}
                            />
                        ))}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">
                        {product.ratingsAverage}
                    </span>
                </div>

                {/* السعر وزر الإضافة */}
                <div className="mt-auto flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-gray-900">
                            {hasDiscount ? product.priceAfterDiscount : product.price} <span className="text-[10px]">EGP</span>
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">
                                {product.price} EGP
                            </span>
                        )}
                    </div>
                    <Addbtn id={product._id} classs={"bg-[#198754] hover:bg-[#157347] text-white w-9 h-9 flex items-center justify-center rounded-full transition-all cursor-pointer active:scale-90 shadow-lg shadow-green-100"} word="+" />
                </div>
            </div>
        </div>
    );
}