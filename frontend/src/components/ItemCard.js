// src/components/ItemCard.js

import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 16px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const Description = styled.p`
  margin: 8px 0;
  font-size: 14px;
  color: #555;
`;

const Price = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #000;
`;

const ItemCard = ({ item }) => (
  <Card>
    <Image src={item.imageUrl} alt={item.name} />
    <Content>
      <Title>{item.name}</Title>
      <Description>{item.description}</Description>
      <Price>{item.price}</Price>
    </Content>
  </Card>
);

export default ItemCard;
