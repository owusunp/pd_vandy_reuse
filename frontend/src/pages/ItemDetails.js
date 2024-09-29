import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StreamChat } from 'stream-chat';
import { useItems } from '../ItemsContext';

const apiKey = 'wh9yrcrxaqss'; // Stream API Key

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { items } = useItems();
  const item = items.find((item) => item._id === id);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % item.list_of_images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + item.list_of_images.length) % item.list_of_images.length);
  };

  if (!item) {
    return <div>Item not found</div>;
  }

  const handleContactSeller = async () => {
    const buyer = sessionStorage.getItem('username');
    const streamToken = sessionStorage.getItem('streamToken');
    const seller = item.vendor; // Seller's username (vendor)

    // Ensure buyer and seller are not the same
    if (buyer === seller) {
      alert("You cannot message yourself.");
      return;
    }

    // Redirect to the Messages page with the seller as a query parameter
    navigate(`/messages?to=${seller}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.itemDetails}>
        <h2 style={styles.title}>{item.name}</h2>
        <img src={item.list_of_images[currentImageIndex]} alt={item.name} style={styles.image} />
        {item.list_of_images.length > 1 && (
          <div style={styles.imageNavigation}>
            <button onClick={handlePrevImage} style={styles.navButton}>
              &lt;
            </button>
            <button onClick={handleNextImage} style={styles.navButton}>
              &gt;
            </button>
          </div>
        )}
        <p style={styles.text}>Category: {item.category}</p>
        <p style={styles.text}>Seller Note: {item.description}</p>
        <p style={styles.text}>Price: {item.price}</p>
        <p style={styles.text}>Seller: {item.vendor}</p>
        <button onClick={handleContactSeller} style={styles.contactButton}>
          Contact Seller
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '2rem',
  },
  itemDetails: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  image: {
    width: '100%',
    maxWidth: '400px',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  imageNavigation: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  navButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.5rem',
  },
  text: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
  },
  contactButton: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '1rem',
    marginTop: '1rem',
  },
};

export default ItemDetails;
