import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, FileText } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { newsService } from '../services/news.service';
import AddNewsModal from '../components/AddNewsModal';
import EditNewsModal from '../components/EditNewsModal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function News() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const { showToast } = useToast();

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    newsId: null,
  });

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
    try {
      await newsService.add(data);
      showToast("News published", "success");
      fetchNews();
    } catch (error) {
      showToast("Failed to publish news", "error");
      throw error;
    }
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

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setConfirmDialog({ isOpen: true, newsId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await newsService.delete(confirmDialog.newsId);
      showToast("News deleted", "success");
      fetchNews();
    } catch (error) {
      showToast("Failed to delete news", "error");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Store News</h1>
          <p className="text-sm text-neutral-400 mt-1">Manage your public news posts</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-neutral-200 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Post News
        </button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[300px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="text-sm">Fetching news...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
            <FileText className="w-8 h-8 mb-3 text-neutral-600" />
            <p className="text-sm">No news posts yet. Publish your first one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-400">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-300">
                <tr>
                  <th className="px-6 py-4 font-medium">Headline</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {news.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => { setSelectedNews(item); setIsEditOpen(true); }}
                    className="hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 text-white font-medium group-hover:underline decoration-neutral-500 underline-offset-4">
                      {item.title}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedNews(item); setIsEditOpen(true); }}
                          className="text-neutral-500 hover:text-white transition-colors p-2 rounded-md hover:bg-neutral-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, item._id)}
                          className="text-neutral-500 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-neutral-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddNewsModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAdd}
      />

      <EditNewsModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onUpdate={handleUpdate}
        article={selectedNews}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, newsId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete news post?"
        message="This will permanently remove the post. This action can't be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}