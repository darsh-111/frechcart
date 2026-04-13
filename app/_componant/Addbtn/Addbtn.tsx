"use client";
import React, { useContext, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { CartContext } from '@/Context/CartContext';
import { toast } from 'sonner';

interface AddbtnProps {
    id: string;
    count?: number;
    classs: string;
    word: string;
}

export default function Addbtn({ id, count = 1, classs, word }: AddbtnProps) {
    const context = useContext(CartContext);
    const [loading, setLoading] = useState(false);

    if (!context) return null;
    const { addProductToCart } = context;

    async function handleAddToCart(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        setLoading(true);
        try {
            const response = await addProductToCart(id);
            if (response?.status === "success") {
                toast.success('Added to cart! 🔥', { position: "top-center" });
            } else {
                toast.error("Login first", {
                    position: "top-center",
                    style: {
                        background:"red"
                    },
                    duration:700
                })
            }
        } catch (error) {
            toast.error('Failed to add');
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            disabled={loading}
            onClick={handleAddToCart}
            className={`${classs} flex items-center justify-center gap-2 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
            {loading ? (
                /* لودر واحد بس يظهر لما ندوس */
                <>
                    <Loader2 className="animate-spin" size={20} />
                </>
            ) : (
                /* التصميم العادي لما ميكونش فيه تحميل */
                <>
                    {!word.includes('+') && <Plus size={18} strokeWidth={3} />}
                    <span>{word}</span>
                </>
            )}
        </button>
    );
}