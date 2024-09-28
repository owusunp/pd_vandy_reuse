// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
    color: #333;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #333;
  }

  a {
    color: #0064d2;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .navbar {
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
  }

  .navbar a {
    margin-right: 1rem;
  }

  .messages-page {
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 1rem;
  }

  .product-listing {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .product-card {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
    cursor: pointer;
  }

  .product-card:hover {
    transform: scale(1.05);
  }

  .product-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-bottom: 1px solid #ccc;
    margin-bottom: 1rem;
  }

  .product-card h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
  }

  .product-card p {
    margin: 0;
  }

  .product-card .price {
    color: #0064d2;
    font-weight: bold;
    font-size: 1.5rem;
    margin-top: 0.5rem;
  }

  .product-card .buy-button {
    background-color: #0064d2;
    color: #fff;
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
  }

  .product-card .buy-button:hover {
    background-color: #004ea7;
  }

  .product-card .bookmark-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
  }
`;

export default GlobalStyles;
