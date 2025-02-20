import { useState } from "react";
import Modal from "./Modal";

interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (menuItem: { name: string; description: string; price: number; image: string }) => void;
}

export default function AddMenuItemModal({ isOpen, onClose, onSave }: AddMenuItemModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setSelectedFile(null);
    setPreviewImage(null);
    setStep(1);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    onSave({ name, description, price: Number(price), image: previewImage || "" });
    resetForm();
    onClose();
  };

  return (
    isOpen && (
      <Modal onClose={onClose}>
        <div className="p-4">
          <h2 className="text-black font-bold mb-4">Add New Menu Item</h2>

          {step === 1 && (
            <div>
              <label className="text-black block mb-2">Menu Item Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full text-black mb-4"
                placeholder="Enter name"
              />
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setStep(2)} disabled={!name}>
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="text-black block mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 w-full text-black mb-4"
                placeholder="Enter description"
              />
              <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded ml-2" onClick={() => setStep(3)} disabled={!description}>
                Next
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="text-black block mb-2">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="border p-2 w-full text-black mb-4"
                placeholder="Enter price"
              />
              <label className="text-black block mb-2">Upload Image</label>
              <input type="file" onChange={handleFileChange} className="mb-4" />
              {previewImage && <img src={previewImage} alt="Preview" className="h-24 w-24 object-cover rounded mb-4" />}
              <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded ml-2" onClick={handleSave} disabled={!price}>
                Save Menu Item
              </button>
            </div>
          )}
        </div>
      </Modal>
    )
  );
}
