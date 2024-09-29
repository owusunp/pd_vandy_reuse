// LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { BACKEND_URL } from '../config';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post( `${BACKEND_URL}/api/v1/login`, {
        username,
        password,
      });

      const { username: loggedInUsername, streamToken } = response.data;

      // Ensure both username and token are present before storing them
      if (!loggedInUsername || !streamToken) {
        throw new Error('Username or streamToken is missing from server response');
      }

      // Store the correct values in sessionStorage
      sessionStorage.setItem('username', loggedInUsername); // Store the actual username
      sessionStorage.setItem('streamToken', streamToken); // Store the token correctly

      // Call the onLogin function passed from App.js
      onLogin(loggedInUsername, streamToken); // (username, token)

      // Redirect to homepage or any other page after successful login
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Login failed. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup" style={styles.link}>Sign up here</Link></p>
    </div>
  );
};

// Styles for the form
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '300px',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    width: '100%',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default LoginPage;
