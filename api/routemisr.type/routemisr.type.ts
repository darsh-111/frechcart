 export interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
    createdAt: string;
     updatedAt: string;
     data: string;
}

// 2. واجهة العلامة التجارية (Brand)
interface Brand {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

// 3. واجهة التصنيفات الفرعية (Subcategory)
interface Subcategory {
    _id: string;
    name: string;
    slug: string;
    category: string;
}

// 4. الواجهة الرئيسية للمنتج (Product)
export interface Product {
    _id: string;
    id: string;
    title: string;
    slug: string;
    description: string;
    quantity: number;
    sold: number;
    price: number;
    priceAfterDiscount?: number; // علامة الاستهام تعني أنه اختياري (قد لا يوجد خصم)
    imageCover: string;
    images: string[];
    ratingsAverage: number;
    ratingsQuantity: number;
    category: Category;
    brand: Brand;
    subcategory: Subcategory[];
    createdAt: string;
    updatedAt: string;
}