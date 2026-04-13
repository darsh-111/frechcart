"use client"
import { useState, useEffect } from "react"
import { GetUserAddresses, RemoveAddress, AddAddress, UpdateAddress } from "@/actions/address.actions"
import { Button } from "@/components/ui/button"
import { Plus, User, MapPin, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { ProfileSidebar } from "../_componant/Profile/Sidebar"
import { AddressCard } from "../_componant/Profile/AddressCard"
import { toast } from "sonner"

export default function MyAddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // حالة لمتابعة إذا كنا نعدل عنواناً حالياً
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    details: '',
    phone: '',
    city: ''
  })

  // دالة لجلب البيانات من السيرفر بشكل آمن
  const loadAddresses = async () => {
    try {
      const res = await GetUserAddresses()
      if (res.status === "success") {
        setAddresses(Array.isArray(res.data) ? res.data : [])
      }
    } catch (error) {
      toast.error("Failed to load addresses")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAddresses()
  }, [])

  // فتح المودال للتعديل
  const handleEditClick = (address: any) => {
    setFormData({
      name: address.name,
      details: address.details,
      phone: address.phone,
      city: address.city
    })
    setEditingAddressId(address._id)
    setShowModal(true)
  }

  // إغلاق المودال وتصفير البيانات
  const handleCloseModal = () => {
    setShowModal(false)
    setEditingAddressId(null)
    setFormData({ name: '', details: '', phone: '', city: '' })
  }

  // الدالة الموحدة للإرسال
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = editingAddressId
        ? await UpdateAddress(editingAddressId, formData)
        : await AddAddress(formData)

      if (res.status === "success") {
        // أهم تعديل: جلب القائمة كاملة من جديد لضمان أنها Array
        await loadAddresses()
        handleCloseModal()
        toast.success(editingAddressId ? "Address updated" : "Address added")
      } else {
        toast.error(res.message || "Action failed")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    const original = [...addresses]
    setAddresses(prev => prev.filter(a => a._id !== id))
    try {
      const res = await RemoveAddress(id)
      if (res.status !== "success") {
        setAddresses(original)
        toast.error("Failed to delete")
      } else {
        toast.success("Address removed")
      }
    } catch (error) {
      setAddresses(original)
      toast.error("Connection error")
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] w-full pb-20 relative">
      <div className="bg-[#19b04b] pt-12 pb-32 w-full">
        <div className="container mx-auto px-6 md:px-16">
          <div className="text-white/80 text-sm mb-6 flex gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link> / <span>My Account</span>
          </div>
          <div className="flex items-center gap-5 text-white">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/10 flex items-center justify-center shadow-inner">
              <User size={35} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
              <p className="opacity-90 mt-1 font-medium">Manage your addresses and account settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-16 -mt-16">
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 lg:col-span-3">
            <ProfileSidebar />
          </div>

          <div className="col-span-12 lg:col-span-9">
            <div className="flex justify-between items-center mb-6 px-1">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">My Addresses</h2>
                <p className="text-gray-500 text-sm mt-1 font-medium">Manage your saved delivery addresses</p>
              </div>
              <Button
                onClick={() => setShowModal(true)}
                className="bg-green-900 hover:bg-green-700 text-white rounded-xl px-6 h-11 font-bold shadow-lg shadow-green-600/10 transition-all active:scale-95"
              >
                <Plus size={18} className="mr-2" /> Add Address
              </Button>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="h-40 bg-white rounded-2xl animate-pulse border border-gray-100 shadow-sm" />
              ) : !Array.isArray(addresses) || addresses.length === 0 ? (
                <div className="bg-white p-20 text-center rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-300 rounded-full flex items-center justify-center mb-6 text-white-900">
                    <MapPin size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">No Addresses Yet</h3>
                  <p className="text-gray-500 mt-2 max-w-sm font-medium leading-relaxed">
                    Add your first delivery address to make checkout faster and easier.
                  </p>
                  <Button
                    onClick={() => setShowModal(true)}
                    className="mt-8 bg-[#19b04b] hover:bg-[#15963f] text-white rounded-xl px-10 h-12 font-bold shadow-lg shadow-green-600/20 transition-all active:scale-95"
                  >
                    + Add Your First Address
                  </Button>
                </div>
              ) : (
                // حماية الـ Map بـ Array.isArray
                addresses.map((addr, index) => (
                  <AddressCard
                    key={addr._id || `addr-${index}`}
                    address={addr}
                    onDelete={handleDelete}
                    onEdit={() => handleEditClick(addr)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => !isSubmitting && handleCloseModal()} />
          <div className="relative bg-white w-full max-w-[500px] rounded-[1.8rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-7">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingAddressId ? "Edit Address" : "Add New Address"}
                </h2>
                <button disabled={isSubmitting} onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Address Name</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    type="text"
                    placeholder="e.g. Home, Office"
                    className="w-full px-4 h-12 rounded-xl border border-gray-200 outline-none focus:border-[#19b04b] focus:ring-1 focus:ring-[#19b04b] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Full Address</label>
                  <textarea
                    required
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder="Street, building, apartment..."
                    className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-[#19b04b] focus:ring-1 focus:ring-[#19b04b] transition-all min-h-[100px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                    <input
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      type="text"
                      className="w-full px-4 h-12 rounded-xl border border-gray-200 focus:border-[#19b04b] outline-none focus:ring-1 focus:ring-[#19b04b]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">City</label>
                    <input
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      type="text"
                      className="w-full px-4 h-12 rounded-xl border border-gray-200 focus:border-[#19b04b] outline-none focus:ring-1 focus:ring-[#19b04b]"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" disabled={isSubmitting} onClick={handleCloseModal} className="flex-1 h-12 rounded-xl font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-all">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 h-12 rounded-xl font-bold bg-[#19b04b] text-white hover:bg-[#15963f] shadow-lg shadow-green-600/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <><Loader2 className="animate-spin" size={18} /> Processing...</>
                    ) : (
                      editingAddressId ? "Update Address" : "Add Address"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}