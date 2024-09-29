import React from 'react';
import ItemComponent from '../components/ItemComponent'; 

const Bookmarks = ({ bookmarks, toggleBookmark }) => {
  return (
    <div style={{ padding: '2rem', maxWidth: '100vw', marginTop: '70px'}}>
      <h1>Bookmarked Items</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
        {bookmarks.map((item) => (
          item && item._id && (
            <ItemComponent
              key={item._id}
              item={item}
              bookmarks={bookmarks}
              toggleBookmark={toggleBookmark}
              style={{ height: '300px', width: '320px', overflow: 'hidden' }} 
            />
          )
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;