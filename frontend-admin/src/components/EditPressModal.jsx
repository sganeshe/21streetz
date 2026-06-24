import React, { useState, useEffect } from 'react';
import { X, ExternalLink, UploadCloud } from 'lucide-react';

export default function EditPressModal({ isOpen, onClose, onUpdate, pressItem }) {
  const [headline, setHeadline] = useState('');
  const [redirectLink, setRedirectLink] = useState('');
  const [image, setImage] = useState(null); // New file
  const [imagePreview, setImagePreview] = useState(''); // Existing URL or New Preview
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pressItem && isOpen) {
      setHeadline(pressItem.headline || '');
      setRedirectLink(pressItem.redirectLink || '');
      setImagePreview(pressItem.image || '');
      setImage(null);
    }
  }, [pressItem, isOpen]);

  if (!isOpen || !pressItem) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('headline', headline);
      formData.append('redirectLink', redirectLink);
      if (image) formData.append('image', image); // Only append if they uploaded a new one

      await onUpdate(pressItem._id, formData); 
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans text-white">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h2 className="text-lg font-semibold flex items-center gap-2"><ExternalLink className="w-4 h-4 text-neutral-400" /> Edit Press Feature</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white p-1 rounded-md hover:bg-neutral-800"><X className="w-5 h-5" /></button>
        </div>

        <form id="edit-press-form" onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Headline</label>
            <input type="text" value={headline} onChange={(e)=>setHeadline(e.target.value)} required 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Redirect URL</label>
            <input type="url" value={redirectLink} onChange={(e)=>setRedirectLink(e.target.value)} required 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Press Image</label>
            {imagePreview ? (
              <div className="relative w-full h-32 rounded-lg border border-neutral-800 overflow-hidden group">
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <label className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer">
                    Change Image
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>
            ) : (
              <input type="file" accept="image/*" onChange={handleImageChange} required className="w-full" />
            )}
          </div>
        </form>

        <div className="px-6 py-4 border-t border-neutral-800 flex justify-end gap-3 bg-neutral-950 rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-neutral-400 hover:text-white">Cancel</button>
          <button type="submit" form="edit-press-form" disabled={isSubmitting} className="bg-white text-black px-6 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-200 disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}