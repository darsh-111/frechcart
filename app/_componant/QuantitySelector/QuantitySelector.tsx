"use client";
import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import Addbtn from '../Addbtn/Addbtn'; // تأكد من المسار لملف الـ Addbtn

export default function QuantitySelector({ productId, productPrice }: { productId: string, productPrice: number }) {
    const [quantity, setQuantity] = useState(1);

    const increment = () => setQuantity(prev => prev + 1);
    const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="space-y-6">
            {/* الجزء الأول: العداد وحساب السعر الإجمالي */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantity</span>
                    <div className="flex items-center border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
                        <button
                            onClick={decrement}
                            className="p-3 hover:bg-gray-50 text-[#198754] transition-colors"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="px-5 font-bold text-sm min-w-[40px] text-center">{quantity}</span>
                        <button
                            onClick={increment}
                            className="p-3 hover:bg-gray-50 text-[#198754] transition-colors"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center sm:block">
                    <span className="text-xs text-gray-400 sm:mr-2">Total Price:</span>
                    <span className="text-lg md:text-xl font-bold text-[#198754]">
                        {(productPrice * quantity).toLocaleString()} EGP
                    </span>
                </div>
            </div>

            {/* الجزء الثاني: أزرار الأكشن */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* زرار الإضافة للعربة - بنبعت له الـ quantity الحالية */}
                <Addbtn
                    id={productId}
                    count={quantity}
                    word="Add to Cart"
                    classs="h-14 bg-[#198754] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#146c43] transition-all shadow-md active:scale-95"
                />

                <button className="h-14 bg-[#121621] text-white font-bold rounded-xl hover:bg-black transition-all shadow-md active:scale-95">
                    Buy Now
                </button>
            </div>
        </div>
    );
}