import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

export default function BroadcastModal({ isOpen, onClose, onSend }) {
  const [formData, setFormData] = useState({ subject: '', body: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSend(formData);
      setFormData({ subject: '', body: '' });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans text-white">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Send className="w-4 h-4 text-neutral-400" /> Send Broadcast Campaign
          </h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white p-1 rounded-md hover:bg-neutral-800"><X className="w-5 h-5" /></button>
        </div>

        <form id="broadcast-form" onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Email Subject</label>
            <input type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required 
              placeholder="e.g. Early Access to the Winter Collection!"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Email Body</label>
            <textarea value={formData.body} onChange={(e) => setFormData({...formData, body: e.target.value})} required rows="8"
              placeholder="Write your email content here..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500 resize-none" 
            />
          </div>
        </form>

        <div className="px-6 py-4 border-t border-neutral-800 flex justify-end gap-3 bg-neutral-950 rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-neutral-400 hover:text-white">Cancel</button>
          <button type="submit" form="broadcast-form" disabled={isSubmitting} className="bg-white text-black px-6 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-200 disabled:opacity-50">
            {isSubmitting ? 'Sending...' : 'Send to All Active Subscribers'}
          </button>
        </div>
      </div>
    </div>
  );
}