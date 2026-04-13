"use server";
import { ApiToken } from "@/app/utilities";

const baseUrl = "https://ecommerce.routemisr.com/api/v1/wishlist";

export async function AddToWishlist(productId: string) {
    const apiToken = await ApiToken();

    // لو مفيش توكن ارجع بدري عشان الـ fetch مايشتغلش ويطلع error
    if (!apiToken) return { status: "fail", message: "You are not logged in" };

    const res = await fetch(baseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "token": apiToken,
        },
        body: JSON.stringify({ productId }),
    });

    return res.json();
}

export async function RemoveFromWishlist(productId: string) {
    const apiToken = await ApiToken();
    if (!apiToken) return { status: "fail", message: "You are not logged in" };

    const res = await fetch(`${baseUrl}/${productId}`, {
        method: "DELETE",
        headers: {
            "token": apiToken,
        },
    });

    return res.json();
}

export async function GetLoggedUserWishlist() {
    const apiToken = await ApiToken();

    // ده أهم سطر لمنع الـ Loop والرسايل الكتير وأنت مش عامل لوجن
    if (!apiToken) {
        return { status: "success", data: [] }; // بنرجعه نجاح وداتا فاضية عشان الـ UI ميزعلش
    }

    try {
        const res = await fetch(baseUrl, {
            method: "GET",
            headers: {
                "token": apiToken,
            },
            cache: "no-store",
        });

        const data = await res.json();
        return data;
    } catch (error) {
        return { status: "error", data: [] };
    }
}