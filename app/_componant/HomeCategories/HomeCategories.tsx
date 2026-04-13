import React from 'react'
import { Category } from '../../../api/routemisr.type/routemisr.type';
import { getallcategories } from '@/api/routemisr.service/routemisr.servece';
import Link from 'next/link';

//https://ecommerce.routemisr.com/api/v1/categories
export default async function HomeCategories(){
    
    const categories = await getallcategories();
    
    
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                {/* العنوان زي السكتش بالظبط */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-8 bg-[#198754] rounded-full"></div>
                        <h2 className="text-4xl font-bold text-gray-800">
                            Shop By <span className="text-[#198754]">Category</span>
                        </h2>
                    </div>
                    <button className="text-[#198754] font-medium hover:underline flex items-center gap-1 transition-all">
                        View All Categories <span>→</span>
                    </button>
                </div>

                {/* توزيع الكروت (Responsive Grid) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                    {categories?.map((category: Category) => (
                        <Link href={`/categorydetailes/${category._id}` }key={category._id}><div
                            
                            className="group bg-white border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 flex flex-col items-center text-center cursor-pointer"
                        >
                            {/* دائرة الصورة الخلفية */}
                            <div className=" bg-gray-50 flex items-center justify-center mb-4 relative overflow-hidden group-hover:bg-green-50 transition-colors">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className=" w-24 h-24 object-cover rounded-full mix-blend-multiply transition-transform duration-500"
                                />
                            </div>

                            <h3 className="font-bold text-gray-700 text-sm group-hover:text-[#198754] transition-colors">
                                {category.name}
                            </h3>
                        </div></Link>
                    ))}
                </div>
            </div>
        </section>)
}
