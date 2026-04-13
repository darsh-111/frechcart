import React from 'react'
import { Star, Truck, Share2, RotateCcw, Award, Check, ChevronRight } from 'lucide-react'
import Link from 'next/link';
import { getProductDetails } from '@/api/routemisr.service/routemisr.servece';
import WishlistBtn from '@/app/_componant/Addbtn/WishlistBtn';
import QuantitySelector from '@/app/_componant/QuantitySelector/QuantitySelector';

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProductDetails(id);

    if (!product) return <div className="text-center py-20">Product not found</div>;

    const hasDiscount = !!(product.priceAfterDiscount && product.priceAfterDiscount < product.price);

    return (
        <section className="bg-white min-h-screen pb-10">
            <div className="container mx-auto px-4 py-4 md:py-8">

                {/* 1. Breadcrumbs */}
                <nav className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs text-gray-500 mb-6 overflow-hidden whitespace-nowrap">
                    <Link href="/" className="hover:text-[#198754]">Home</Link>
                    <ChevronRight size={10} />
                    <span className="truncate max-w-[80px] md:max-w-none">{product.category?.name}</span>
                    <ChevronRight size={10} />
                    <span className="text-gray-900 font-medium truncate max-w-[120px] md:max-w-none">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-10">

                    {/* 2. قسم الصور */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="aspect-square bg-white rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center p-2 md:p-6 shadow-sm">
                            <img src={product.imageCover} alt={product.title} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex lg:grid lg:grid-cols-4 gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                            {product.images?.map((img: string, i: number) => (
                                <div key={i} className={`min-w-[75px] md:min-w-0 aspect-square border-2 rounded-lg overflow-hidden p-1 flex-shrink-0 ${i === 0 ? 'border-[#198754]' : 'border-gray-50'}`}>
                                    <img src={img} alt="" className="w-full h-full object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. تفاصيل المنتج */}
                    <div className="lg:col-span-7 space-y-4 md:space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <span className="text-[9px] md:text-[10px] bg-[#E8F5E9] text-[#198754] font-bold px-2 py-1 rounded uppercase">
                                    {product.category?.name}
                                </span>
                                <span className="text-[9px] md:text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-1 rounded uppercase">
                                    {product.brand?.name}
                                </span>
                            </div>
                            <button className="lg:hidden p-2 text-gray-400 border border-gray-100 rounded-full"><Share2 size={16} /></button>
                        </div>

                        <h1 className="text-xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-2">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.floor(product.ratingsAverage || 4) ? "currentColor" : "none"} />)}
                            </div>
                            <span className="text-[11px] md:text-xs text-gray-500 font-semibold">{product.ratingsAverage} ({product.ratingsQuantity || 0} Reviews)</span>
                        </div>

                        <div className="flex items-baseline gap-3">
                            <span className="text-2xl md:text-4xl font-black text-gray-950">
                                {hasDiscount ? product.priceAfterDiscount : product.price} EGP
                            </span>
                            {hasDiscount && <span className="text-sm md:text-lg text-gray-400 line-through">{product.price} EGP</span>}
                        </div>

                        <div className="flex items-center gap-2 text-[#198754] text-[10px] font-bold bg-[#E8F5E9] w-fit px-3 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-[#198754] rounded-full animate-pulse"></span> In Stock
                        </div>

                        <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">{product.description}</p>

                        {/* --- قسم الأكشن المعدل --- */}
                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            {/* الـ QuantitySelector هنا هيقوم بكل الوظائف:
                                1. العداد (Plus/Minus)
                                2. حساب السعر الإجمالي (Total Price)
                                3. زرار الـ Add to Cart (لأنه محتاج يعرف الـ quantity من الـ state)
                            */}
                            <QuantitySelector
                                productId={product._id}
                                productPrice={hasDiscount
                                    ? (product.priceAfterDiscount ?? product.price)
                                    : product.price}                            />

                            <WishlistBtn
                                productId={product._id}
                                word="Add to Wishlist"
                                onlyIcon={false}
                                classs="w-full h-12 border rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                            />
                        </div>

                        {/* شريط المميزات */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-6">
                            {[
                                { icon: Truck, t: "Free Delivery", s: "Orders over 500 EGP" },
                                { icon: RotateCcw, t: "30 Days Return", s: "Easy & Fast" },
                                { icon: Award, t: "Secure Payment", s: "100% Protected" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center sm:flex-col gap-3 sm:gap-1 p-3 bg-[#F8F9FA] rounded-xl border border-gray-50">
                                    <item.icon size={20} className="text-[#198754] flex-shrink-0" />
                                    <div className="text-left sm:text-center">
                                        <p className="text-[10px] font-bold text-gray-950 leading-none">{item.t}</p>
                                        <p className="text-[9px] text-gray-400 mt-1">{item.s}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* قسم الـ Tabs */}
                <div className="mt-12 md:mt-20">
                    <div className="flex gap-4 md:gap-8 border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
                        <button className="pb-4 border-b-2 border-[#198754] text-[#198754] font-bold text-xs md:text-sm">Product Details</button>
                        <button className="pb-4 text-gray-400 font-bold text-xs md:text-sm hover:text-gray-600">Reviews ({product.ratingsQuantity || 0})</button>
                        <button className="pb-4 text-gray-400 font-bold text-xs md:text-sm hover:text-gray-600">Shipping</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">About this Product</h4>
                            <p className="text-sm text-gray-500 leading-relaxed text-justify md:text-left">{product.description}</p>
                        </div>

                        <div className="bg-[#F8F9FA] p-5 md:p-8 rounded-2xl border border-gray-50">
                            <h4 className="text-xs font-black text-gray-900 mb-6 uppercase tracking-widest">Key Information</h4>
                            <div className="space-y-4">
                                {[
                                    { l: "Category", v: product.category?.name },
                                    { l: "Brand", v: product.brand?.name },
                                    { l: "Sold", v: `${product.sold || 0}+ items` }
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between border-b border-gray-200/50 pb-2 text-sm">
                                        <span className="text-gray-400 text-xs">{row.l}</span>
                                        <span className="text-gray-800 font-bold text-xs">{row.v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}