// src/components/Layout.js

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0D324D; /* Vanderbilt dark blue */
  padding: 1rem 2rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: #FFFFFF;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    color: #ECEFF1;
  }
`;

const Layout = ({ children }) => {
  return (
    <>
      <Navbar>
        <Link to="/" style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 'bold' }}>
          Reuse Vandy
        </Link>
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/messages">Messages</NavLink>
          <NavLink to="/sell-item">Sell Your Item</NavLink>
          <NavLink to="/bookmarks">View Bookmarks</NavLink>
        </NavLinks>
      </Navbar>
      <main>{children}</main>
    </>
  );
};

export default Layout;
