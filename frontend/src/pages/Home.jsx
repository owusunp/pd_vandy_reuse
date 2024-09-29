import React, { useState } from 'react';
import ItemComponent from '../components/ItemComponent'; // Adjust the import path as necessary
import { useItems } from '../ItemsContext';

const categories = ['All', 'Clothing', 'Shoes', 'Accessories', 'Electronics', 'Room'];

const Home = ({ bookmarks, toggleBookmark }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { items } = useItems();

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Filter items based on selected category and sort sold items to the bottom
  const filteredItems = selectedCategory === 'All'
    ? items
    : selectedCategory === 'Room'
    ? items.filter(item => item.category.some(cat => cat === 'Room' || cat === 'Kitchen'))
    : items.filter(item => item.category.some(cat => cat === selectedCategory));

  // Sort filtered items such that sold items appear at the bottom
  const sortedItems = filteredItems.sort((a, b) => (a.status === 'sold' ? 1 : -1));

  return (
    <div style={{ padding: '2rem', maxWidth: '100vw', marginTop: "70px" }}>
      {/* Category Buttons */}
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

      {/* Display Filtered and Sorted Items */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
        {sortedItems.map((item) => (
          <ItemComponent
            key={item._id}
            item={item}
            bookmarks={bookmarks}
            toggleBookmark={toggleBookmark}
            style={{ height: '300px', width: '320px', overflow: 'hidden' }} // Set consistent height
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
