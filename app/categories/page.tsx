import React from 'react';
import { LayoutGrid, ChevronRight } from 'lucide-react';
import { Category } from '@/api/routemisr.type/routemisr.type';
import { getallcategories } from '@/api/routemisr.service/routemisr.servece';
import Link from 'next/link';

// 1. كومبونانت الكارت المنفرد (CategoryCard)
const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <Link href={`/categorydetailes/${category._id}`} className="block h-full">
      <div className="group cursor-pointer bg-white rounded-[2rem] border border-gray-100 p-3 shadow-sm hover:shadow-2xl hover:border-green-300 transition-all duration-500 transform hover:-translate-y-2 h-full">
        {/* حاوية الصورة */}
        <div className="relative aspect-square overflow-hidden rounded-[1.5rem] mb-4 bg-gray-50">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
        </div>

        {/* تفاصيل الكارت */}
        <div className="text-center pb-3">
          <h3 className="text-lg font-extrabold text-gray-800 group-hover:text-[#22c55e] transition-colors duration-300 line-clamp-1 px-2">
            {category.name}
          </h3>

          <div className="flex justify-center items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <span className="text-[10px] text-[#22c55e] font-black uppercase tracking-tighter">
              View Subcategories
            </span>
            <ChevronRight className="w-3 h-3 text-[#22c55e]" />
          </div>
        </div>
      </div>
    </Link>
  );
};

// 2. الكومبونانت الرئيسي (CategoriesGrid)
export default async function CategoriesGrid() {
  // جلب الداتا من الـ Service
  const response = await getallcategories();

  const data: Category[] = (response as Category[]) || [];

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      {/* Header Section */}
      <header className="bg-[#22c55e] py-20 px-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="container mx-auto relative z-10">
          <div className="flex items-center gap-5">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-inner border border-white/10">
              <LayoutGrid className="w-10 h-10 text-white" />
            </div>
            <div>
              <nav className="flex items-center gap-2 text-green-50 text-xs mb-2">
                <Link href="/">
                  <span className="hover:text-white cursor-pointer transition-colors">Home</span>
                </Link>
                <span>/</span>
                <span className="text-white font-medium">Categories</span>
              </nav>
              <h1 className="text-5xl font-black tracking-tight mb-1">
                All Categories
              </h1>
              <p className="text-green-50/80 text-lg font-medium italic">
                Browse our wide range of product categories
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Grid Section */}
      <main className="container mx-auto py-16 px-6">
        {data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {data.map((item) => (
              <CategoryCard key={item._id} category={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-[#22c55e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-xl font-medium">
              Loading Categories...
            </p>
          </div>
        )}
      </main>
    </div>
  );
}