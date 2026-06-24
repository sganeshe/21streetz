import React, { useState, useEffect } from 'react';
import { Search, Loader2, Eye } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/order.service';
import OrderDetailsModal from '../components/OrderDetailsModal';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // NEW: Search state
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data.orders || data || []);
    } catch (error) {
      showToast("Failed to load orders from server", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateDelivery = async (orderId) => {
    try {
      await orderService.markAsDelivered(orderId);
      showToast("Order marked as delivered", "success");
      fetchOrders(); 
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update order", "error");
      throw error;
    }
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // NEW: Filter logic for Order ID and Customer Name/Email
  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;

    const lowerCaseQuery = searchQuery.toLowerCase();
    const orderIdMatch = order._id?.toLowerCase().includes(lowerCaseQuery);
    const customerNameMatch = order.user?.name?.toLowerCase().includes(lowerCaseQuery);
    const customerEmailMatch = order.user?.email?.toLowerCase().includes(lowerCaseQuery);

    return orderIdMatch || customerNameMatch || customerEmailMatch;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Orders</h1>
          <p className="text-sm text-neutral-400 mt-1">Track and manage customer purchases</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between bg-neutral-900 p-4 rounded-xl border border-neutral-800">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID or Customer..." 
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-neutral-500 transition-all placeholder-neutral-600"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm min-h-[300px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
             <Loader2 className="w-8 h-8 animate-spin mb-4" />
             <p className="text-sm">Fetching orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
            <p className="text-sm">No orders found yet.</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          // NEW: Empty state for when a search yields no results
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
            <p className="text-sm">No orders match "{searchQuery}".</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-400">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-300">
                <tr>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Order ID</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Date</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Customer</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Total</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Payment</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {/* NEW: Map over filteredOrders instead of orders */}
                {filteredOrders.map((order) => (
                  <tr 
                    key={order._id} 
                    onClick={() => openOrderModal(order)}
                    className="hover:bg-neutral-800/80 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-neutral-500 group-hover:text-white transition-colors">
                      {order._id.substring(0, 10)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-white font-medium">{order.user?.name || 'Guest'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      ₹{order.totalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-semibold border ${
                        order.isPaid ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-500' : 'bg-red-950/30 border-red-900/50 text-red-500'
                      }`}>
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-semibold border ${
                        order.isDelivered ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 'bg-amber-950/30 border-amber-900/50 text-amber-500'
                      }`}>
                        {order.isDelivered ? 'Delivered' : 'Processing'}
                      </span>
                      <Eye className="w-4 h-4 text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <OrderDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onUpdateDelivery={handleUpdateDelivery}
      />
    </div>
  );
}