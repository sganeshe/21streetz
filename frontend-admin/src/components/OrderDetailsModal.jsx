import React, { useState } from 'react';
import { X, Package, Truck, CheckCircle, MapPin, CreditCard } from 'lucide-react';

export default function OrderDetailsModal({ isOpen, onClose, order, onUpdateDelivery }) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !order) return null;

  const handleMarkDelivered = async () => {
    setIsUpdating(true);
    try {
      await onUpdateDelivery(order._id);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans text-white">
      <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 shrink-0">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Package className="w-5 h-5 text-neutral-400" />
              Order Details
            </h2>
            <p className="text-xs text-neutral-400 font-mono mt-1">ID: {order._id}</p>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors p-1 rounded-md hover:bg-neutral-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          
          {/* Status Banners */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border flex items-center gap-3 ${order.isPaid ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-400' : 'bg-red-950/20 border-red-900/50 text-red-400'}`}>
              <CreditCard className="w-5 h-5" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-0.5">Payment</p>
                <p className="text-sm">{order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Pending'}</p>
              </div>
            </div>
            <div className={`p-4 rounded-xl border flex items-center gap-3 ${order.isDelivered ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-400' : 'bg-amber-950/20 border-amber-900/50 text-amber-400'}`}>
              <Truck className="w-5 h-5" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-0.5">Delivery</p>
                <p className="text-sm">{order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Processing'}</p>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-neutral-300 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Shipping Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-neutral-500 mb-1">Customer</p>
                <p className="font-medium">{order.user?.name || 'Guest User'}</p>
                <p className="text-neutral-400">{order.user?.email}</p>
                {/* Render the phone number here */}
                {order.shippingAddress?.phone && (
                  <p className="text-neutral-400 mt-1">📞 {order.shippingAddress.phone}</p>
                )}
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Address</p>
                <p className="font-medium">{order.shippingAddress?.address}</p>
                <p className="text-neutral-400">
                  {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                </p>
                <p className="text-neutral-400">{order.shippingAddress?.country}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-300 mb-3">Purchased Items</h3>
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
              <div className="divide-y divide-neutral-800">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="p-4 flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded bg-neutral-900 object-cover border border-neutral-800" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">Size: {item.size} | Qty: {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">₹{item.price}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">Total: ₹{item.qty * item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* This replaces your old summary section */}
              <div className="bg-neutral-900 p-4 border-t border-neutral-800 text-sm">
                <div className="flex justify-between text-neutral-400 mb-2">
                  <span>Items Subtotal</span>
                  <span>₹{order.itemsPrice?.toFixed(2) || order.totalPrice}</span>
                </div>
                
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 mb-2">
                    <span>Discount Applied</span>
                    <span>-₹{order.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400 mb-2">
                  <span>Shipping</span>
                  <span>{order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice?.toFixed(2) || 0}`}</span>
                </div>
                
                <div className="flex justify-between text-white font-semibold pt-3 border-t border-neutral-800 mt-3">
                  <span>Total</span>
                  <span>₹{order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-800 flex justify-end gap-3 shrink-0 bg-neutral-950">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
            Close
          </button>
          
          {/* Only show Mark Delivered button if order is paid but NOT delivered */}
          {!order.isDelivered && order.isPaid && (
            <button 
              onClick={handleMarkDelivered} 
              disabled={isUpdating}
              className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Mark as Delivered
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}