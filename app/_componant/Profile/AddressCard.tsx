import { MapPin, Phone, Building, Edit3, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// ضفنا onEdit هنا
export const AddressCard = ({ address, onDelete, onEdit }: { address: any, onDelete: any, onEdit: any }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between group hover:shadow-md transition-all">
            <div className="flex items-start gap-5 w-full">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                    <MapPin size={22} />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{address.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{address.details}</p>
                    <div className="flex flex-wrap items-center gap-6 mt-4">
                        <div className="flex items-center text-sm text-gray-600 font-medium">
                            <Phone size={14} className="mr-2 text-gray-400" /> {address.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 font-medium">
                            <Building size={14} className="mr-2 text-gray-400" /> {address.city}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-4 md:mt-0">
                {/* ربطنا زرار الـ Edit بالدالة اللي بعتناها */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onEdit} // لما يدوس هنا المودال هيفتح
                    className="h-9 w-9 bg-gray-50 text-gray-500 hover:text-blue-600 rounded-lg transition-colors"
                >
                    <Edit3 size={16} />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors"
                    onClick={() => onDelete(address._id)}
                >
                    <Trash2 size={16} />
                </Button>
            </div>
        </div>
    )
}