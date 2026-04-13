"use server"
import { ApiToken } from "@/app/utilities";
import { cookies } from "next/headers"

const BASE_URL = "https://ecommerce.routemisr.com/api/v1"

// 1. تحديث بيانات المستخدم (الاسم، الإيميل، التليفون)
// 1. تحديث بيانات المستخدم (الاسم والتليفون فقط)
export async function UpdateUserData(formData: { name: string, phone: string }) {
    const apiToken = await ApiToken();
    try {
        const res = await fetch(`${BASE_URL}/users/updateMe/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "token": apiToken
            },
            // بنبعت الاسم والتليفون بس، الإيميل ممنوع يتعدل من هنا في الـ API ده
            body: JSON.stringify({
                name: formData.name,
                phone: formData.phone
            })
        })
        const data = await res.json()

        if (data.message === "success") return { status: "success", data: data.user }

        // لو الـ API رجع إن التوكن فيه مشكلة
        return { status: "error", message: data.message || "حدث خطأ ما" }
    } catch (err) {
        return { status: "error", message: "Network error" }
    }
}

// 2. تحديث كلمة المرور
export async function UpdateUserPassword(passwords: any) {
    const apiToken = await ApiToken();
   
    try {
        const res = await fetch(`${BASE_URL}/users/changeMyPassword`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "token": apiToken
            },
            body: JSON.stringify(passwords)
        })
        const data = await res.json()
        if (data.message === "success") return { status: "success", apiToken: data.apiToken }
        return { status: "error", message: data.errors?.msg || data.message }
    } catch (err) {
        return { status: "error", message: "Connection failed" }
    }
}