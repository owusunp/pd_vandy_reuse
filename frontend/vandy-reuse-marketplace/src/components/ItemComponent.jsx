import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bookmarkIcon from '../assets/images/bookmark-icon.png';
import notBookmarkedIcon from '../assets/images/notBookmark.png';

const ItemComponent = ({ item, bookmarks, toggleBookmark, style }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  let isBookmarked = bookmarks.some((bookmark) => bookmark._id === item._id);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % item.list_of_images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + item.list_of_images.length) % item.list_of_images.length);
  };

  const handleBookmarkClick = () => {
    isBookmarked = toggleBookmark(item);
  };

  return (
    <div key={item._id} style={{ ...style, border: '1px solid #ccc', padding: '1rem', position: 'relative' }}>
      <Link to={`/item-details/${item._id}`} style={{ textDecoration: 'none', color: '#000' }}>
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
        onClick={handleBookmarkClick}
      >
        <img
          src={isBookmarked ? bookmarkIcon : notBookmarkedIcon}
          alt="Bookmark"
          style={{
            width: '24px',
            height: '24px',
           
          }}
        />
      </button>
    </div>
  );
};

export default ItemComponent;