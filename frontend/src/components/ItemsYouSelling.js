import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ItemsYouSelling = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const username = sessionStorage.getItem('username'); // Fetch the logged-in user's username

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/items`);
        // Filter items where the vendor is the logged-in user
        const userItems = response.data.filter(item => item.vendor === username);
        // Sort items by their "sold" status, ensuring sold items are at the bottom
        const sortedItems = userItems.sort((a, b) => (a.status === 'sold' ? 1 : -1));
        setItems(sortedItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [username]);

  const handleToggleSoldStatus = async (itemId) => {
    try {
      // Toggle the sold status in the backend and get the updated status
      const response = await axios.patch(`http://127.0.0.1:8000/api/v1/items/${itemId}`);
      const updatedStatus = response.data.status;  // Capture the new status

      // Update the frontend items list with the new status
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, status: updatedStatus } : item
        )
      );
    } catch (error) {
      console.error('Error toggling sold status:', error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      // Send delete request to API
      await axios.delete(`http://127.0.0.1:8000/api/v1/items/${itemId}`);
      setItems(items.filter((item) => item._id !== itemId)); // Remove deleted item from UI
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Items You Are Selling</h1>
      {items.length > 0 ? (
        <ul style={styles.itemList}>
          {items.map((item) => (
            <li key={item._id} style={styles.item}>
              <img src={item.list_of_images[0]} alt={item.name} style={styles.image} />
              <div style={styles.details}>
                <p><strong>{item.name}</strong></p>
                <p>Price: ${item.price}</p>
                <p>Status: {item.status}</p>
                <button style={styles.button} onClick={() => handleToggleSoldStatus(item._id)}>
                  {item.status === 'sold' ? 'Mark as Available' : 'Mark as Sold'}
                </button>
                <button style={styles.button} onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items listed for sale.</p>
      )}
      <button style={styles.backButton} onClick={() => navigate('/')}>
        Back to Home
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
  },
  itemList: {
    listStyleType: 'none',
    padding: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    marginRight: '1rem',
    borderRadius: '8px',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  backButton: {
    marginTop: '2rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ItemsYouSelling;
