import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, FileText } from 'lucide-react'; 
import { useToast } from '../context/ToastContext';
import { newsService } from '../services/news.service';
import AddNewsModal from '../components/AddNewsModal';
import EditNewsModal from '../components/EditNewsModal';

export default function News() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const { showToast } = useToast();

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const data = await newsService.getAll();
      setNews(data.newsList || data || []);
    } catch (error) {
      showToast("Failed to load news", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  const handleAdd = async (data) => {
    await newsService.add(data);
    showToast("News published", "success");
    fetchNews();
  };

  const handleUpdate = async (id, data) => {
    try {
      await newsService.update(id, data);
      showToast("News updated", "success");
      fetchNews();
    } catch (error) {
      showToast("Failed to update", "error");
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this news post?")) return;
    await newsService.delete(id);
    showToast("Deleted successfully", "success");
    fetchNews();
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-semibold text-white">Store News</h1></div>
        <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-neutral-200">
          <Plus className="w-4 h-4" /> Post News
        </button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[300px] relative">
        {/* Loading and Empty states omitted for brevity (keep them from your previous code) */}
        {!isLoading && news.length > 0 && (
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-950 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium">Headline</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {news.map((item) => (
                <tr key={item._id} className="hover:bg-neutral-800/50">
                  <td className="px-6 py-4 text-white font-medium">{item.title}</td>
                  <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setSelectedNews(item); setIsEditOpen(true); }} className="text-neutral-500 hover:text-white p-2 rounded-md hover:bg-neutral-800"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item._id)} className="text-neutral-500 hover:text-red-500 p-2 rounded-md hover:bg-neutral-800"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <AddNewsModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={handleAdd} />
      <EditNewsModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onUpdate={handleUpdate} article={selectedNews} />
    </div>
  );
}