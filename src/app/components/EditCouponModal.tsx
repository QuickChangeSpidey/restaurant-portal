// EditCouponQuantityModal.tsx
import { use, useEffect, useState } from "react";
import { Coupon } from "./QRCodeModal";

interface EditCouponQuantityModalProps {
    isOpen: boolean;
    onClose: () => void;
    coupon: Coupon | null;
    onSave: (updatedCoupon: Coupon) => Promise<void>;
}

const EditCouponQuantityModal = ({
    isOpen,
    onClose,
    coupon,
    onSave,
}: EditCouponQuantityModalProps) => {

    useEffect(() => { setQuantity(coupon?.quantity || 0); }
        , [coupon]);
    const [quantity, setQuantity] = useState(coupon?.quantity || 0);
    if (!isOpen || !coupon) return null;
    const handleSave = () => {
        const updatedCoupon = { ...coupon, quantity };
        onSave(updatedCoupon);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-xl font-semibold mb-4">Edit Coupon Quantity</h3>

                <div className="mb-4">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCouponQuantityModal;
