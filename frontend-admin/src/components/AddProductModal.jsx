import React, { useState } from 'react';
import { X, UploadCloud, Plus, Trash2 } from 'lucide-react';

export default function AddProductModal({ isOpen, onClose, onAdd }) {
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  
  // Handle multiple sizes dynamically
  const [sizes, setSizes] = useState([{ size: 'M', countInStock: '' }]);
  
  // Handle multiple images
  const [images, setImages] = useState([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleBasicInfoChange = (e) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
  };

  const addSizeRow = () => {
    setSizes([...sizes, { size: '', countInStock: '' }]);
  };

  const removeSizeRow = (index) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create FormData for Multer backend
      const formData = new FormData();
      formData.append('name', basicInfo.name);
      formData.append('description', basicInfo.description);
      formData.append('price', basicInfo.price);
      formData.append('category', basicInfo.category);
      
      // Backend expects sizes as a JSON string
      const formattedSizes = sizes.map(s => ({
        size: s.size,
        countInStock: Number(s.countInStock)
      }));
      formData.append('sizes', JSON.stringify(formattedSizes));

      // Append all selected images
      images.forEach((img) => {
        formData.append('images', img);
      });

      await onAdd(formData);
      
      // Reset form on success
      setBasicInfo({ name: '', description: '', price: '', category: '' });
      setSizes([{ size: 'M', countInStock: '' }]);
      setImages([]);
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans text-white">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 shrink-0">
          <h2 className="text-lg font-semibold">Add New Product</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors p-1 rounded-md hover:bg-neutral-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="add-product-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Product Name</label>
                <input type="text" name="name" value={basicInfo.name} onChange={handleBasicInfoChange} required 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Description</label>
                <textarea name="description" value={basicInfo.description} onChange={handleBasicInfoChange} rows="3" required 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Price (₹)</label>
                <input type="number" name="price" value={basicInfo.price} onChange={handleBasicInfoChange} required min="0" step="1"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Category</label>
                <select name="category" value={basicInfo.category} onChange={handleBasicInfoChange} required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500 transition-all appearance-none"
                >
                  <option value="" disabled>Select category</option>
                  <option value="clothing">Clothing</option>
                  <option value="accessories">Accessories</option>
                  <option value="shoes">Shoes</option>
                </select>
              </div>
            </div>

            {/* Sizes & Inventory */}
            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-neutral-300">Sizes & Inventory</label>
                <button type="button" onClick={addSizeRow} className="text-xs flex items-center gap-1 text-neutral-400 hover:text-white">
                  <Plus className="w-3 h-3" /> Add Size
                </button>
              </div>
              
              <div className="space-y-3">
                {sizes.map((s, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input type="text" placeholder="Size (e.g. L)" value={s.size} onChange={(e) => handleSizeChange(index, 'size', e.target.value)} required
                      className="w-1/2 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500"
                    />
                    <input type="number" placeholder="Stock Qty" value={s.countInStock} onChange={(e) => handleSizeChange(index, 'countInStock', e.target.value)} required min="0"
                      className="w-1/2 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500"
                    />
                    {sizes.length > 1 && (
                      <button type="button" onClick={() => removeSizeRow(index)} className="text-red-500 hover:text-red-400 p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
               <label className="block text-sm font-medium text-neutral-300 mb-1.5">Product Images (Max 5)</label>
               <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-800 border-dashed rounded-lg hover:border-neutral-600 transition-colors bg-neutral-950 relative">
                 <input type="file" multiple accept="image/*" onChange={handleImageChange} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                 <div className="space-y-1 text-center pointer-events-none">
                   <UploadCloud className="mx-auto h-10 w-10 text-neutral-500" />
                   <p className="text-sm text-white font-medium">{images.length > 0 ? `${images.length} files selected` : 'Click or drag files here'}</p>
                   <p className="text-xs text-neutral-500">PNG, JPG up to 5MB</p>
                 </div>
               </div>
            </div>

          </form>
        </div>

        <div className="px-6 py-4 border-t border-neutral-800 flex justify-end gap-3 shrink-0 bg-neutral-950">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
            Cancel
          </button>
          <button type="submit" form="add-product-form" disabled={isSubmitting || images.length === 0} className="bg-white text-black px-6 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
}