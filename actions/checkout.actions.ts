"use server"
import { ApiToken } from "@/app/utilities";

export async function CheckoutOrder(cartId: string, method: 'cash' | 'online', shippingAddress: any) {
    const apiToken = await ApiToken();
    if (!apiToken) return { status: "fail" };

    // لو الدفع أونلاين، بنستخدم الـ Endpoint بتاع الـ checkouts-session
    const url = method === 'online' 
        ? `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${process.env.NEXT_PUBLIC_BASE_URL}`
        : `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "token": apiToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ shippingAddress })
        });

        const data = await res.json();
        return data; 
        // في حالة الأونلاين، الـ API هيرجع لك session فيها الـ URL بتاع Stripe
    } catch (error) {
        return { status: "error" };
    }
}