import React from 'react'
import { Folder } from 'lucide-react' // أيقونة الفولدر
import Link from 'next/link';

export default async function CategoryDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        // 1. نجيب بيانات القسم (عشان الاسم اللي في الأخضر)
        const catRes = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${id}`);
        const categoryData = await catRes.json();
        const category = categoryData.data;

        // 2. نجيب الـ Subcategories التابعة ليه
        const subRes = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${id}/subcategories`);
        const subData = await subRes.json();
        const subcategories = subData.data;

        return (
            <div className="min-h-screen bg-white">
                {/* 🟢 الجزء العلوي الأخضر (Header) */}
                <div className="bg-[#008235] p-10 text-white">
                    <div className="container mx-auto flex items-center gap-6">
                        <img
                            src={category.image}
                            alt={category.name}
                            className="w-20 h-20 rounded-lg object-cover border-2 border-white/20"
                        />
                        <div>
                            <h1 className="text-4xl font-bold">{category.name}</h1>
                            <p className="text-green-50/80 mt-1">Choose a subcategory to browse products</p>
                        </div>
                    </div>
                </div>

                {/* 🟢 جزء المحتوى (Subcategories Grid) */}
                <div className="container mx-auto py-12 px-6">
                    <Link href="/categories" className="flex items-center gap-2 text-gray-600 mb-8 hover:text-green-600 transition-colors">
                        ← Back to Categories
                    </Link>

                    <h2 className="text-xl font-bold mb-8">
                        {subcategories.length} Subcategories in {category.name}
                    </h2>

                    {/* الـ Grid اللي فيه الكروت */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {subcategories.map((sub: any) => (
                            <div
                                key={sub._id}
                                className="group p-8 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer"
                            >
                                <div className="bg-green-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                                    <Folder className="text-[#198754] w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">{sub.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

    } catch (err) {
        return <div className="p-20 text-center text-red-500 font-bold">Failed to load content.</div>;
    }
}