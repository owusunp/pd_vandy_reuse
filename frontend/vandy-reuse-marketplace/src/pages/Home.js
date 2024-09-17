import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import bookmarkIcon from '../assets/images/bookmark-icon.png';

const categories = ['All', 'Women', 'Men', 'Accessories', 'Electronics'];

const Home = ({ bookmarks, toggleBookmark }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch items from the backend using axios
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/items/');
        setItems(response.data);
        sessionStorage.setItem('items', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching items:', error.response ? error.response.data : error.message);
      }
    };
  
    const storedItems = sessionStorage.getItem('items');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    } else {
      fetchItems();
    }
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(item => item.category === selectedCategory);

  return (
    <div style={{ padding: '2rem', maxWidth: '100vw'}}>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {filteredItems.map((item) => (
          <ItemComponent
            key={item.id}
            item={item}
            bookmarks={bookmarks}
            toggleBookmark={toggleBookmark}
            style={{ height: '400px', width: '420px', overflow: 'hidden' }} // Set consistent height
          />
        ))}
      </div>
    </div>
  );
};

const ItemComponent = ({ item, bookmarks, toggleBookmark, style }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % item.list_of_images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + item.list_of_images.length) % item.list_of_images.length);
  };

  return (
    <div key={item.id} style={{ ...style, border: '1px solid #ccc', padding: '1rem', position: 'relative' }}>
      <Link to={`/item/${item.id}`} style={{ textDecoration: 'none', color: '#000' }}>
        <img
          src={item.list_of_images[currentImageIndex]}
          alt={item.name}
          style={{ width: '100%', height: '300px', width: '400px' }}
        />
        <h2>{item.name}</h2>
        <p>{item.price}</p>
      </Link>
      {item.list_of_images.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', top: '50%', width: '100%' }}>
          <button onClick={handlePrevImage} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            &lt;
          </button>
          <button onClick={handleNextImage} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            &gt;
          </button>
        </div>
      )}
      <button
        style={{
          position: 'absolute',
          top: '10px',
          right: '5px',
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
  );
};

export default Home;