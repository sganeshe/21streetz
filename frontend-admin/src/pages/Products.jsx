import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Loader2, Image as ImageIcon, Edit2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { productService } from '../services/product.service'; 
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';


  


export default function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const { showToast } = useToast();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data.products || []);
    } catch (error) {
      showToast("Failed to load products from server", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (formData) => {
    try {
      await productService.add(formData);
      showToast("Product successfully created", "success");
      fetchProducts(); 
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to create product", "error");
      throw error; 
    }
  };

  const handleUpdateProduct = async (id, formData) => {
    try {
      await productService.update(id, formData);
      showToast("Product updated successfully", "success");
      fetchProducts();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update product", "error");
      throw error;
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevents the row click from opening the edit modal
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.delete(id);
      showToast("Product deleted", "success");
      fetchProducts();
    } catch (error) {
      showToast("Failed to delete product", "error");
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true;

    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      product.name?.toLowerCase().includes(lowerCaseQuery) ||
      product.category?.toLowerCase().includes(lowerCaseQuery)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Products</h1>
          <p className="text-sm text-neutral-400 mt-1">Manage your storefront inventory</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-neutral-200 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="flex items-center justify-between bg-neutral-900 p-4 rounded-xl border border-neutral-800">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-neutral-500 transition-all placeholder-neutral-600"
          />
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm min-h-[300px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
             <Loader2 className="w-8 h-8 animate-spin mb-4" />
             <p className="text-sm">Fetching database...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
            <p className="text-sm">No products found. Add your first item.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
            <p className="text-sm">No product match for "{searchQuery}".</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-400 cursor-default">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-300">
                <tr>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Product</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Total Inventory</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Price</th>
                  <th className="px-6 py-4 font-medium text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredProducts.map((product) => {
                  const totalStock = product.sizes?.reduce((sum, s) => sum + s.countInStock, 0) || 0;
                  
                  return (
                    <tr 
                      key={product._id} 
                      onClick={() => openEditModal(product)}
                      className="hover:bg-neutral-800/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded bg-neutral-800 object-cover border border-neutral-700" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-neutral-800 flex items-center justify-center border border-neutral-700">
                            <ImageIcon className="w-4 h-4 text-neutral-600" />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium group-hover:underline decoration-neutral-500 underline-offset-4">{product.name}</p>
                          <p className="text-xs text-neutral-500 uppercase">{product.category}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-semibold border ${
                          totalStock > 10 ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 
                          totalStock > 0 ? 'bg-neutral-800 border-neutral-700 text-white' : 
                          'bg-red-950/30 border-red-900/50 text-red-500'
                        }`}>
                          {totalStock > 10 ? 'In Stock' : totalStock > 0 ? 'Low Stock' : 'Sold Out'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{totalStock} units</td>
                      <td className="px-6 py-4 text-white whitespace-nowrap">₹{product.price}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); openEditModal(product); }}
                            className="text-neutral-500 hover:text-white transition-colors p-2 rounded-md hover:bg-neutral-800"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => handleDelete(e, product._id)}
                            className="text-neutral-500 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-neutral-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddProduct}
      />

      <EditProductModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onUpdate={handleUpdateProduct}
        product={selectedProduct}
      />
    </div>
  );
}