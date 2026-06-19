import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('home');
  
  // Item detail states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); 
  
  // Overlay states
  const [isCheckout, setIsCheckout] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Master navigation controller
  const navTo = (page) => {
    setCurrentPage(page);
    setSelectedProduct(null);
    setSelectedOrder(null); 
    setIsCheckout(false);
    setIsCartOpen(false);
  };

  return (
    <AppContext.Provider value={{
      currentPage, setCurrentPage,
      selectedProduct, setSelectedProduct,
      selectedOrder, setSelectedOrder,
      isCheckout, setIsCheckout,
      isCartOpen, setIsCartOpen,
      navTo
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);