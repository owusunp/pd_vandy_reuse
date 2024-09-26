import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemComponent from '../components/ItemComponent'; // Adjust the import path as necessary
import { useUnreadCount } from '../UnreadCountContext';

const categories = ['All', 'Women', 'Men', 'Accessories', 'Electronics'];

const Home = ({ bookmarks, toggleBookmark }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [items, setItems] = useState([]);
  const [buy_notification, setBuyNotification] = useState([]);
  const [sell_notification, setSellNotification] = useState([]);
  const { setUnreadCount } = useUnreadCount();

  useEffect(() => {
    const storedItems = sessionStorage.getItem('items');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    } else {
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
      const fetchNotifications = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/v1/notifications/');
          if (response.status === 200) {
            setBuyNotification(response.data.buy_notifications);
            setSellNotification(response.data.sell_notifications);
            //console log both buying and selling notifications
            console.log(response.data.buy_notifications);
            console.log(response.data.sell_notifications);
          }
        } catch (error) {
          console.error('Error fetching items:', error.response ? error.response.data : error.message);
        }
      };
      fetchItems();
      fetchNotifications();
    }
  }, []);
  useEffect(() => {
    // Update unread count
    const count = [...sell_notification, ...buy_notification].filter(notification => !notification.is_read).length;
    setUnreadCount(count);
  }, [sell_notification, buy_notification, setUnreadCount]);
  
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
        {filteredItems.map((item) => (
          <ItemComponent
            key={item._id}
            item={item}
            bookmarks={bookmarks}
            toggleBookmark={toggleBookmark}
            style={{ height: '310px', width: '320px', overflow: 'hidden' }} // Set consistent height
          />
        ))}
      </div>
    </div>
  );
};

export default Home;