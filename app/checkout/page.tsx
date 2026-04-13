"use client"
import { useState, useEffect } from "react"
import { useCart } from "@/Context/CartContext"
import { CheckoutOrder } from "@/actions/checkout.actions"
import { GetUserAddresses } from "@/actions/address.actions"
import { toast } from "sonner"
import {
  MapPin, Building2, Phone, BriefcaseBusiness, Package,
  CreditCard, Box, CheckCircle2, ChevronLeft, Loader2
} from "lucide-react"
import Image from "next/image"

export default function CheckoutPage() {
  const { cartId, cartItems, cartTotal, setCartCount } = useCart();
  const [loading, setLoading] = useState(false);
  const [fetchingAddresses, setFetchingAddresses] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');

  // بيانات الشحن
  const [address, setAddress] = useState({ details: "", phone: "", city: "" });

  // العناوين المسجلة
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // جلب العناوين عند التحميل
  useEffect(() => {
    async function fetchAddresses() {
      try {
        setFetchingAddresses(true);
        const res = await GetUserAddresses();
        if (res?.status === "success") {
          setSavedAddresses(res.data);
          if (res.data.length > 0) {
            handleSelectAddress(res.data[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setFetchingAddresses(false);
      }
    }
    fetchAddresses();
  }, []);

  const handleSelectAddress = (addr: any) => {
    setSelectedAddressId(addr._id);
    setAddress({
      city: addr.city || "",
      details: addr.details || "",
      phone: addr.phone || ""
    });
  };

  const handleUseNewAddress = () => {
    setSelectedAddressId(null);
    setAddress({ details: "", phone: "", city: "" });
  };

  // الدالة المعدلة للدفع
  const handleCheckout = async () => {
    // 1. التأكد من وجود بيانات الشحن
    if (!address.details || !address.phone || !address.city) {
      return toast.error("Please fill in all shipping details first");
    }

    setLoading(true);
    try {
      // 2. مناداة الأكشن (كاش أو أونلاين)
      const res = await CheckoutOrder(cartId, paymentMethod, address);

      if (res.status === "success") {
        if (paymentMethod === 'cash') {
          // --- حالة الدفع كاش ---
          toast.success("Order placed successfully!");
          setCartCount(0); // تصفير السلة
          window.location.href = "/allorders"; // تحويل لصفحة الطلبات
        } else {
          // --- حالة الدفع أونلاين (Stripe) ---
          if (res.session?.url) {
            toast.info("Redirecting to Stripe...");
            // تحويل المستخدم لرابط Stripe الرسمي
            window.location.href = res.session.url;
          } else {
            toast.error("Stripe session URL not found");
          }
        }
      } else {
        toast.error(res.message || "Failed to process order");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = "w-full pl-11 pr-4 h-12 py-2 rounded-xl border border-gray-200 bg-white focus:border-[#19b04b] focus:ring-2 focus:ring-green-50 outline-none transition-all text-gray-700";
  const labelStyle = "block text-sm font-semibold text-gray-700 mb-2.5";

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-2xl text-[#19b04b]">
              <BriefcaseBusiness size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
              <p className="text-sm text-gray-500">Secure your order</p>
            </div>
          </div>
          <a href="/cart" className="flex items-center gap-2 text-gray-500 hover:text-[#19b04b] text-sm">
            <ChevronLeft size={18} /> Back to Cart
          </a>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#19b04b] px-8 py-5 text-white flex items-center gap-3">
                <MapPin size={22} />
                <h2 className="text-lg font-bold">Shipping Address</h2>
              </div>
              <div className="p-8">
                {fetchingAddresses ? (
                  <div className="flex justify-center p-6"><Loader2 className="animate-spin text-[#19b04b]" /></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => handleSelectAddress(addr)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer relative ${selectedAddressId === addr._id ? 'border-[#19b04b] bg-green-50' : 'border-gray-100'}`}
                      >
                        <h4 className="font-bold capitalize">{addr.name}</h4>
                        <p className="text-sm text-gray-500">{addr.city}</p>
                        {selectedAddressId === addr._id && <CheckCircle2 className="absolute top-4 right-4 text-[#19b04b]" size={20} />}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleUseNewAddress}
                  className={`w-full py-4 rounded-xl border-2 border-dashed mb-8 ${selectedAddressId === null ? 'border-[#19b04b] text-[#19b04b] bg-green-50' : 'border-gray-200 text-gray-400'}`}
                >
                  + Use New Address
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                  <div className="relative">
                    <label className={labelStyle}>City</label>
                    <Building2 className="absolute left-4 top-[46px] -translate-y-1/2 text-gray-400" size={18} />
                    <input value={address.city} className={inputStyle} onChange={(e) => { setSelectedAddressId(null); setAddress({ ...address, city: e.target.value }) }} />
                  </div>
                  <div className="relative">
                    <label className={labelStyle}>Phone</label>
                    <Phone className="absolute left-4 top-[46px] -translate-y-1/2 text-gray-400" size={18} />
                    <input value={address.phone} className={inputStyle} onChange={(e) => { setSelectedAddressId(null); setAddress({ ...address, phone: e.target.value }) }} />
                  </div>
                  <div className="col-span-full relative">
                    <label className={labelStyle}>Details (Street/Building)</label>
                    <MapPin className="absolute left-4 top-[46px] -translate-y-1/2 text-gray-400" size={18} />
                    <input value={address.details} className={inputStyle} onChange={(e) => { setSelectedAddressId(null); setAddress({ ...address, details: e.target.value }) }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#19b04b] px-8 py-5 text-white flex items-center gap-3">
                <CreditCard size={22} />
                <h2 className="text-lg font-bold">Payment Method</h2>
              </div>
              <div className="p-8 space-y-4">
                <div onClick={() => setPaymentMethod('cash')} className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-[#19b04b] bg-green-50 shadow-sm' : 'border-gray-100'}`}>
                  <Box className={paymentMethod === 'cash' ? 'text-[#19b04b]' : 'text-gray-400'} size={24} />
                  <div className="grow"><h4 className="font-bold">Cash on Delivery</h4><p className="text-xs text-gray-500">Pay when you receive your items</p></div>
                  <CheckCircle2 size={24} className={paymentMethod === 'cash' ? 'text-[#19b04b]' : 'text-gray-100'} />
                </div>
                <div onClick={() => setPaymentMethod('online')} className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-[#19b04b] bg-green-50 shadow-sm' : 'border-gray-100'}`}>
                  <CreditCard className={paymentMethod === 'online' ? 'text-[#19b04b]' : 'text-gray-400'} size={24} />
                  <div className="grow"><h4 className="font-bold">Pay Online (Card)</h4><p className="text-xs text-gray-500">Secure payment via Stripe</p></div>
                  <CheckCircle2 size={24} className={paymentMethod === 'online' ? 'text-[#19b04b]' : 'text-gray-100'} />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 self-start sticky top-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800"><Package className="text-[#19b04b]" size={22} /> Order Summary</h2>
              <div className="space-y-4 max-h-[250px] overflow-y-auto mb-6 pr-2">
                {cartItems?.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 items-center bg-gray-50 p-2 rounded-xl">
                    <Image src={item.product?.imageCover} alt="p" width={50} height={50} className="rounded-lg object-cover" unoptimized />
                    <div className="grow"><p className="text-xs font-bold line-clamp-1">{item.product?.title}</p><p className="text-xs text-[#19b04b]">{item.count} x {item.price} EGP</p></div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-5">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-medium">Total Amount</span>
                  <span className="text-2xl font-bold text-[#19b04b]">{cartTotal} EGP</span>
                </div>
                <button
                  disabled={loading}
                  onClick={handleCheckout}
                  className="w-full bg-[#19b04b] text-white h-14 rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-[#15963f] hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : (paymentMethod === 'online' ? 'Proceed to Payment' : 'Complete Order')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}