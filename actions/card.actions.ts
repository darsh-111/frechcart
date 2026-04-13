"use server"
import { ApiToken } from "@/app/utilities";
import { revalidatePath } from "next/cache";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1/cart";

// 1. إضافة للمنتجات
export async function Addtocard(id: string) {
    const apiToken = await ApiToken();

    // حماية: لو مفيش توكن اخرج فوراً
    if (!apiToken) return { status: "fail", message: "unauthenticated" };

    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "token": apiToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ productId: id }),
        });

        return await response.json();
    } catch (error) {
        return { status: "error", error };
    }
}

// 2. جلب بيانات العربة (المسؤول الأول عن الـ Loop)
export async function GetLoggedUserCart() {
    const apiToken = await ApiToken();

    // حماية: لو مفيش توكن رجع داتا فاضية عشان الـ Context ميعملش Error
    if (!apiToken) {
        return { status: "success", data: { products: [], totalCartPrice: 0 } };
    }

    try {
        const response = await fetch(BASE_URL, {
            method: "GET",
            headers: {
                "token": apiToken,
                "Content-Type": "application/json"
            },
        });

        return await response.json();
    } catch (error) {
        return { status: "error", error };
    }
}

// 3. تحديث الكمية
export async function UpdateProductQuantity(productId: string, count: number) {
    const apiToken = await ApiToken();
    if (!apiToken) return { status: "fail" };

    try {
        const response = await fetch(`${BASE_URL}/${productId}`, {
            method: "PUT",
            headers: {
                "token": apiToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ count: count }),
        });
        const data = await response.json();
        revalidatePath("/cart");
        return data;
    } catch (error) {
        return { status: "error", error };
    }
}

// 4. حذف منتج معين
export async function RemoveCartItem(productId: string) {
    const apiToken = await ApiToken();
    if (!apiToken) return { status: "fail" };

    try {
        const response = await fetch(`${BASE_URL}/${productId}`, {
            method: "DELETE",
            headers: {
                "token": apiToken,
            },
        });
        const data = await response.json();
        revalidatePath("/cart");
        return data;
    } catch (error) {
        return { status: "error", error };
    }
}

// 5. مسح العربة بالكامل
export async function ClearCart() {
    const apiToken = await ApiToken();
    if (!apiToken) return { success: false };

    try {
        // ملحوظة: الـ API ده v2 زي ما إنت كاتبه
        const response = await fetch('https://ecommerce.routemisr.com/api/v2/cart', {
            method: 'DELETE',
            headers: {
                'token': apiToken
            }
        });

        const result = await response.json();
        if (result.status === "success") {
            revalidatePath('/cart');
            return { success: true };
        }
        return { success: false };
    } catch (error) {
        return { success: false };
    }
}