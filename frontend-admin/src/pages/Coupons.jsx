import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Loader2, Tag } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { couponService } from '../services/coupon.service';
import AddCouponModal from '../components/AddCouponModal';

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const data = await couponService.getAll();
      setCoupons(data.coupons || data || []);
    } catch (error) {
      showToast("Failed to load coupons", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddCoupon = async (couponData) => {
    try {
      await couponService.add(couponData);
      showToast("Coupon created successfully", "success");
      fetchCoupons();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to create coupon", "error");
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await couponService.delete(id);
      showToast("Coupon deleted", "success");
      fetchCoupons();
    } catch (error) {
      showToast("Failed to delete coupon", "error");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Coupons</h1>
          <p className="text-sm text-neutral-400 mt-1">Manage promotional codes and discounts</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-neutral-200 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Coupon
        </button>
      </div>
      

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm min-h-[300px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
             <Loader2 className="w-8 h-8 animate-spin mb-4" />
             <p className="text-sm">Fetching coupons...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
            <Tag className="w-8 h-8 text-neutral-600 mb-3" />
            <p className="text-sm">No coupons found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-400">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-300">
                <tr>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Code</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Discount</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Expires On</th>
                  <th className="px-6 py-4 font-medium text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {coupons.map((coupon) => {
                  const isExpired = new Date(coupon.expiryDate) < new Date();
                  const isActive = coupon.isActive && !isExpired;

                  return (
                    <tr key={coupon._id} className="hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-white tracking-wider px-2 py-1 bg-neutral-950 border border-neutral-700 rounded-md">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {coupon.discountType === 'PERCENTAGE' ? (
                          <span>{coupon.discountValue}% <span className="text-xs text-neutral-500 ml-1">{coupon.maxDiscountAmount ? `(Up to ₹${coupon.maxDiscountAmount})` : ''}</span></span>
                        ) : (
                          <span>₹{coupon.discountValue} Off</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-semibold border ${
                          isActive ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-500' : 'bg-red-950/30 border-red-900/50 text-red-500'
                        }`}>
                          {isActive ? 'Active' : 'Expired/Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button 
                          onClick={() => handleDelete(coupon._id)}
                          className="text-neutral-500 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-neutral-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddCouponModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddCoupon}
      />
    </div>
  );
}