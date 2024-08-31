import React, { useState } from 'react';
import styled from 'styled-components';

const SellItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f9f9f9;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #B3A369; // Vanderbilt color
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: bold;
`;

const PriceInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PriceInputSymbol = styled.span`
  padding: 0.75rem;
  font-size: 1rem;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-right: none;
  border-radius: 5px 0 0 5px;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  &:focus {
    outline: none;
    border-color: #B3A369; // Vanderbilt color
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #B3A369; // Vanderbilt color
  }
`;

const SubmitButton = styled.button`
  padding: 1rem;
  font-size: 1.25rem;
  background-color: #B3A369; // Vanderbilt color
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #a8955c;
  }
`;

const SellItem = ({ addItem }) => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      name: itemName,
      description,
      price: `$${price}`,
      image: URL.createObjectURL(image),
      category: "Miscellaneous"
    };

    // Save item to localStorage
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    storedItems.push(newItem);
    localStorage.setItem('items', JSON.stringify(storedItems));

    addItem(newItem);
    setItemName('');
    setDescription('');
    setPrice('');
    setImage(null);
    alert("Item posted successfully!");
  };

  return (
    <SellItemContainer>
      <Title>Sell Your Item</Title>
      <Form onSubmit={handleSubmit}>
        <Label>Item Name</Label>
        <Input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />

        <Label>Description</Label>
        <TextArea
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <Label>Price</Label>
        <PriceInputContainer>
          <PriceInputSymbol>$</PriceInputSymbol>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ borderRadius: '0 5px 5px 0' }}
          />
        </PriceInputContainer>

        <Label>Upload Image</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <SubmitButton type="submit">Post Item</SubmitButton>
      </Form>
    </SellItemContainer>
  );
};

export default SellItem;
