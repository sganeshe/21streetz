import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCheckout, setIsCheckout] = useState(false);

  const navTo = (page) => {
    setCurrentPage(page);
    setSelectedProduct(null); 
    setIsCheckout(false);
  };

  const addToCart = (product, selectedSize = 'M') => {
    const existingItem = cartItems.find(
      (item) => item.id === product.id && item.size === selectedSize
    );

    if (existingItem) {
      setCartItems(cartItems.map((item) =>
        item.id === product.id && item.size === selectedSize
          ? { ...item, qty: item.qty + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, size: selectedSize, qty: 1 }]);
    }
    setIsCartOpen(true);
  };

  return (
    <AppContext.Provider value={{
      currentPage, setCurrentPage, navTo,
      selectedProduct, setSelectedProduct,
      isCartOpen, setIsCartOpen,
      cartItems, setCartItems, addToCart,
      isCheckout, setIsCheckout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);