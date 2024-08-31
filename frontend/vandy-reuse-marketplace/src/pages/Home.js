import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookmarkIcon from '../assets/images/bookmark-icon.png';

const categories = ['All', 'Women', 'Men', 'Accessories', 'Electronics'];

const Home = ({ bookmarks, toggleBookmark }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Load items from localStorage on component mount
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    setItems(storedItems);
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(item => item.category === selectedCategory);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Reuse Vandy</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {categories.map((category) => (
          <button
            key={category}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: selectedCategory === category ? '#B3A369' : '#fff',
              color: selectedCategory === category ? '#fff' : '#B3A369',
              border: '1px solid #B3A369',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {filteredItems.map((item) => (
          <div key={item.id} style={{ border: '1px solid #ccc', padding: '1rem', position: 'relative' }}>
            <Link to={`/item/${item.id}`} style={{ textDecoration: 'none', color: '#000' }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: 'auto' }} />
              <h2>{item.name}</h2>
              <p>{item.price}</p>
            </Link>
            <button
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => toggleBookmark(item)}
            >
              <img
                src={bookmarkIcon}
                alt="Bookmark"
                style={{
                  width: '24px',
                  height: '24px',
                  filter: bookmarks.includes(item) ? 'none' : 'grayscale(100%)',
                }}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
