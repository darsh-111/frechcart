"use server"
import { ApiToken } from "@/app/utilities";
import { jwtDecode } from "jwt-decode"; // لازم تعمل import للمكتبة دي

export async function GetUserOrders() {
    const apiToken = await ApiToken();
    if (!apiToken) return [];

    try {
        // 1. فك تشفير التوكن عشان ناخد منه الـ id الحقيقي للمستخدم
        const decoded: any = jwtDecode(apiToken);
        const userId = decoded.id;

        // 2. دلوقتي نبعت الـ userId الصح في الـ URL
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`, {
            method: "GET",
            cache: "no-store"
        });

        const data = await res.json();

        // الـ API بتاع Route بيرجع الـ Array مباشرة، لو مفيش بيرجع مصفوفة فاضية
        return data;

    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}