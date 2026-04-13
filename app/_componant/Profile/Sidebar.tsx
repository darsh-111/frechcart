"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MapPin, Settings, ChevronRight } from "lucide-react"

export const ProfileSidebar = () => {
    const pathname = usePathname()

    const links = [
        { name: "My Addresses", href: "/myaddress", icon: MapPin },
        { name: "Settings", href: "/setting", icon: Settings },
    ]

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-50 bg-gray-50/30">
                <h2 className="font-bold text-gray-800 text-sm">My Account</h2>
            </div>
            <nav>
                {links.map((link) => {
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center justify-between px-5 py-4 transition-all border-l-4 ${isActive
                                    ? "bg-green-50/50 text-green-600 border-green-600 font-bold"
                                    : "text-gray-500 border-transparent hover:bg-gray-50"
                                }`}
                        >
                            <div className="flex items-center gap-3 ">
                                <link.icon size={18} />
                                <span className="text-[15px]">{link.name}</span>
                            </div>
                            <ChevronRight size={14} className={isActive ? "text-green-600" : "text-gray-300"} />
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}