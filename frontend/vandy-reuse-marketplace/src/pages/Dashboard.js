// src/pages/Dashboard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import items from '../data/Items';

const DashboardContainer = styled.div`
  padding: 40px 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: #000000;
  margin-bottom: 40px;
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const ItemCard = styled.div`
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
`;

const ItemImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ItemName = styled.h2`
  font-size: 20px;
  color: #000000;
  margin: 20px 0;
`;

const AddItemButton = styled(Link)`
  display: inline-block;
  background-color: #B3A369;
  color: #FFFFFF;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-size: 18px;
  margin-top: 20px;
  text-align: center;
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <Title>Your Items</Title>
      <ItemsGrid>
        {items.map(item => (
          <ItemCard key={item.id}>
            <ItemImage src={item.image} alt={item.name} />
            <ItemName>{item.name}</ItemName>
          </ItemCard>
        ))}
      </ItemsGrid>
      <AddItemButton to="/sell-item">Add New Item</AddItemButton>
    </DashboardContainer>
  );
};

export default Dashboard;
