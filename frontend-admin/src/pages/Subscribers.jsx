import React, { useState, useEffect } from 'react';
import { Mail, Search, Loader2, Users } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { subscriptionService } from '../services/subscription.service';
import BroadcastModal from '../components/BroadcastModal';

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const data = await subscriptionService.getAll();
      setSubscribers(data.subscribers || []);
    } catch (error) {
      showToast("Failed to load subscribers", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const handleBroadcast = async (data) => {
    try {
      await subscriptionService.broadcast(data);
      showToast("Broadcast campaign initiated!", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to send broadcast", "error");
      throw error;
    }
  };

  const activeCount = subscribers.filter(s => s.status === 'ACTIVE').length;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Mailing List</h1>
          <p className="text-sm text-neutral-400 mt-1">Manage subscribers and email campaigns</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-neutral-200">
          <Mail className="w-4 h-4" /> New Broadcast
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-neutral-400"><Users className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-neutral-500 font-medium">Total Subscribers</p>
            <p className="text-2xl font-semibold text-white">{subscribers.length}</p>
          </div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-950/20 rounded-lg border border-emerald-900/50 text-emerald-500"><Mail className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-neutral-500 font-medium">Active Audience</p>
            <p className="text-2xl font-semibold text-white">{activeCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[300px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : subscribers.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400"><p>Your mailing list is currently empty.</p></div>
        ) : (
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-950 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium">Email Address</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Subscribed On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {subscribers.map((sub) => (
                <tr key={sub._id} className="hover:bg-neutral-800/50">
                  <td className="px-6 py-4 text-white font-medium">{sub.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-semibold border ${
                      sub.status === 'ACTIVE' ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-500' : 'bg-neutral-950 border-neutral-800 text-neutral-500'
                    }`}>
                      {sub.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(sub.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <BroadcastModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSend={handleBroadcast} />
    </div>
  );
}