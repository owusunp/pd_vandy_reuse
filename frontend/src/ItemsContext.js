import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from './config';

const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/items/`);
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, []);

  return (
    <ItemsContext.Provider value={{ items, setItems }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error("useItems must be used within an ItemsProvider");
  }
  return context;
};
