// src/components/Header.js

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #000000;
  color: #FFFFFF;
`;

const Logo = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  color: #B3A369;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 1.5rem;

  a {
    color: #FFFFFF;
    font-weight: bold;
    transition: color 0.3s ease;

    &:hover {
      color: #B3A369;
    }
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>Reuse Vandy</Logo>
      <NavLinks>
        <Link to="/">Home</Link>
        <Link to="/messages">Messages</Link>
        <Link to="/sell">Sell Your Item</Link>
      </NavLinks>
    </HeaderContainer>
  );
};

export default Header;
