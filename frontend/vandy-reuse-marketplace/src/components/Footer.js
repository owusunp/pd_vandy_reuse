// src/components/Footer.js

import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #000000;
  color: #FFFFFF;
  text-align: center;
  padding: 2rem;
  margin-top: 2rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; 2024 Reuse Vandy. All Rights Reserved.</p>
    </FooterContainer>
  );
};

export default Footer;
