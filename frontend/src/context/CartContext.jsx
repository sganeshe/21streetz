import { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Initialize state from LocalStorage to survive page refreshes
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("21streetz_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  // 2. Auto-save to LocalStorage every time cartItems changes
  useEffect(() => {
    localStorage.setItem("21streetz_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 3. Add to Cart (Handles Sizes)
  const addToCart = (product, qty, size) => {
    setCartItems((prevItems) => {
      // Check if this EXACT product AND EXACT size is already in the cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product === product._id && item.size === size,
      );

      if (existingItemIndex >= 0) {
        // If it exists, just increase the quantity
        const updatedCart = [...prevItems];
        updatedCart[existingItemIndex].qty += qty;
        return updatedCart;
      } else {
        // If it's a new size or new product, push a fresh item
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0], // Grab the first uploaded image for the thumbnail
            size: size,
            qty: qty,
          },
        ];
      }
    });
  };

  // 4. Remove a specific item/size combo
  const removeFromCart = (productId, size) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.product === productId && item.size === size),
      ),
    );
  };

  // 5. Update quantity directly (e.g., from a dropdown in the cart view)
  const updateQuantity = (productId, size, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product === productId && item.size === size
          ? { ...item, qty: newQty }
          : item,
      ),
    );
  };

  // 6. Clear Cart (Call this after a successful payment!)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("21streetz_cart");
  };

  // 7. Auto-calculated derived state
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  const cartCount = cartItems.reduce((count, item) => count + item.qty, 0);

  const value = {
    cartItems,
    setCartItems,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
