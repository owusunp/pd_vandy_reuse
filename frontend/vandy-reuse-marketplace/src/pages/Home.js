// src/pages/Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import items from '../data/Items';

const Home = ({ bookmarks, toggleBookmark }) => {
  return (
    <div className="container">
      <h1>Latest Products</h1>
      <div className="product-listing">
        {items.map((item) => (
          <div className="product-card" key={item.id}>
            <img src={item.imageUrl} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <div className="price">${item.price}</div>
            <Link to={`/item/${item.id}`} className="buy-button">
              View Details
            </Link>
            <button
              className="bookmark-button"
              onClick={() => toggleBookmark(item)}
            >
              {bookmarks.includes(item) ? '🔖' : '🔲'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
