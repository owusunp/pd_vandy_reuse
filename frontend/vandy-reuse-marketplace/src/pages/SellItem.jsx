import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Move this styles to a separate file
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if there is an error message
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
      category: "Miscellaneous",
    };
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/items/', newItem);
      newItem._id = response.data; // Assuming the response contains the new item's ID
  
      // Create a notification
      const newNotification = {
        poster: userName,
        description: `New item posted: ${itemName}`,
        date_posted: new Date().toISOString(),
        is_read: false,
      };
  
      await axios.post('http://127.0.0.1:8000/api/v1/notifications/sell_notification', newNotification);
  
      // Retrieve existing items from sessionStorage
      const storedItems = sessionStorage.getItem('items');
      let itemsArray = storedItems ? JSON.parse(storedItems) : [];
  
      // Add the new item to the items array
      itemsArray.push(newItem);
  
      // Store the updated items array in sessionStorage
      sessionStorage.setItem('items', JSON.stringify(itemsArray));
      alert("Item posted successfully!");
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