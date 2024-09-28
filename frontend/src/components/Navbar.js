// src/components/Navbar.js
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NavbarContainer = styled.nav`
  background-color: #000000; // Vanderbilt Black
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 24px;
  color: #B3A369; // Vanderbilt Gold
  font-weight: bold;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: #FFFFFF; // White
  font-size: 18px;
  text-decoration: none;

  &:hover {
    color: #B3A369; // Gold on hover
  }
`;

const Navbar = () => (
  <NavbarContainer>
    <Logo to="/">Reuse Vandy</Logo>
    <NavLinks>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/dashboard">Dashboard</NavLink>
    </NavLinks>
  </NavbarContainer>
);

export default Navbar;
