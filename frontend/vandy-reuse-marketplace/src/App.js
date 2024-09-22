import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Bookmarks from './pages/Bookmarks';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SellItem from './pages/SellItem';
import Messages from './pages/Messages';
import ItemDetails from './pages/ItemDetails';
import Notifications from './pages/Notifications';

const App = () => {
  const [bookmarks, setBookmarks] = useState(() => {
    const [notificationCount, setNotificationCount] = useState(() => {
    const savedCount = sessionStorage.getItem('notificationCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
    });
    // Load bookmarks from session storage if available
    const savedBookmarks = sessionStorage.getItem('bookmarks');
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });

  const toggleBookmark = (item) => {
    const isBookmarked = bookmarks.some((bookmark) => bookmark._id === item._id);
    let updatedBookmarks;
    if (isBookmarked) {
      updatedBookmarks = bookmarks.filter((bookmark) => bookmark._id !== item._id);
    } else {
      updatedBookmarks = [...bookmarks, item];
    }
    setBookmarks(updatedBookmarks);
    sessionStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  return (
    <Router>
      <GlobalStyles />
      <Layout>
        <NavBar notificationCount={notificationCount} />
        <Routes>
          <Route
            path="/"
            element={<Home bookmarks={bookmarks} toggleBookmark={toggleBookmark} />}
          />
          <Route
            path="/bookmarks"
            element={<Bookmarks bookmarks={bookmarks} toggleBookmark={toggleBookmark} />}
          />
          <Route path="/item" element={<Dashboard />} />
          <Route path="/item-details/:id" element={<ItemDetails />} />
          <Route path="/sell-item" element={<SellItem />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
