"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { GetLoggedUserWishlist } from "@/actions/wishlist.actions";
import { useSession } from "next-auth/react";

interface WishlistContextType {
    wishlistCount: number;
    wishlistIds: string[]; // ضفنا دي عشان نخزن الـ IDs
    setWishlistCount: (count: number) => void;
    refreshWishlistCount: () => Promise<void>;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export default function WishlistContextProvider({ children }: { children: ReactNode }) {
    const [wishlistCount, setWishlistCount] = useState<number>(0);
    const [wishlistIds, setWishlistIds] = useState<string[]>([]);
    const { status } = useSession();
    const isFetching = useRef(false);

    const refreshWishlistCount = useCallback(async () => {
        if (status !== "authenticated" || isFetching.current) return;

        try {
            isFetching.current = true;
            const res = await GetLoggedUserWishlist();
            if (res?.status === "success" && Array.isArray(res.data)) {
                setWishlistCount(res.data.length);
                // بنسيف الـ IDs بس عشان الأزرار تقارن بيها
                setWishlistIds(res.data.map((item: any) => item.id || item._id));
            }
        } catch (error) {
            console.error("Wishlist Context Error:", error);
        } finally {
            isFetching.current = false;
        }
    }, [status]);

    useEffect(() => {
        if (status === "authenticated") {
            refreshWishlistCount();
        } else {
            setWishlistCount(0);
            setWishlistIds([]);
        }
    }, [status]); // الـ Loop انكسر هنا

    return (
        <WishlistContext.Provider value={{ wishlistCount, wishlistIds, setWishlistCount, refreshWishlistCount }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error("useWishlist Error");
    return context;
};