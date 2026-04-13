"use client"
import { useState, useEffect } from "react"
import { UpdateUserData, UpdateUserPassword } from "../../actions/userData.actions"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, Lock, Loader2, ShieldCheck, KeyRound, Eye, EyeOff } from "lucide-react"
import { ProfileSidebar } from "../_componant/Profile/Sidebar"
import { toast } from "sonner"

export default function SettingsPage() {
  const [profileLoading, setProfileLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [showPass, setShowPass] = useState({ current: false, new: false, re: false })

  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '' })
  const [passData, setPassData] = useState({ currentPassword: '', password: '', rePassword: '' })

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const savedUser = localStorage.getItem("userObject");
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setProfileData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || ''
          });
        }
      } catch (error) { console.error("Error loading user data:", error); }
    };
    fetchInitialData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    const res = await UpdateUserData(profileData);
    if (res.status === "success") {
      toast.success("Profile updated successfully");
      localStorage.setItem("userObject", JSON.stringify(res.data));
    } else { toast.error(res.message || "Update failed"); }
    setProfileLoading(false);
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.password !== passData.rePassword) return toast.error("New passwords do not match");
    setPassLoading(true);
    const res = await UpdateUserPassword(passData);
    if (res.status === "success") {
      toast.success("Password changed successfully");
      setPassData({ currentPassword: '', password: '', rePassword: '' });
    } else { toast.error(res.message || "Failed to change password"); }
    setPassLoading(false);
  }

  // ستايلات الـ Full Width
  const labelStyle = "block text-sm font-bold text-gray-700 mb-2 ml-1";
  const inputWrapper = "relative group w-full"; // w-full لضمان الامتداد
  const iconStyle = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#19b04b] transition-colors";
  const inputStyle = "w-full pl-12 pr-4 h-13 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:border-[#19b04b] focus:ring-4 focus:ring-green-50 outline-none transition-all text-gray-700 font-medium placeholder:text-gray-400";

  return (
    <div className="min-h-screen bg-[#f8f9fa] w-full pb-20">
      <div className="bg-[#19b04b] pt-12 pb-32 w-full">
        <div className="container mx-auto px-6 md:px-16 text-white">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="opacity-90 text-sm mt-2">Manage your profile and security settings</p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-16 -mt-16">
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 lg:col-span-3">
            <ProfileSidebar />
          </div>

          <div className="col-span-12 lg:col-span-9 space-y-6">

            {/* 1. Profile Information - ممتد للآخر */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-green-50 text-[#19b04b] rounded-xl flex items-center justify-center">
                  <User size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-5 w-full">
                <div>
                  <label className={labelStyle}>Full Name</label>
                  <div className={inputWrapper}>
                    <User className={iconStyle} size={18} />
                    <input required value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className={inputStyle} placeholder="Your full name" />
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Email Address</label>
                  <div className={inputWrapper}>
                    <Mail className={iconStyle} size={18} />
                    <input required type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className={inputStyle} placeholder="mail@example.com" />
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Phone Number</label>
                  <div className={inputWrapper}>
                    <Phone className={iconStyle} size={18} />
                    <input required value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} className={inputStyle} placeholder="01xxxxxxxxx" />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button disabled={profileLoading} className="bg-[#19b04b] hover:bg-[#15963f] text-white rounded-xl px-12 h-12 font-bold shadow-lg shadow-green-600/10 transition-all active:scale-95">
                    {profileLoading ? <Loader2 className="animate-spin" /> : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>

            {/* 2. Change Password - ممتد للآخر */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                  <KeyRound size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Security & Password</h2>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-5 w-full">
                <div>
                  <label className={labelStyle}>Current Password</label>
                  <div className={inputWrapper}>
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                    <input type={showPass.current ? "text" : "password"} required value={passData.currentPassword} onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })} className={`${inputStyle} focus:border-orange-400 focus:ring-orange-50`} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPass({ ...showPass, current: !showPass.current })} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500">
                      {showPass.current ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>New Password</label>
                  <div className={inputWrapper}>
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                    <input type={showPass.new ? "text" : "password"} required value={passData.password} onChange={(e) => setPassData({ ...passData, password: e.target.value })} className={`${inputStyle} focus:border-orange-400 focus:ring-orange-50`} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPass({ ...showPass, new: !showPass.new })} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500">
                      {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Confirm New Password</label>
                  <div className={inputWrapper}>
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                    <input type={showPass.re ? "text" : "password"} required value={passData.rePassword} onChange={(e) => setPassData({ ...passData, rePassword: e.target.value })} className={`${inputStyle} focus:border-orange-400 focus:ring-orange-50`} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPass({ ...showPass, re: !showPass.re })} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500">
                      {showPass.re ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button disabled={passLoading} className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-12 h-12 font-bold shadow-lg shadow-orange-600/20 transition-all active:scale-95">
                    {passLoading ? <Loader2 className="animate-spin" /> : "Update Password"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}