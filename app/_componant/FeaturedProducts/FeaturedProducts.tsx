import { Product } from '../../../api/routemisr.type/routemisr.type';
import { getProducts } from "@/api/routemisr.service/routemisr.servece";
import ProductCard from '../ProductCard/ProductCard';
import Link from 'next/link';


export default async function FeaturedProductsPage() {
    const products = await getProducts();

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                {/* العنوان بتصميم مشابه للصورة */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-1.5 h-7 bg-[#198754] rounded-full"></div>
                    <h2 className="text-4xl font-bold text-gray-800">
                        Featured <span className="text-[#198754]">Products</span>
                    </h2>
                    
                </div>

                {/* شبكة المنتجات (Responsive Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products?.map((item) => (
                        
                    <ProductCard product={item} key={item._id} />
                        
                    ))}
                </div>
            </div>
        </section>
    );
}