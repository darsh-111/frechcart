import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "mylogin",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@mail.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // 🟢 استخدام try...catch للتعامل مع أخطاء السيرفر أو الشبكة
                try {
                    const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
                        method: "POST",
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                        headers: { "Content-Type": "application/json" },
                    });

                    const user = await res.json();

                    // لو الرد تمام والتوكن موجود
                    if (res.ok && user.token) {
                        return {
                            id: user.user._id,
                            name: user.user.name,
                            email: user.user.email,
                            token: user.token, // تخزين التوكن لاستخدامه لاحقاً
                        };
                    }

                    // لو البيانات غلط (مثلاً باسوورد غلط) بنرجع null
                    return null;

                } catch (error) {
                    // لو السيرفر وقع أو حصلت مشكلة في الـ Fetch
                    console.error("Auth Error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        // تخزين البيانات في الـ JWT عشان تكون متاحة للـ Session
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        // عرض البيانات في الـ Session عشان تقدر تستخدمها في الـ Client Side
        async session({ session, token }) {
            session.user = token.user as any;
            return session;
        },
    },
    pages: {
        signIn: "/login", // الصفحة اللي إنت عاملها
    },
    secret: process.env.NEXTAUTH_SECRET, // مهم جداً يكون موجود في ملف الـ .env
};