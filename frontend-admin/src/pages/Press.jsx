import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, ExternalLink } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { pressService } from '../services/press.service';
import AddPressModal from '../components/AddPressModal';
import EditPressModal from '../components/EditPressModal'; 

export default function Press() {
  const [pressList, setPressList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPress, setSelectedPress] = useState(null);
  const { showToast } = useToast();

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
    await pressService.add(data);
    showToast("Press feature added", "success");
    fetchPress();
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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this press feature?")) return;
    await pressService.delete(id);
    showToast("Deleted successfully", "success");
    fetchPress();
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-semibold text-white">Press & Media</h1></div>
        <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-neutral-200">
          <Plus className="w-4 h-4" /> Add Feature
        </button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[300px] relative">
        {/* Loading and Empty states omitted for brevity */}
        {!isLoading && pressList.length > 0 && (
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-950 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium">Feature</th>
                <th className="px-6 py-4 font-medium">Link</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {pressList.map((item) => (
                <tr key={item._id} className="hover:bg-neutral-800/50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={item.image} alt={item.headline} className="w-16 h-10 object-cover rounded bg-neutral-800 border border-neutral-700" />
                    <span className="text-white font-medium">{item.headline}</span>
                  </td>
                  <td className="px-6 py-4">
                    <a href={item.redirectLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-neutral-500 hover:text-white transition-colors">
                      <ExternalLink className="w-4 h-4" /> View Source
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setSelectedPress(item); setIsEditOpen(true); }} className="text-neutral-500 hover:text-white p-2 rounded-md hover:bg-neutral-800"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item._id)} className="text-neutral-500 hover:text-red-500 p-2 rounded-md hover:bg-neutral-800"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <AddPressModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={handleAdd} />
      <EditPressModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onUpdate={handleUpdate} pressItem={selectedPress} />
    </div>
  );
}