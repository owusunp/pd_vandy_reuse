// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Bookmarks from './pages/Bookmarks';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SellItem from './pages/SellItem'; 
import Messages from './pages/Messages'; // Import the Messages component

function App() {
  const [bookmarks, setBookmarks] = useState([]);

  const toggleBookmark = (item) => {
    if (bookmarks.includes(item)) {
      setBookmarks(bookmarks.filter((bookmark) => bookmark !== item));
    } else {
      setBookmarks([...bookmarks, item]);
    }
  };

  return (
    <Router>
      <GlobalStyles />
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<Home bookmarks={bookmarks} toggleBookmark={toggleBookmark} />}
          />
          <Route
            path="/bookmarks"
            element={<Bookmarks bookmarks={bookmarks} toggleBookmark={toggleBookmark} />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sell-item" element={<SellItem />} />
          <Route path="/messages" element={<Messages />} /> {/* Ensure this route exists */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
