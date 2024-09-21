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

function App() {
  const [bookmarks, setBookmarks] = useState([]);

  const toggleBookmark = (item) => {
    if (bookmarks.includes(item)) {
      setBookmarks(bookmarks.filter((bookmark) => bookmark !== item));
      return false;
    } else {
      setBookmarks([...bookmarks, item]);
      return true;
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
