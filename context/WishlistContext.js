import React, { createContext, useReducer } from 'react';

export const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_WISHLIST':
      const exists = state.find(item => item.id === action.payload.id);
      return exists
        ? state.filter(item => item.id !== action.payload.id)
        : [...state, action.payload];
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, dispatch] = useReducer(wishlistReducer, []);
  return (
    <WishlistContext.Provider value={{ wishlist, dispatch }}>
      {children}
    </WishlistContext.Provider>
  );
};
