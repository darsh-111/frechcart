import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const myPath = request.nextUrl.pathname;

    // 🟢 السطر السحري لمنع اللوب:
    // لو الطلب ده Server Action (زي Addtocard)، سيبه يعدي فوراً من غير أي تشيك
    if (request.headers.has('x-nextjs-action')) {
        return NextResponse.next();
    }

    const protectedRoutes = ["/cart", "/wishlist", "/checkout","/orders"];
    const authRoutes = ["/login", "/register"];

    const myToken = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NODE_ENV === "production",
    });

    const isAuthenticated = !!myToken;

    // 1. لو مش مسجل دخول ورايح لصفحة محمية
    if (!isAuthenticated && protectedRoutes.some((path) => myPath.startsWith(path))) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. لو مسجل دخول ورايح لصفحة (Login أو Register)
    if (isAuthenticated && authRoutes.some((path) => myPath.startsWith(path))) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/cart/:path*',
        '/wishlist/:path*',
        '/checkout/:path*',
        '/orders/:path*',
        '/login',
        '/register',
    ],
}