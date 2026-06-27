import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, ExternalLink, Newspaper } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { pressService } from '../services/press.service';
import AddPressModal from '../components/AddPressModal';
import EditPressModal from '../components/EditPressModal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Press() {
  const [pressList, setPressList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPress, setSelectedPress] = useState(null);
  const { showToast } = useToast();

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    pressId: null,
  });

  const fetchPress = async () => {
    setIsLoading(true);
    try {
      const data = await pressService.getAll();
      setPressList(data.pressList || data || []);
    } catch (error) {
      showToast("Failed to load press features", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPress(); }, []);

  const handleAdd = async (data) => {
    try {
      await pressService.add(data);
      showToast("Press feature added", "success");
      fetchPress();
    } catch (error) {
      showToast("Failed to add press feature", "error");
      throw error;
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await pressService.update(id, data);
      showToast("Press feature updated", "success");
      fetchPress();
    } catch (error) {
      showToast("Failed to update feature", "error");
      throw error;
    }
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setConfirmDialog({ isOpen: true, pressId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await pressService.delete(confirmDialog.pressId);
      showToast("Press feature deleted", "success");
      fetchPress();
    } catch (error) {
      showToast("Failed to delete press feature", "error");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Press & Media</h1>
          <p className="text-sm text-neutral-400 mt-1">Manage your press features and media coverage</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-neutral-200 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Feature
        </button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[300px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="text-sm">Fetching press features...</p>
          </div>
        ) : pressList.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
            <Newspaper className="w-8 h-8 mb-3 text-neutral-600" />
            <p className="text-sm">No press features yet. Add your first one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-400">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-300">
                <tr>
                  <th className="px-6 py-4 font-medium">Feature</th>
                  <th className="px-6 py-4 font-medium">Link</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {pressList.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => { setSelectedPress(item); setIsEditOpen(true); }}
                    className="hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.headline}
                          className="w-16 h-10 object-cover rounded bg-neutral-800 border border-neutral-700 shrink-0"
                        />
                        <span className="text-white font-medium group-hover:underline decoration-neutral-500 underline-offset-4">
                          {item.headline}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={item.redirectLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors w-fit"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View Source
                      </a>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedPress(item); setIsEditOpen(true); }}
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

      <AddPressModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAdd}
      />

      <EditPressModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onUpdate={handleUpdate}
        pressItem={selectedPress}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, pressId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete press feature?"
        message="This will permanently remove this press feature. This action can't be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}