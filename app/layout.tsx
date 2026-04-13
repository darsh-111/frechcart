// 🟢 شيلنا "use client" من هنا
import Navbar from "./_componant/Navbar/Navbar";
import TopNavbar from "./_componant/TopNavbar/TopNavbar";
import "./globals.css"
import Providers from "./_componant/Provider/Provider"; // الملف اللي عملناه فوق
import CartContextProvider from "@/Context/CartContext";
import WishlistContextProvider from "@/Context/wishlistContext";

export const metadata = {
  title: "FreshCart",
  description: "Your best grocery shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col" suppressHydrationWarning={true}>
        {/* 🟢 تغليف الموقع بالـ Providers هنا */}
        <Providers>
          <WishlistContextProvider>

          <CartContextProvider>

          <TopNavbar />
          <Navbar />
          <main className="grow">
            {children}
          </main>
          </CartContextProvider>
          </WishlistContextProvider>
        </Providers>
      </body>
    </html>
  );
}