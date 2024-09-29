import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItems } from '../ItemsContext';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { items } = useItems();
  const item = items.find(item => item._id === id);

  if (!item) {
    return <div style={styles.notFound}>Item not found</div>;
  }

  const handleContactSeller = () => {
    const buyer = sessionStorage.getItem('username');
    const seller = item.vendor; // Seller's username (vendor)
    const itemImage = item.list_of_images[currentImageIndex]; // Currently selected item image
  
    // Ensure buyer and seller are not the same
    if (buyer === seller) {
      alert("You cannot message yourself.");
      return;
    }
  
    // Redirect to the Messages page with the seller as a query parameter and image
    navigate(`/messages?to=${seller}&image=${encodeURIComponent(itemImage)}`);
  };
  
  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div style={styles.container}>
      <div style={styles.imageSection}>
        <div style={styles.thumbnails}>
          {item.list_of_images.map((imgSrc, index) => (
            <img
              key={index}
              src={imgSrc}
              alt={`${item.name} thumbnail ${index + 1}`}
              style={{
                ...styles.thumbnail,
                border: index === currentImageIndex ? '2px solid #007bff' : '2px solid transparent',
              }}
              onClick={() => handleThumbnailClick(index)}
            />
          ))}
        </div>
        <div style={styles.mainImageContainer}>
          <img
            src={item.list_of_images[currentImageIndex]}
            alt={item.name}
            style={styles.mainImage}
          />
        </div>
        <div style={styles.itemDetails}>
        <h2 style={styles.title}>{item.name}</h2>
        <p style={styles.text}><strong>Category:</strong> {item.category}</p>
        <p style={styles.text}><strong>Seller Note:</strong> {item.description}</p>
        <p style={styles.text}><strong>Price:</strong> {item.price}</p>
        <p style={styles.text}><strong>Seller:</strong> {item.vendor}</p>
        <button onClick={handleContactSeller} style={styles.contactButton}>
          Contact Seller
        </button>
      </div>
      </div>
    </div>
  );
};

const styles = {
  notFound: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '1.5rem',
    color: '#555',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    marginTop: '70px',
  },
  imageSection: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: '2rem',
  },
  thumbnails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginRight: '20px',
  },
  thumbnail: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'border 0.3s',
  },
  mainImageContainer: {
    width: '700px', // Fixed width
    height: '500px', // Fixed height
    display: 'flex',
    marginRight: '20px',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Hide any overflow
    borderRadius: '8px',
    backgroundColor: '#ddd', // Optional: Placeholder background
  },
  mainImage: {
    width: '100%',
    height: '100%',

  },
  itemDetails: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'left',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  text: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    lineHeight: '1.5',
  },
  contactButton: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background-color 0.3s',
  },
};

// Note: Inline styles do not support pseudo-classes like :hover. 
// To add hover effects, consider using CSS classes or styled-components.

export default ItemDetails;
