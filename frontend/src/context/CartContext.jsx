// context/CartContext.jsx
import { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Function to add items
  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  // Real-time count
  const cartCount = cart.length;

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);