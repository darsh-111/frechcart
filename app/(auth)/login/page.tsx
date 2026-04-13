"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Eye,
  Truck,
  ShieldCheck,
  Headphones,
  Lock,
  Users,
  Star,
  EyeOff
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React from "react";
import { loginSchema } from "@/schema/schema";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const MyonSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);

    // 🟢 استخدام NextAuth للـ Login
    const res = await signIn("credentials", {
      ...values,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Invalid email or password", {
        position: "top-right",
      });
      setIsLoading(false);
    } else {
      toast.success("Logged in successfully! Redirecting...", {
        position: "top-right",
      });

      // توجيه اليوزر وتحديث الصفحة عشان الهيدر يحس بالسيشن
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4 md:p-10">
      <div className="container max-w-6xl grid lg:grid-cols-2 gap-20 items-center">

        {/* Left Side: Illustration & Branding */}
        <div className="hidden lg:flex flex-col items-center text-center">
          <img
            src="https://freshcart.codescandy.com/assets/images/svg-graphics/signin-g.svg"
            alt="Sign In Illustration"
            className="w-full max-w-md mb-8"
          />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            FreshCart - Your One-Stop Shop for Fresh Products
          </h2>
          <p className="text-gray-500 text-lg mb-8 max-w-md">
            Join thousands of happy customers who trust FreshCart for their daily grocery needs.
          </p>

          <div className="flex gap-8 text-sm text-gray-500 font-medium">
            <span className="flex items-center gap-2"><Truck className="w-5 h-5 text-[#198754]" /> Free Delivery</span>
            <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#198754]" /> Secure Payment</span>
            <span className="flex items-center gap-2"><Headphones className="w-5 h-5 text-[#198754]" /> 24/7 Support</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full max-w-md mx-auto shadow-2xl p-15 rounded-3xl ">
          <div className="mb-8">
            <div className="flex justify-center mb-10 text-4xl font-bold">
              Fresh<span className="text-[#198754] ml-2">Cart</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Welcome Back!</h1>
            <p className="text-gray-500 text-center text-sm">Sign in to continue your shopping</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(MyonSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" className="h-11 focus:ring-[#198754]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-sm font-semibold text-gray-700">Password</FormLabel>
                      <Link href="#" className="text-xs text-[#198754] font-semibold hover:underline">Forgot Password?</Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="h-11 focus:ring-[#198754]"
                          {...field}
                        />
                        <div
                          className="absolute right-3 top-3.5 cursor-pointer text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#198754] hover:bg-[#157347] text-white font-bold rounded-lg transition-all"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <p className="text-center text-sm text-gray-500 mt-4">
                New to FreshCart? <Link href="/register" className="text-[#198754] font-bold hover:underline">Create an account</Link>
              </p>
            </form>
          </Form>

          {/* Trust Indicators */}
          <div className="mt-10 flex justify-center items-center gap-6 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
            <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> SSL Secured</span>
            <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> 50K+ Users</span>
            <span className="flex items-center gap-1.5"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 4.9 Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
}