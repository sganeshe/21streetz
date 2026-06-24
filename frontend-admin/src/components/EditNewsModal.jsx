import React, { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';

export default function EditNewsModal({ isOpen, onClose, onUpdate, article }) {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (article && isOpen) {
      setFormData({ title: article.title || '', content: article.content || '' });
    }
  }, [article, isOpen]);

  if (!isOpen || !article) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdate(article._id, formData);
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
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4 text-neutral-400" /> Edit News
          </h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white p-1 rounded-md hover:bg-neutral-800"><X className="w-5 h-5" /></button>
        </div>
        <form id="edit-news-form" onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Headline</label>
            <input type="text" value={formData.title} onChange={(e)=>setFormData({...formData, title: e.target.value})} required 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:border-neutral-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Content</label>
            <textarea value={formData.content} onChange={(e)=>setFormData({...formData, content: e.target.value})} required rows="6"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:border-neutral-500 outline-none resize-none" />
          </div>
        </form>
        <div className="px-6 py-4 border-t border-neutral-800 flex justify-end gap-3 bg-neutral-950 rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-neutral-400 hover:text-white">Cancel</button>
          <button type="submit" form="edit-news-form" disabled={isSubmitting} className="bg-white text-black px-6 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-200 disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}