"use client"
import { useEffect, useState } from "react";
import { GetUserOrders } from "@/actions/order.actions";
import { toast } from "sonner";
import { ChevronDown, MapPin, CalendarDays, Eye, Box, CheckCircle2, Clock, Truck, Package, Home, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // State للتحكم في أي أوردر معروض تفاصيله حالياً
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const data = await GetUserOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const toggleDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusBadge = (isPaid: boolean, isDelivered: boolean) => {
    if (isDelivered) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          <Truck size={14} /> On the way
        </div>
      );
    } else if (isPaid) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
          <CheckCircle2 size={14} /> Paid
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
          <Clock size={14} /> Processing
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-400">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19b04b]"></div>
        <p className="font-bold text-xl">Fetching your orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#19b04b] flex items-center gap-1.5 transition-colors">
            <Home size={16} /> Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">My Orders</span>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center sticky top-8">
              <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="text-[#19b04b]" size={32} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
              <p className="text-sm text-gray-500 mt-2">Track and manage your {orders.length} orders.</p>
              <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-sm text-[#19b04b] font-bold hover:underline">
                Continue Shopping <ChevronDown size={16} className="-rotate-90" />
              </Link>
            </div>
          </div>

          {/* Orders List */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white p-20 rounded-3xl text-center shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">No orders found</h3>
                <Link href="/" className="mt-4 inline-block bg-[#19b04b] text-white px-8 py-3 rounded-xl font-bold">Shop Now</Link>
              </div>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => (
                  <div key={order._id} className={`bg-white rounded-3xl border transition-all overflow-hidden ${expandedOrderId === order._id ? 'border-[#19b04b] shadow-lg shadow-green-100/20' : 'border-gray-100 shadow-sm'}`}>

                    {/* Main Card Header */}
                    <div className="p-6 relative">
                      <div className="absolute top-0 right-10">
                        <div className="bg-white p-2 rounded-b-xl shadow-sm border border-t-0 border-gray-100 text-gray-400">
                          <Box size={20} />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
                        {/* Image & Status */}
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-20 h-20 rounded-2xl border border-gray-100 overflow-hidden bg-gray-50">
                              <Image src={order.cartItems[0]?.product.imageCover} alt="p" fill className="object-cover" unoptimized />
                            </div>
                            {order.cartItems.length > 1 && (
                              <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-bold w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                                +{order.cartItems.length - 1}
                              </div>
                            )}
                          </div>
                          <div>
                            {getStatusBadge(order.isPaid, order.isDelivered)}
                            <p className="text-sm font-bold text-gray-900 mt-2"># {order.id}</p>
                          </div>
                        </div>

                        {/* Order Stats */}
                        <div className="flex-grow grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
                          <div className="space-y-1">
                            <p className="text-xs text-gray-400 font-medium">Date</p>
                            <p className="font-bold text-gray-700 flex items-center gap-1.5">
                              <CalendarDays size={14} className="text-gray-300" />
                              {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-400 font-medium">Quantity</p>
                            <p className="font-bold text-gray-700">{order.cartItems.reduce((acc: any, i: any) => acc + i.count, 0)} items</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-400 font-medium">Location</p>
                            <p className="font-bold text-gray-700 flex items-center gap-1.5 capitalize">
                              <MapPin size={14} className="text-gray-300" />
                              {order.shippingAddress.city}
                            </p>
                          </div>
                        </div>

                        {/* Price & Toggle */}
                        <div className="text-right space-y-3 min-w-[140px]">
                          <p className="text-2xl font-black text-gray-900">
                            {order.totalOrderPrice.toLocaleString()} <span className="text-xs font-normal text-gray-400">EGP</span>
                          </p>
                          <button
                            onClick={() => toggleDetails(order._id)}
                            className={`w-full py-2.5 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${expandedOrderId === order._id ? 'bg-[#19b04b] text-white border-[#19b04b]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          >
                            {expandedOrderId === order._id ? 'Hide' : 'Details'}
                            <ChevronDown size={16} className={`transition-transform duration-300 ${expandedOrderId === order._id ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Details Section */}
                    {expandedOrderId === order._id && (
                      <div className="border-t border-gray-50 bg-[#fdfdfd] p-8 space-y-8 animate-in slide-in-from-top-4 duration-300">
                        {/* Order Items Table */}
                        <div>
                          <div className="flex items-center gap-2 mb-4 text-[#19b04b]">
                            <ShoppingBag size={18} />
                            <h3 className="text-sm font-bold uppercase tracking-widest">Order Items</h3>
                          </div>
                          <div className="space-y-3">
                            {order.cartItems.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-green-200 transition-colors">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-gray-50">
                                    <Image src={item.product.imageCover} alt="p" fill className="object-cover" unoptimized />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.product.title}</p>
                                    <p className="text-xs text-gray-400 font-medium">{item.count} × {item.price.toLocaleString()} EGP</p>
                                  </div>
                                </div>
                                <p className="text-sm font-bold text-gray-900">{(item.count * item.price).toLocaleString()} EGP</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Address & Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                          {/* Delivery Address Card */}
                          <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-3">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                              <MapPin size={12} /> Delivery Address
                            </p>
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-gray-800">{order.shippingAddress.city}</p>
                              <p className="text-xs text-gray-500 leading-relaxed">{order.shippingAddress.details || "No details provided"}</p>
                              <p className="text-xs font-medium text-[#19b04b] pt-1">{order.shippingAddress.phone}</p>
                            </div>
                          </div>

                          {/* Order Summary Card */}
                          <div className="bg-amber-50/40 p-6 rounded-3xl border border-amber-100/50">
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-4">Order Summary</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-medium">{(order.totalOrderPrice - (order.shippingPrice || 0)).toLocaleString()} EGP</span>
                              </div>
                              <div className="flex justify-between text-gray-500">
                                <span>Shipping Tax</span>
                                <span className="font-medium">{(order.shippingPrice || 0).toLocaleString()} EGP</span>
                              </div>
                              <div className="flex justify-between items-center pt-4 border-t border-amber-200 mt-2">
                                <span className="font-bold text-gray-900 text-base">Total</span>
                                <span className="font-black text-[#19b04b] text-xl">{order.totalOrderPrice.toLocaleString()} EGP</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}