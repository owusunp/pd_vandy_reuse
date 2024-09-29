// src/pages/SellItem.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useItems } from '../ItemsContext'; // Import the context
import { CATEGORIES } from '../data/categories';

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
  color: #333;
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
    border-color: #B3A369;
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
    border-color: #B3A369;
  }
`;

const SubmitButton = styled.button`
  padding: 1rem;
  font-size: 1.25rem;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #a8955c;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const ImageList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ImageListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  background-color: #f0f0f0;
  padding: 0.5rem;
  border-radius: 5px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: red;
  font-size: 1rem;
  cursor: pointer;
`;

const SellItem = () => {
  const { setItems } = useItems(); // Get setItems from context
  const [itemName, setItemName] = useState('');
  const [userName, setUserName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length < 1) {
      setErrorMessage('You need to upload at least one image.');
    } else if (images.length + selectedFiles.length > 3) {
      setErrorMessage('You can only upload a maximum of 3 images.');
    } else {
      setImages(prevImages => [...prevImages, ...selectedFiles]);
      setErrorMessage('');
    }
  };

  const handleRemoveImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const uploadImages = async (images) => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('files', image);
    });

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/upload/', formData);
      return response.data.imageUrls; // Assuming the response contains the URLs of the uploaded images
    } catch (error) {
      console.error('Error uploading images:', error.response ? error.response.data : error.message);
      throw new Error('Failed to upload images.');
    }
  };

const findCategories = (name, description) => {
  // Combine item name and description into a single string to search for keywords
  const combinedText = `${name.toLowerCase()} ${description.toLowerCase()}`;

  // Initialize an array to store matching categories
  const matchedCategories = [];

  // Loop through the CATEGORIES to find all matches
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    for (const keyword of keywords) {
      if (combinedText.includes(keyword.toLowerCase())) {
        // If the category hasn't been added yet, push it to the list
        if (!matchedCategories.includes(category)) {
          matchedCategories.push(category);
        }
      }
    }
  }

  // Return the list of matched categories, or "Miscellaneous" if none are found
  return matchedCategories.length > 0 ? matchedCategories : ["Miscellaneous"];
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length < 1 || images.length > 3) {
      alert("Please resolve the errors before submitting.");
      return;
    }

    const imageUrls = await uploadImages(images);
    const newItem = {
      name: itemName,
      description,
      vendor: userName,
      price: `$${price}`,
      list_of_images: imageUrls,
      date_posted: new Date().toISOString().split('T')[0],
      sold: false,
      category: findCategories(itemName, description),
    };
    const newNotification = {
      poster: userName,
      description: `${description.substring(0, 50)}.`,
      date_posted: new Date().toISOString(),
      is_read: false,
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/items/', newItem);
      newItem._id = response.data; // Assuming the response contains the new item's ID

      // Update the items context with the new item
      setItems(prevItems => [...prevItems, newItem]);

      alert("Item posted successfully!");
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/v1/notifications/sell_notification', newNotification);
        if (response.status === 200) {

        }
      }
      catch (error) {
        console.error('Error posting notification:', error.response ? error.response.data : error.message);
        alert('Error posting notification');
      }
    } catch (error) {
      console.error('Error creating item:', error.response ? error.response.data : error.message);
      alert("Failed to post item.");
    }
    setUserName('');
    setItemName('');
    setDescription('');
    setPrice('');
    setImages([]);
    setErrorMessage('');
  };

  return (
    <SellItemContainer>
      <Title>Sell Your Item</Title>
      <Form onSubmit={handleSubmit}>
        <Label>Enter your name</Label>
        <Input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
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
          multiple accept="image/*"
          onChange={handleImageChange}
          required
        />
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <ImageList>
          {images.map((image, index) => (
            <ImageListItem key={index}>
              {image.name}
              <RemoveButton onClick={() => handleRemoveImage(index)}>X</RemoveButton>
            </ImageListItem>
          ))}
        </ImageList>
        <SubmitButton type="submit">Post Item</SubmitButton>
      </Form>
    </SellItemContainer>
  );
};

export default SellItem;
