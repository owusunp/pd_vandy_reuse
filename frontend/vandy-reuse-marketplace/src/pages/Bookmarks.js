import React from 'react';
import { Link } from 'react-router-dom';

const Bookmarks = ({ bookmarks, toggleBookmark }) => {
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Bookmarked Items</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {bookmarks.map((item) => (
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
                src={require('../assets/images/bookmark-icon.png').default}
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

export default Bookmarks;
