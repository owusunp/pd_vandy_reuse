import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import bookmarkIcon from '../assets/images/bookmark-icon.png';
import notBookmarkedIcon from '../assets/images/notBookmark.png';

const ItemComponent = ({ item, bookmarks = [], toggleBookmark, style }) => { 
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const location = useLocation();
  const isBookmarked = bookmarks.some((bookmark) => bookmark._id === item._id);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % item.list_of_images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + item.list_of_images.length) % item.list_of_images.length);
  };

  const handleBookmarkClick = () => {
    toggleBookmark(item);
  };

  return (
    <div
      key={item._id}
      style={{
        ...style,
        border: '1px solid #ccc',
        padding: '1rem',
        position: 'relative',
        opacity: item.status === 'sold' ? 0.5 : 1, // Dim sold items
      }}
    >
      <Link to={`/item-details/${item._id}`} style={{ textDecoration: 'none', color: '#000' }}>
        <img
          src={item.list_of_images[currentImageIndex]}
          alt={item.name}
          style={{ height: '220px', width: '300px' }}
        />
        <h2 style={item.status === 'sold' ? styles.soldText : {}}>{item.name}</h2>
        <p>{item.price}</p>
      </Link>

      {item.status === 'sold' && (
        <span style={styles.soldBadge}>SOLD</span>
      )}

      {item.list_of_images.length > 1 && location.pathname.includes('/item-details') && (
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
        onClick={handleBookmarkClick}
      >
        <img
          src={isBookmarked ? bookmarkIcon : notBookmarkedIcon}
          alt="Bookmark"
          style={{
            width: '20px',
            height: '20px',
          }}
        />
      </button>
    </div>
  );
};

// Additional styles for sold items
const styles = {
  soldText: {
    textDecoration: 'line-through',
    color: '#888',
  },
  soldBadge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    padding: '5px 10px',
    backgroundColor: 'red',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '4px',
  },
};

export default ItemComponent;
