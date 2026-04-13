'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
    ShoppingCart, Heart, Menu, Search, X, ChevronRight, LogOut,
    Settings, Package, User as UserIcon, MapPin
} from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession, signOut } from "next-auth/react";
import { useCart } from '@/Context/CartContext';
import { useWishlist } from '@/Context/wishlistContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_LINKS = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Categories', href: '/categories' },
    { name: 'Brands', href: '/brands' },
];

export default function Navbar() {
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { data: session, status } = useSession();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <nav className="bg-white border-b h-[73px] w-full shadow-sm"></nav>;
    }

    return (
        <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
            <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-10 py-3">
                <div className="flex items-center justify-between gap-4">

                    {/* Logo Section */}
                    <NextLink href="/" className="flex items-center gap-2 md:gap-3 shrink-0 group">
                        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:rotate-6 transition-transform">
                            <ShoppingCart size={22} strokeWidth={2.5} />
                        </div>
                        <span className="text-xl md:text-2xl font-black tracking-tight text-gray-900">
                            Fresh<span className="text-green-600">Cart</span>
                        </span>
                    </NextLink>

                    {/* Desktop Search Section */}
                    <div className="hidden md:block flex-1 max-w-xl mx-4">
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search for products..."
                                className="bg-gray-100 border-none focus-visible:ring-2 focus-visible:ring-green-500 h-11 rounded-full ps-6 transition-all"
                            />
                            <div className="absolute end-1.5 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full cursor-pointer transition-colors shadow-sm">
                                <Search size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 md:gap-3">

                        <div className="hidden lg:flex items-center gap-6 text-sm font-bold text-gray-600 me-4">
                            {NAV_LINKS.map((link) => (
                                <NextLink
                                    key={link.name}
                                    href={link.href}
                                    className="hover:text-green-600 transition-colors"
                                >
                                    {link.name}
                                </NextLink>
                            ))}
                        </div>

                        {/* Wishlist */}
                        <NextLink href="/wishlist" className="relative p-2.5 hover:bg-red-50 rounded-full transition-colors group">
                            <Heart size={24} className="text-gray-700 group-hover:text-red-500 transition-colors" />
                            {wishlistCount > 0 && (
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 shadow-sm">
                                    {wishlistCount > 99 ? '99+' : wishlistCount}
                                </span>
                            )}
                        </NextLink>

                        {/* Cart */}
                        <NextLink href="/cart" className="relative p-2.5 hover:bg-green-50 rounded-full transition-colors group">
                            <ShoppingCart size={24} className="text-gray-700 group-hover:text-green-600 transition-colors" />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 bg-green-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 shadow-sm">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </NextLink>

                        {/* User Menu */}
                        <div className="hidden md:block ml-2">
                            {status === "authenticated" ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="focus:outline-none">
                                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold border-2 border-green-200 hover:bg-green-600 hover:text-white transition-all cursor-pointer shadow-sm">
                                            {session?.user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent className="w-60 mt-2 p-2 rounded-xl" >
                                        <DropdownMenuLabel className="p-3">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-bold text-gray-900 leading-none">{session?.user?.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />

                                        {/* رجعنا اللينكات اللي اتمسحت */}
                                        <DropdownMenuItem asChild className="focus:bg-green-50 focus:text-green-600 rounded-lg cursor-pointer py-2.5">
                                            <NextLink href="/myaddress" className="flex items-center">
                                                <UserIcon className="mr-3 h-4 w-4" /> My Profile
                                            </NextLink>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem asChild className="focus:bg-green-50 focus:text-green-600 rounded-lg cursor-pointer py-2.5">
                                            <NextLink href="/allorders" className="flex items-center">
                                                <Package className="mr-3 h-4 w-4" /> My Orders
                                            </NextLink>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="focus:bg-green-50 focus:text-green-600 rounded-lg cursor-pointer py-2.5">
                                            <NextLink href="/wishlist" className="flex items-center">
                                                <Heart className="mr-3 h-4 w-4" /> My Wishlist
                                            </NextLink>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem asChild className="focus:bg-green-50 focus:text-green-600 rounded-lg cursor-pointer py-2.5">
                                            <NextLink href="/myaddress" className="flex items-center">
                                                <MapPin className="mr-3 h-4 w-4" /> Addresses
                                            </NextLink>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem asChild className="focus:bg-green-50 focus:text-green-600 rounded-lg cursor-pointer py-2.5">
                                            <NextLink href="/setting" className="flex items-center">
                                                <Settings className="mr-3 h-4 w-4" /> Settings
                                            </NextLink>
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem
                                            className="text-red-600 focus:bg-red-50 focus:text-red-700 rounded-lg cursor-pointer py-2.5 font-medium"
                                            onClick={() => signOut({ callbackUrl: '/', redirect: true })}
                                        >
                                            <LogOut className="mr-3 h-4 w-4" /> Sign Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <NextLink href="/login">
                                    <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-7 font-bold transition-all">
                                        Sign In
                                    </Button>
                                </NextLink>
                            )}
                        </div>

                        {/* Mobile Menu */}
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-gray-700">
                                    <Menu size={28} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] p-0">
                                <div className="flex flex-col h-full">
                                    <div className="p-6 border-b flex items-center justify-between bg-green-600 text-white">
                                        <span className="text-xl font-black">FreshCart</span>
                                        <X size={24} className="cursor-pointer" onClick={() => setOpen(false)} />
                                    </div>
                                    <div className="flex-1 overflow-y-auto py-4">
                                        {NAV_LINKS.map((link) => (
                                            <NextLink
                                                key={link.name}
                                                href={link.href}
                                                onClick={() => setOpen(false)}
                                                className="flex items-center justify-between px-8 py-4 text-gray-700 hover:bg-green-50 border-b border-gray-50"
                                            >
                                                <span className="font-bold">{link.name}</span>
                                                <ChevronRight size={18} />
                                            </NextLink>
                                        ))}

                                        {/* لينكات الموبايل الإضافية عند تسجيل الدخول */}
                                        {status === "authenticated" && (
                                            <>
                                                <NextLink href="/profile" onClick={() => setOpen(false)} className="flex items-center px-8 py-4 text-gray-600 hover:bg-gray-50">
                                                    <UserIcon size={18} className="mr-3" /> Profile
                                                </NextLink>
                                                <NextLink href="/addresses" onClick={() => setOpen(false)} className="flex items-center px-8 py-4 text-gray-600 hover:bg-gray-50">
                                                    <MapPin size={18} className="mr-3" /> Addresses
                                                </NextLink>
                                            </>
                                        )}
                                    </div>
                                    <div className="p-8 border-t bg-gray-50 mt-auto">
                                        {status !== "authenticated" ? (
                                            <NextLink href="/login" onClick={() => setOpen(false)}>
                                                <Button className="w-full bg-green-600 h-14 rounded-xl font-bold">Sign In</Button>
                                            </NextLink>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                className="w-full border-red-200 text-red-600 h-14 rounded-xl font-bold"
                                                onClick={() => signOut()}
                                            >
                                                Sign Out
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}