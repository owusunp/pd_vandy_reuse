// src/pages/Sell.js

import React, { useState } from 'react';

const Sell = () => {
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate saving the data
    console.log('Product submitted:', form);
    alert('Product listed for sale!');
    setForm({ name: '', description: '', price: '', image: '' });
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Sell Your Item</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Product Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Description:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
          ></textarea>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Price:</label>
          <input
            type="text"
            name="price"
            value={form.price}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Upload Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: URL.createObjectURL(e.target.files[0]) })}
            required
            style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#041E42', color: 'white' }}>
          List Item for Sale
        </button>
      </form>
    </div>
  );
};

export default Sell;
