import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
	const [items, setItems] = useState([]);

	const addItem = (item) => setItems((prev) => [...prev, item]);
	const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
	const clearCart = () => setItems([]);

	const value = { items, addItem, removeItem, clearCart };

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
