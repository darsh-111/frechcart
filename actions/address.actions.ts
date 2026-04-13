"use server"
import { ApiToken } from "@/app/utilities";
import { revalidatePath } from "next/cache";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1/addresses";

// 1. جلب كل العناوين
export async function GetUserAddresses() {
    const apiToken = await ApiToken();
    if (!apiToken) return { status: "fail" };

    try {
        const res = await fetch(BASE_URL, {
            method: "GET",
            headers: { "token": apiToken }
        });
        return await res.json();
    } catch (error) {
        return { status: "error" };
    }
}
export async function UpdateAddress(addressId: string, formData: { name: string, details: string, phone: string, city: string }) {
    const apiToken = await ApiToken();
    if (!apiToken) return { status: "fail" };

    try {
        const res = await fetch(`${BASE_URL}/${addressId}`, {
            method: "PUT", // التعديل دايماً PUT
            headers: {
                "token": apiToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });
        revalidatePath("/profile/addresses");
        return await res.json();
    } catch (error) {
        return { status: "error" };
    }
}

// 2. إضافة عنوان جديد
export async function AddAddress(formData: { name: string, details: string, phone: string, city: string }) {
    const apiToken = await ApiToken();
    if (!apiToken) return { status: "fail" };

    try {
        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "token": apiToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });
        revalidatePath("/profile/addresses");
        return await res.json();
    } catch (error) {
        return { status: "error" };
    }
}

// 3. حذف عنوان
export async function RemoveAddress(addressId: string) {
    const apiToken = await ApiToken();
    if (!apiToken) return { status: "fail" };

    try {
        const res = await fetch(`${BASE_URL}/${addressId}`, {
            method: "DELETE",
            headers: { "token": apiToken }
        });
        revalidatePath("/profile/addresses");
        return await res.json();
    } catch (error) {
        return { status: "error" };
    }
}