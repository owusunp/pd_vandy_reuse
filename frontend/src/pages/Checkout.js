// src/pages/Checkout.js
import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import items from '../data/Items';

const CheckoutContainer = styled.div`
  padding: 40px 20px;
  text-align: center;
`;

const ItemName = styled.h1`
  color: #000000;
`;

const ItemPrice = styled.p`
  font-size: 24px;
  color: #B3A369;
  margin: 20px 0;
`;

const CheckoutButton = styled.button`
  background-color: #B3A369;
  color: #FFFFFF;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const Checkout = () => {
  const { id } = useParams();
  const item = items.find(item => item.id === parseInt(id));

  const handleCheckout = () => {
    alert(`You have purchased: ${item.name} for $${item.price}`);
  };

  return (
    <CheckoutContainer>
      <ItemName>{item.name}</ItemName>
      <ItemPrice>${item.price}</ItemPrice>
      <CheckoutButton onClick={handleCheckout}>Confirm Purchase</CheckoutButton>
    </CheckoutContainer>
  );
};

export default Checkout;
