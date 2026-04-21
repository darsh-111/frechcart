import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function ApiToken() {
    const cookieStore = await cookies()
    const MyToken = cookieStore.get("next-auth.session-token")?.value ||cookieStore.get("next-auth.session-token")?.value;

    const decodedtoken: any = await decode({
        token: MyToken,
        secret: process.env.NEXTAUTH_SECRET!,
    });

    // بناءً على الـ Log بتاعك: التوكن موجود جوه user.token
    const apiToken = decodedtoken?.user?.token;

    if (!apiToken) {
        console.log("❌ Token not found in decoded object");
        return { status: "fail", message: "Unauthorized" };
    }
    return apiToken
}
