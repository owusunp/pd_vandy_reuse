import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useUnreadCount } from '../UnreadCountContext';

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: black; /* Vanderbilt dark blue */
  padding: 1rem 2rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
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
`;

const Layout = ({ children, isLoggedIn, onLogout }) => {
  const { unreadCount } = useUnreadCount();

  return (
    <>
      <Navbar>
        <NavLink to="/" style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 'bold' }}>
          Reuse Vandy
        </NavLink>
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
          <StyledNavLink to="/bookmarks">View Bookmarks</StyledNavLink>
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
