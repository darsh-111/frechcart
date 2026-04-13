import { Category, Product } from "../routemisr.type/routemisr.type";

export async function getProducts(): Promise<Product[]> {
    const res = await fetch('https://ecommerce.routemisr.com/api/v1/products', {
        cache: "force-cache",
        next: { revalidate: 3600 } // تحسين الأداء بالكاش
    });
    if (!res.ok) throw new Error('Failed to fetch data');
    const data = await res.json();
    return data.data;
}
export async function getProductDetails(id: string): Promise<Product> {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`, {
        next: { revalidate: 60 }
    });
    const data = await res.json();
    return data.data;
}
 export async function getallcategories(): Promise<Category[] | undefined> {

    try {
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/categories")
        const data = await res.json();


        return data.data;
    }
    catch (err) {
        console.log(err)
        return undefined;


    }




}