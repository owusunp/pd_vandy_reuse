import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUnreadCount } from '../UnreadCountContext';
import searchIcon from '../assets/images/search.jpeg'; // Import search icon
import cartIcon from '../assets/images/cart.png'; // Import cart icon
import { CATEGORIES } from '../data/categories'; // Import your CATEGORIES
import axios from 'axios';

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: black; /* Vanderbilt dark blue */
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 100vw;
  z-index: 1000;
  transform: translateY(${props => (props.visible ? '0' : '-100%')});
  transition: transform 0.3s ease-in-out;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  position: relative;
  left: -40px;
  top: 8px;
`;

const StyledNavLink = styled(NavLink)`
  color: #FFFFFF;
  text-decoration: none;
  font-weight: bold;

  &.active {
    text-decoration: underline;
  }

  &:hover {
    color: #ECEFF1;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -14px;
  right: -10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 4px 10px;
  font-size: 12px;
`;

const LogoutButton = styled.button`
  background-color: transparent;
  border: none;
  color: white;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    color: #ECEFF1;
  }
  position: relative;
  top: -9px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 400px;
  height: 40px;
`;

const SearchBar = styled.input`
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  outline: none;
  width: 100%;
  height: 30px; /* Set the height to match the button */
  box-sizing: border-box;
  position:relative;
  left:8px;
  font-family: sans-serif;

  &:focus {
    border-color: #B3A369; /* Vanderbilt color */
  }
`;

const SearchButton = styled.button`
  background: url(${searchIcon}) no-repeat center;
  background-size: 20px 20px;
  padding: 10px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 45px; /* Set height to match the search bar */
  box-sizing: border-box;
  outline: none;
  position:relative;
  left: -23px;
`;

const SuggestionsBox = styled.div`
  position: absolute;
  top: 50px;
  left: 8px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 360px;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
`;

const SuggestionRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
  }
`;

const SuggestionImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const SuggestionText = styled.span`
  font-size: 1rem;
  color: #333;
`;

const CartIcon = styled.img`
  width: 40px;
  height: 30px;
  margin-right: 5px;
  position:relative;
  top: -9px;
`;
const CartBadge = styled.span`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 4px 10px;
  font-size: 12px;
`;

const Layout = ({ children, isLoggedIn, onLogout, bookmarks }) => {
  const { unreadCount } = useUnreadCount();
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const navigate = useNavigate();
  const suggestionsBoxRef = useRef(null);
  const lastScrollY = useRef(0);

  const fetchItems = async () => {
    try {
      if (sessionStorage.getItem('items')) {
        return JSON.parse(sessionStorage.getItem('items'));
      }
      const response = await axios.get('http://127.0.0.1:8000/api/v1/items/');
      sessionStorage.setItem('items', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      return [];
    }
  };

  const performSearch = async (searchTerm) => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }

    const items = await fetchItems();
    const pattern = new RegExp(searchTerm, 'gi');
    let filteredItems = items.filter((item) => pattern.test(item.name));

    // If no name match, search categories
    if (filteredItems.length === 0) {
      for (const category of Object.keys(CATEGORIES)) {
        if (pattern.test(category)) {
          filteredItems = items.filter((item) => item.category.includes(category));
          break;
        }
      }
    }

    setSuggestions(filteredItems);
  };

  const handleSuggestionClick = (id) => {
    setSuggestions([]); // Clear suggestions after selecting
    navigate(`/item-details/${id}`); // Navigate to item-details page
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value); // Search happens automatically because of useEffect
    performSearch(e.target.value); // Search as you type
  };

  const handleSearchButtonClick = () => {
    performSearch(searchInput); // Manually trigger search when search button is clicked
  };

  const handleClickOutside = (event) => {
    if (suggestionsBoxRef.current && !suggestionsBoxRef.current.contains(event.target)) {
      setSuggestions([]); // Hide suggestions when clicking outside
    }
  };

  const handleScroll = () => {
    if (window.scrollY < lastScrollY.current) {
      setNavbarVisible(true);
    } else {
      setNavbarVisible(false);
    }
    lastScrollY.current = window.scrollY;
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Navbar visible={navbarVisible}>
        <NavLink to="/" style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 'bold' }}>
          Reuse Vandy
        </NavLink>

        <SearchContainer>
          <SearchBar
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          <SearchButton onClick={handleSearchButtonClick} />
          {suggestions.length > 0 && (
            <SuggestionsBox ref={suggestionsBoxRef}>
              {suggestions.map((item) => (
                <SuggestionRow key={item._id} onClick={() => handleSuggestionClick(item._id)}>
                  <SuggestionImage src={item.list_of_images[0]} alt={item.name} />
                  <SuggestionText>{item.name}</SuggestionText>
                </SuggestionRow>
              ))}
            </SuggestionsBox>
          )}
        </SearchContainer>

        <NavLinks>
          <StyledNavLink to="/" exact="true">Home</StyledNavLink>
          <StyledNavLink to="/notifications" style={{ position: 'relative' }}>
            Notifications
            {unreadCount > 0 && (
              <NotificationBadge>{unreadCount}</NotificationBadge>
            )}
          </StyledNavLink>
          <StyledNavLink to="/messages">Messages</StyledNavLink>
          <StyledNavLink to="/sell-item">Sell Your Item</StyledNavLink>
          <StyledNavLink to="/cart" style={{ position: 'relative' }}>
            <CartIcon src={cartIcon} alt="Cart" />
            {bookmarks.length > 0 && (
              <CartBadge>{bookmarks.length}</CartBadge>
            )}
          </StyledNavLink>
          {isLoggedIn ? (
            <LogoutButton onClick={onLogout}>Logout</LogoutButton>
          ) : (
            <StyledNavLink to="/login">Login</StyledNavLink>
          )}
        </NavLinks>
      </Navbar>
      <main>{children}</main>
    </>
  );
};

export default Layout;