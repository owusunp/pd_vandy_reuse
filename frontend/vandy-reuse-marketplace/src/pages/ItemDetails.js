// src/pages/ItemDetails.js

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import items from '../data/Items';

const ItemDetails = () => {
  const { id } = useParams();
  const item = items.find(item => item.id === parseInt(id));

  if (!item) {
    return <p>Item not found</p>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{item.title}</h2>
      <img src={item.image} alt={item.title} style={{ width: '100%', maxWidth: '400px' }} />
      <p>Category: {item.category}</p>
      <p>Size: {item.size}</p>
      <p>Price: {item.price}</p>
      <p>Seller: {item.seller}</p>
      <Link to={`/messages?to=${item.seller}`}>Message Seller</Link>
    </div>
  );
};

export default ItemDetails;
