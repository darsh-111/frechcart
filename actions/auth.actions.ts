"use server";
import { loginSchema, RegisterSchema } from "@/schema/schema";
import { cookies } from "next/headers";
import z from "zod";

export const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    try {
        const res = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signup', {
            method: "POST",
            body: JSON.stringify(values),
            headers: { "content-type": "application/json" },
        });
        const result = await res.json();
        return res.ok;
    } catch (err) {
        console.error("Signup Error:", err);
        return false;
    }
};

export const loginSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
        const res = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signin', {
            method: "POST",
            body: JSON.stringify(values),
            headers: { "content-type": "application/json" },
        });

        const result = await res.json();

        if (res.ok && result.token) {
            const cookieStore = await cookies();

            // سيف التوكن باسم userToken عشان ده اللي بننادي عليه في الـ Wishlist
            cookieStore.set("userToken", result.token, {
                httpOnly: true, // أمان عشان الـ JS ميشوفهاش
                secure: process.env.NODE_ENV === "production", // تشتغل HTTPS في الـ Production
                maxAge: 60 * 60 * 24 * 7, // يعيش أسبوع
                path: "/", // أهم سطر عشان الكوكي تتشاف في كل الصفحات والأكشنز
                sameSite: "lax"
            });

            return true;
        }

        return false;
    } catch (err) {
        console.error("Login Error:", err);
        return false;
    }
};