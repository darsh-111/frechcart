"use client";

import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { StarIcon, TruckIcon, ShieldCheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";5
import { onSubmit } from "@/actions/auth.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RegisterSchema } from "@/schema/schema";

// 1. الـ Schema لازم تكون بره الكومبوننت أو فوقه




export default function RegisterPage() {
  const router = useRouter()
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
  });
  const MyonSubmit = async (values: z.infer<typeof RegisterSchema>) => {

    const isuserregistersuccesfully = await onSubmit(values);
    if (isuserregistersuccesfully) {
      toast.success("you are register successfully", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "green",
          color: "white"
        }
      })
      setTimeout(() => {
        router.push("/login")

      }, 3000);
    }
    else {
      toast.error("thier is error...", {
        position: "top-right",
        description: 5000,
        style: {
          background: "red",
          color: "white"
        }
      })
    }
  }
  
  const features = [
    { icon: <StarIcon className="h-6 w-6 text-white" />, title: "Premium Quality", bgColor: "bg-[#79BD9A]", description: "Premium quality products." },
    { icon: <TruckIcon className="h-6 w-6 text-white" />, title: "Fast Delivery", bgColor: "bg-[#79BD9A]", description: "Same-day delivery." },
    { icon: <ShieldCheckIcon className="h-6 w-6 text-white" />, title: "Secure Shopping", bgColor: "bg-[#79BD9A]", description: "Safe and secure payments." },
  ];

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc]  flex-col lg:flex-row ">

      {/* 🟢 الجزء الأيسر (Welcome & Features) */}
      <div className="w-full lg:w-1/2  flex flex-col justify-center border-r bg-white px-20">
        <div className="mb-12">
         
          <h1 className="text-4xl font-bold mb-4 text-[#111827]">
            Welcome to <span className="text-[#198754]">FreshCart</span>
          </h1>
          <p className="text-black text-lg max-w-lg">
            Join thousands of happy customers who enjoy fresh groceries
delivered right to their doorstep.          </p>
        </div>
        

        <div className="space-y-10">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${feature.bgColor} shadow-md flex-shrink-0`}>
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#111827]">{feature.title}</h3>
                <p className="text-[#6b7280]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-6 bg-[#f8fafc] rounded-2xl border border-gray-100 max-w-sm shadow-sm relative">

          {/* رأس الكارت (الصورة + الاسم + النجوم) */}
          <div className="flex items-center gap-4 mb-5">
            <Image
              src="/public/7be87acff8878d0ff905ef9dcd5bf7d2fd7a6c6f.png" // الصورة الحقيقية من FreshCart
              alt="Sarah Johnson"
              width={65} // الحجم زي الصورة
              height={65}
              className="rounded-full object-cover shadow-inner"
            />

            <div>
              <h4 className="font-semibold text-gray-800 text-base">Sarah Johnson</h4>
              {/* النجوم الصفراء */}
              <div className="flex text-[#FFC107] mt-1 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
          </div>

          {/* نص الشهادة (Testimonial Text) */}
          <p className="text-gray-600 leading-relaxed text-sm italic relative">
            <span className="text-5xl text-gray-200 absolute -top-4 -left-3 font-serif">“</span>
            FreshCart has transformed my shopping experience. The quality of the products is outstanding, and the delivery is always on time. Highly recommend!
          </p>
        </div>
      </div>

      {/* 🟢 الجزء الأيمن (Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#f8fafc]">
        <div className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-xl border">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-[#111827] mb-2">Create Your Account</h2>
            <p className="text-[#6b7280]">Start your fresh journey with us today</p>
          </div>
          {/* 🟢 أزرار التسجيل عبر السوشيال ميديا */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button
              variant="outline"
              className="w-full h-11 flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50 font-medium transition-all"
              type="button"
            >
              {/* أيقونة جوجل (ممكن تستخدم صورة صغيرة أو SVG) */}
              <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
              <span className="text-gray-700">Google</span>
            </Button>

            <Button
              variant="outline"
              className="w-full h-11 flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50 font-medium transition-all"
              type="button"
            >
              {/* أيقونة فيسبوك */}
              <img src="https://www.svgrepo.com/show/448224/facebook.svg" alt="Facebook" className="w-5 h-5" />
              <span className="text-gray-700">Facebook</span>
            </Button>
          </div>

          {/* 🟢 الفاصل (Or) */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <div className="relative flex justify-center text-sm uppercase">
              <span className="bg-white px-4 text-gray-400 font-medium">or</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(MyonSubmit)} className="space-y-5">

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name*</FormLabel>
                    <FormControl><Input placeholder="Enter your Name" className="h-11"
                      autoComplete="name" // الضبط هنا
                      {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl><Input placeholder="name@example.com" className="h-11"
                      autoComplete="Email" // الضبط هنا
                      {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    
                    <FormItem>
                      <FormLabel>Password*</FormLabel>
                      <FormControl><Input type="password" placeholder="Enter your Password..." className="h-11"
                        autoComplete="new-password" // الضبط هنا
                        {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rePassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password*</FormLabel>
                      <FormControl><Input type="password" placeholder="Confirm your Password..." className="h-11"
                        autoComplete="new-password" // الضبط هنا  
                        {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number*</FormLabel>
                    <FormControl><Input placeholder="01012345678" className="h-11" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-2 text-sm text-gray-600 py-2">
                <input type="checkbox" required className="rounded border-gray-300 text-[#198754] focus:ring-[#198754]" />
                <span>I agree to the <Link href="#" className="text-[#198754] font-medium underline">Terms</Link></span>
              </div>

              <Button type="submit" className="w-full h-12 bg-[#198754] hover:bg-green-700 text-white font-bold rounded-lg transition-all">
                Create My Account
              </Button>

              <p className="text-center text-gray-600 mt-6 text-sm">
                Already have an account? <Link href="/login" className="text-[#198754] font-semibold hover:underline">Sign In</Link>
              </p>
            </form>
          </Form>
        </div>
      </div>

    </div> // قفلة الـ Container الأساسي
  );
}