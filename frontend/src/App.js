import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Bookmarks from './pages/Bookmarks';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SellItem from './pages/SellItem';
import Messages from './pages/Messages';
import ItemDetails from './pages/ItemDetails';
import Notifications from './pages/Notifications';
import { UnreadCountProvider } from './UnreadCountContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ChatPage from './pages/ChatPage';
import { ItemsProvider } from './ItemsContext';
import ItemsYouSelling from './components/ItemsYouSelling'; // Import the new ItemsYouSelling component

const App = () => {
  const [bookmarks, setBookmarks] = useState(() => {
    const savedBookmarks = sessionStorage.getItem('bookmarks');
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });

  const [notificationCount] = useState(() => {
    const savedCount = sessionStorage.getItem('notificationCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('authToken') ? true : false;
  });

  const navigate = useNavigate();

  const handleLogin = (username, token) => { 
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('username', username);
    setIsLoggedIn(true);
    navigate('/');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('streamToken');
    setIsLoggedIn(false);
    navigate('/login');
  };

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

  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <>
      <GlobalStyles />
      <UnreadCountProvider>
        <ItemsProvider>
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUpPage onSignUp={handleLogin} />} />
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <Layout notificationCount={notificationCount} isLoggedIn={isLoggedIn} onLogout={handleLogout}>
                    <Routes>
                      <Route path="/" element={<Home bookmarks={bookmarks} toggleBookmark={toggleBookmark} />} />
                      <Route path="/bookmarks" element={<Bookmarks bookmarks={bookmarks} toggleBookmark={toggleBookmark} />} />
                      <Route path="/sell-item" element={<SellItem />} />
                      <Route path="/messages" element={<Messages />} />
                      <Route path="/chat/:channelId" element={<ChatPage />} />
                      <Route path="/item" element={<Dashboard />} />
                      <Route path="/item-details/:id" element={<ItemDetails />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/my-items" element={<ItemsYouSelling />} /> {/* Add MyItemsPage route */}
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </ItemsProvider>
      </UnreadCountProvider>
    </>
  );
};

export default App;
