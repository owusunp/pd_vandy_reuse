// src/pages/ItemDetails.js

import React from 'react';
import { useParams } from 'react-router-dom';
import items from '../data/Items'; // Import as default

const ItemDetails = () => {
  const { id } = useParams(); // Get the item ID from the route
  const item = items.find(item => item.id === parseInt(id)); // Find the item by ID

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <div className="item-details">
      <h1>{item.name}</h1>
      <img src={item.image} alt={item.name} />
      <p>{item.description}</p>
      <p>Price: ${item.price}</p>
    </div>
  );
};

export default ItemDetails;
