import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemComponent from '../components/ItemComponent'; // Adjust the import path as necessary

const categories = ['All', 'Women', 'Men', 'Accessories', 'Electronics'];

const Home = ({ bookmarks, toggleBookmark }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const storedItems = sessionStorage.getItem('items');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    } else {
      // Fetch items from the backend using axios
      const fetchItems = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/v1/items/');
          const notifications = await axios.get('http://127.0.0.1:8000/api/v1/notifications/');
          //notifications will be a dict with keys 'buy_notifications' and 'sell_notifications' that contain arrays of notifications.store the sum of the lengths of these arrays in a variable called notificationCount in sessionStorage
          const notificationCount = notifications.data.buy_notifications.length + notifications.data.sell_notifications.length;
          sessionStorage.setItem('notificationCount', notificationCount);
          console.log("hello");
          setItems(response.data);
          sessionStorage.setItem('items', JSON.stringify(response.data));
        } catch (error) {
          console.error('Error fetching items:', error.response ? error.response.data : error.message);
        }
      };
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
            key={item._id}
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

export default Home;