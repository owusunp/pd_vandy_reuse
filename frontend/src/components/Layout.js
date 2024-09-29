import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import searchIcon from '../assets/images/search.jpeg';
import randomLogo from '../assets/images/random-logo.png';
import allIcon from '../assets/images/all-icon.png';
import { CATEGORIES } from '../data/categories';
import axios from 'axios';
import { useUnreadCount } from '../UnreadCountContext';
import { StreamChat } from 'stream-chat';

// Styled Components
const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: black;
  padding: 1rem 2rem;
  color: white;
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

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
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

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.img`
  height: 40px;
  cursor: pointer;
`;

const AllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: black;
  color: white;
  font-weight: bold;
  border: none;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    color: #eceff1;
  }

  img {
    width: 20px;
    height: 20px;
  }
`;

const AllDropdown = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 300px;
  background-color: white;
  color: black;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transform: ${(props) => (props.open ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s ease-in-out;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${(props) => (props.open ? 'block' : 'none')};
`;

const DropdownHeader = styled.div`
  background-color: black;
  color: white;
  padding: 16px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
`;

const DropdownItem = styled.div`
  padding: 16px;
  cursor: pointer;
  &:hover {
    background-color: #f1f1f1;
  }
  font-size: 16px;
  color: black;
  border-bottom: 1px solid #ddd;
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
  height: 30px;
  box-sizing: border-box;
  position:relative;
  left:8px;
  font-family: sans-serif;

  &:focus {
    border-color: #B3A369;
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
  height: 45px;
  box-sizing: border-box;
  outline: none;
  position:relative;
  left: -23px;
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
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

const Layout = ({ children, isLoggedIn, onLogout, onSearch = () => {} }) => {
  const { unreadCount } = useUnreadCount();
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const suggestionsBoxRef = useRef(null);

  useEffect(() => {
    const token = sessionStorage.getItem('streamToken');
    const usernameFromSession = sessionStorage.getItem('username');

    if (token && usernameFromSession) {
      const chatClient = StreamChat.getInstance('wh9yrcrxaqss');
      setUsername(usernameFromSession); // Set username from session storage
    }
  }, []);

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
      onSearch(''); // Clear the search in Home
      return;
    }

    const items = await fetchItems();
    const pattern = new RegExp(searchTerm, 'gi');
    let filteredItems = items.filter((item) => pattern.test(item.name));

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
    setSuggestions([]);
    navigate(`/item-details/${id}`);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    performSearch(e.target.value);
  };

  const handleSearchButtonClick = () => {
    performSearch(searchInput);
  };

  const handleClickOutside = (event) => {
    if (suggestionsBoxRef.current && !suggestionsBoxRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <Navbar>
        <NavLeft>
          <Logo src={randomLogo} alt="Logo" onClick={() => navigate('/')} />
          <AllButton onClick={handleDropdownToggle}>
            <img src={allIcon} alt="All" /> All
          </AllButton>
        </NavLeft>

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
          <StyledNavLink to="/notifications" style={{ position: 'relative' }}>
            Notifications
            {unreadCount > 0 && (
              <NotificationBadge>{unreadCount}</NotificationBadge>
            )}
          </StyledNavLink>
          <StyledNavLink to="/messages">Messages</StyledNavLink>
          <StyledNavLink to="/sell-item">Sell Your Item</StyledNavLink>
          <StyledNavLink to="/bookmarks">Cart</StyledNavLink>
        </NavLinks>
      </Navbar>

      <Overlay open={dropdownOpen} onClick={closeDropdown} />

      <AllDropdown open={dropdownOpen}>
        <DropdownHeader>
          Hello, {username}
          <CloseButton onClick={closeDropdown}>&times;</CloseButton>
        </DropdownHeader>
        <DropdownItem onClick={() => navigate('/my-items')}>Items You Selling</DropdownItem>
        <DropdownItem onClick={() => navigate('/change-profile')}>Change Profile</DropdownItem>
        <DropdownItem onClick={onLogout}>Logout</DropdownItem>
      </AllDropdown>

      <main>{children}</main>
    </>
  );
};

export default Layout;
