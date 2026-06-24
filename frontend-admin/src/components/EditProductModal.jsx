import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Plus, Trash2 } from 'lucide-react';

export default function EditProductModal({ isOpen, onClose, onUpdate, product }) {
  const [basicInfo, setBasicInfo] = useState({
    name: '', description: '', price: '', category: ''
  });
  const [sizes, setSizes] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load product data into state when the modal opens
  useEffect(() => {
    if (product && isOpen) {
      setBasicInfo({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || ''
      });
      setSizes(product.sizes?.length > 0 ? product.sizes : [{ size: 'M', countInStock: '' }]);
      setExistingImages(product.images || []);
      setNewImages([]);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleBasicInfoChange = (e) => setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
  };
  const addSizeRow = () => setSizes([...sizes, { size: '', countInStock: '' }]);
  const removeSizeRow = (index) => setSizes(sizes.filter((_, i) => i !== index));

  const removeExistingImage = (indexToRemove) => {
    setExistingImages(existingImages.filter((_, index) => index !== indexToRemove));
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (existingImages.length + newImages.length + files.length > 5) {
      alert("You can only have up to 5 images total.");
      return;
    }
    setNewImages([...newImages, ...files]);
  };
  const removeNewImage = (indexToRemove) => {
    setNewImages(newImages.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('name', basicInfo.name);
      formData.append('description', basicInfo.description);
      formData.append('price', basicInfo.price);
      formData.append('category', basicInfo.category);
      
      const formattedSizes = sizes.map(s => ({ size: s.size, countInStock: Number(s.countInStock) }));
      formData.append('sizes', JSON.stringify(formattedSizes));

      // Append URLs of images we want to keep
      existingImages.forEach((imgUrl) => {
        formData.append('existingImages', imgUrl);
      });

      // Append actual files of new images
      newImages.forEach((file) => {
        formData.append('images', file);
      });

      await onUpdate(product._id, formData);
      onClose();
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans text-white">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 shrink-0">
          <div>
            <h2 className="text-lg font-semibold">Product Details</h2>
            <p className="text-xs text-neutral-400 font-mono mt-1">ID: {product._id}</p>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors p-1 rounded-md hover:bg-neutral-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-6">
            
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
                  <option value="clothing">Clothing</option>
                  <option value="accessories">Accessories</option>
                  <option value="shoes">Shoes</option>
                </select>
              </div>
            </div>

            {/* Detailed Size & Stock Breakdown */}
            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-neutral-300">Detailed Inventory</label>
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
                      <button type="button" onClick={() => removeSizeRow(index)} className="text-neutral-500 hover:text-red-400 p-2 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Manage Images */}
            <div>
               <label className="block text-sm font-medium text-neutral-300 mb-3">Manage Images</label>
               
               {/* Display Existing & New Images */}
               <div className="grid grid-cols-5 gap-3 mb-4">
                 {existingImages.map((imgUrl, index) => (
                   <div key={`old-${index}`} className="relative aspect-square rounded-lg border border-neutral-800 overflow-hidden bg-neutral-950 group">
                     <img src={imgUrl} alt="product" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                     <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1 right-1 bg-black/60 text-white rounded-md p-1 hover:bg-red-500 transition-colors">
                       <X className="w-3 h-3" />
                     </button>
                   </div>
                 ))}
                 {newImages.map((file, index) => (
                   <div key={`new-${index}`} className="relative aspect-square rounded-lg border border-neutral-700 overflow-hidden bg-neutral-800 flex items-center justify-center">
                     <span className="text-[10px] text-neutral-400 absolute bottom-1">New</span>
                     <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 bg-black/60 text-white rounded-md p-1 hover:bg-red-500 transition-colors">
                       <X className="w-3 h-3" />
                     </button>
                   </div>
                 ))}
               </div>

               {/* Upload Button */}
               {(existingImages.length + newImages.length) < 5 && (
                 <div className="relative flex justify-center px-6 py-4 border border-neutral-800 border-dashed rounded-lg hover:border-neutral-600 transition-colors bg-neutral-950">
                   <input type="file" multiple accept="image/*" onChange={handleNewImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                   <div className="flex items-center gap-2 text-sm text-neutral-400 pointer-events-none">
                     <UploadCloud className="w-5 h-5" />
                     <span>Upload more images</span>
                   </div>
                 </div>
               )}
            </div>

          </form>
        </div>

        <div className="px-6 py-4 border-t border-neutral-800 flex justify-end gap-3 shrink-0 bg-neutral-950">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
            Cancel
          </button>
          <button type="submit" form="edit-product-form" disabled={isSubmitting || (existingImages.length === 0 && newImages.length === 0)} className="bg-white text-black px-6 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-50">
            {isSubmitting ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}