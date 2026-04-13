"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from "react";
import { GetLoggedUserCart, Addtocard } from "@/actions/card.actions";
import { useSession } from "next-auth/react";

interface CartContextType {
    cartCount: number;
    cartItems: any[]; // ده اللي إنت مستخدمه في الـ State
    cartId: string;
    cartTotal: number;
    setCartCount: (count: number) => void;
    refreshCartCount: () => Promise<void>;
    addProductToCart: (id: string) => Promise<any>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export default function CartContextProvider({ children }: { children: ReactNode }) {
    const [cartCount, setCartCount] = useState<number>(0);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [cartId, setCartId] = useState<string>(""); // 👈 تخزين الـ ID
    const [cartTotal, setCartTotal] = useState<number>(0); // 👈 تخزين الإجمالي

    const { data: session, status } = useSession();
    const lastFetchedToken = useRef<string | null>(null);
    const userToken = (session?.user as any)?.token;
    const refreshCartCount = useCallback(async () => {
        if (status !== "authenticated") return;

        try {
            console.log("🚀 Fetching Cart Data...");
            const res = await GetLoggedUserCart();

            if (res && res.status === "success") {
                setCartItems(res.data.products);
                setCartId(res.data._id); // 👈 بنحفظ الـ ID هنا عشان نستخدمه في الـ Checkout
                setCartTotal(res.data.totalCartPrice); // 👈 السعر الإجمالي
                setCartCount(res.numOfCartItems || 0);
            } else {
                setCartItems([]);
                setCartCount(0);
                setCartId("");
            }
        } catch (error) {
            console.error("Cart Context Error:", error);
        }
    }, [status]);

    const addProductToCart = async (id: string) => {
        if (status !== "authenticated") return { status: "error", message: "unauthenticated" };
        try {
            const res = await Addtocard(id);
            if (res.status === "success") {
                await refreshCartCount(); // تحديث بعد الإضافة
            }
            return res;
        } catch (error) {
            console.error("Error adding to cart:", error);
            throw error;
        }
    };

    useEffect(() => {
        // الفرامل: بننادي الداتا مرة واحدة بس لما التوكن يتغير
        if (status === "authenticated" && userToken) {
            if (lastFetchedToken.current !== userToken) {
                lastFetchedToken.current = userToken;
                refreshCartCount();
            }
        }

        if (status === "unauthenticated") {
            setCartItems([]);
            setCartCount(0);
            setCartId("");
            setCartTotal(0);
            lastFetchedToken.current = null;
        }
    }, [status, userToken, refreshCartCount]);

    return (
        <CartContext.Provider value={{
            cartCount,
            cartItems,
            cartId, // 👈 بنخرجه بره عشان صفحة الـ Checkout تشوفه
            cartTotal, // 👈 بنخرجه بره عشان صفحة الـ Checkout تشوفه
            setCartCount,
            refreshCartCount,
            addProductToCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartContextProvider");
    return context;
};