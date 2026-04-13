'use client';

import { Gift, Mail, Phone, Truck, User, UserPlus, LogOut } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useSession, signOut } from "next-auth/react";

export default function TopNavbar() {
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);

    // حماية من الـ Hydration Error
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="bg-white border-b py-2 hidden md:block h-[37px]"></div>;
    }

    return (
        <div className="bg-white border-b py-2 hidden md:block">
            <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-10 flex items-center justify-between text-[#6c757d] text-[13px]">

                {/* الجزء الأيسر: الشحن والوصول الجديد */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Truck size={15} className="text-[#0aad0a]" />
                        <span>Free Shipping on Orders 500 EGP</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Gift size={15} className="text-[#0aad0a]" />
                        <span>New Arrivals Daily</span>
                    </div>
                </div>

                {/* الجزء الأيمن: الاتصال، الإيميل، والتسجيل */}
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1.5 hover:text-[#0aad0a] cursor-pointer transition-colors">
                        <Phone size={14} />
                        <span>+1 (800) 123-4567</span>
                    </div>

                    <div className="flex items-center gap-1.5 hover:text-[#0aad0a] cursor-pointer transition-colors">
                        <Mail size={14} />
                        <span>support@freshcart.com</span>
                    </div>

                    <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>

                    {/* أزرار التسجيل - Logic Auth */}
                    <div className="flex items-center gap-4">
                        {status === "authenticated" ? (
                            // لو مسجل دخول: يظهر الترحيب وزرار الخروج
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                                    <User size={14} className="text-[#0aad0a]" />
                                    <span>Hi, {session?.user?.name?.split(' ')[0]}</span>
                                </div>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/', redirect: true })}
                                    className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
                                >
                                    <LogOut size={14} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            // لو مش مسجل: يظهر تسجيل الدخول
                            <>
                                <Link href="/login" className="flex items-center gap-1.5 hover:text-[#0aad0a] transition-colors">
                                    <User size={14} />
                                    <span>Sign In</span>
                                </Link>
                                <Link href="/register" className="flex items-center gap-1.5 hover:text-[#0aad0a] transition-colors">
                                    <UserPlus size={14} />
                                    <span>Sign Up</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}