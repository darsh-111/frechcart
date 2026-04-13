'use client';
import React, { useTransition } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { AddToWishlist, RemoveFromWishlist } from '@/actions/wishlist.actions';
import { toast } from 'sonner';
import { useWishlist } from '@/Context/wishlistContext';
import { useSession } from 'next-auth/react';

export default function WishlistBtn({ productId, classs, word, onlyIcon = false }: any) {
    const [isPending, startTransition] = useTransition();
    const { refreshWishlistCount, wishlistIds } = useWishlist(); // استلم الـ IDs من هنا
    const { status } = useSession();

    // مش محتاجين useEffect خالص هنا! الـ Context هو اللي شايل الليلة
    const isExist = wishlistIds.includes(productId);

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (status !== "authenticated") {
            toast.error("Please login first");
            return;
        }

        startTransition(async () => {
            const action = isExist ? RemoveFromWishlist : AddToWishlist;
            const res = await action(productId);

            if (res.status === "success") {
                toast.success(isExist ? "Removed" : "Added");
                // بنحدث الـ Context مرة واحدة والكل هيسمع
                await refreshWishlistCount();
            }
        });
    }

    // باقي كود الـ UI (نفس اللي عندك بالظبط)
    const activeColor = "text-red-600 border-red-200 bg-red-50";
    const normalColor = "text-gray-400 border-gray-100 bg-white hover:text-red-500";

    return (
        <button onClick={toggleWishlist} disabled={isPending} className={`transition-all ${classs} ${isExist ? activeColor : normalColor}`}>
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Heart className={isExist ? "fill-red-600" : ""} size={onlyIcon ? 20 : 16} />}
            {!onlyIcon && <span className="ml-2">{isExist ? "In Wishlist" : word}</span>}
        </button>
    );
}