import React, { useState } from 'react';
import { X, Tag } from 'lucide-react';

export default function AddCouponModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    maxDiscountAmount: '',
    expiryDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      // Force code to be uppercase without spaces
      [name]: name === 'code' ? value.toUpperCase().replace(/\s/g, '') : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        code: formData.code,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        expiryDate: formData.expiryDate,
        ...(formData.discountType === 'PERCENTAGE' && formData.maxDiscountAmount 
            ? { maxDiscountAmount: Number(formData.maxDiscountAmount) } 
            : {})
      };
      
      await onAdd(payload);
      setFormData({ code: '', discountType: 'PERCENTAGE', discountValue: '', maxDiscountAmount: '', expiryDate: '' });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans text-white">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Tag className="w-4 h-4 text-neutral-400" /> Add Coupon
          </h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors p-1 rounded-md hover:bg-neutral-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form id="add-coupon-form" onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Coupon Code</label>
            <input type="text" name="code" value={formData.code} onChange={handleChange} required placeholder="e.g. SUMMER50"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500 uppercase transition-all placeholder-neutral-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">Type</label>
              <select name="discountType" value={formData.discountType} onChange={handleChange} required
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500 appearance-none"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                Value {formData.discountType === 'PERCENTAGE' ? '(%)' : '(₹)'}
              </label>
              <input type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} required min="1" max={formData.discountType === 'PERCENTAGE' ? "100" : undefined}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500"
              />
            </div>
          </div>

          {formData.discountType === 'PERCENTAGE' && (
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">Max Discount Amount (₹) <span className="text-neutral-500 text-xs font-normal">(Optional)</span></label>
              <input type="number" name="maxDiscountAmount" value={formData.maxDiscountAmount} onChange={handleChange} min="1" placeholder="Leave blank for no limit"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500 placeholder-neutral-600"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Expiry Date</label>
            <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required min={new Date().toISOString().split('T')[0]}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500 [color-scheme:dark]"
            />
          </div>
        </form>

        <div className="px-6 py-4 border-t border-neutral-800 flex justify-end gap-3 bg-neutral-950">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
            Cancel
          </button>
          <button type="submit" form="add-coupon-form" disabled={isSubmitting} className="bg-white text-black px-6 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Create Coupon'}
          </button>
        </div>
      </div>
    </div>
  );
}