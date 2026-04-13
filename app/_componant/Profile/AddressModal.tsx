"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddressModal = ({ isOpen, onClose }: AddressModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Background Overlay - الطبقة الشفافة اللي ورا */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Box - الصندوق نفسه */}
            <div className="relative bg-white w-full max-w-[500px] rounded-[1.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-2">
                    <h2 className="text-xl font-bold text-gray-900">Add New Address</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <form className="p-6 pt-2 space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Address Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Home, Office"
                            className="w-full px-4 h-12 rounded-xl border border-gray-200 outline-none focus:border-[#19b04b] focus:ring-1 focus:ring-[#19b04b] transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Full Address</label>
                        <textarea
                            placeholder="Street, building, apartment..."
                            className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-[#19b04b] focus:ring-1 focus:ring-[#19b04b] transition-all min-h-[100px] resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Phone Number</label>
                            <input
                                type="text"
                                placeholder="01xxxxxxxxx"
                                className="w-full px-4 h-12 rounded-xl border border-gray-200 outline-none focus:border-[#19b04b] focus:ring-1 focus:ring-[#19b04b] transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">City</label>
                            <input
                                type="text"
                                placeholder="Cairo"
                                className="w-full px-4 h-12 rounded-xl border border-gray-200 outline-none focus:border-[#19b04b] focus:ring-1 focus:ring-[#19b04b] transition-all"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 h-12 rounded-xl font-bold bg-[#19b04b] text-white hover:bg-[#15963f] shadow-lg shadow-green-600/20 transition-all active:scale-95"
                        >
                            Add Address
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}