// SignUpPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignUpPage = ({ onSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Register the user
      await axios.post('http://localhost:8000/api/v1/register', {
        username,
        password,
      });

      // After sign up, automatically log the user in by requesting a token
      const loginResponse = await axios.post('http://localhost:8000/api/v1/login', {
        username,
        password,
      });

      const { username: loggedInUsername, streamToken } = loginResponse.data;

      // Ensure both username and token are present before storing them
      if (!loggedInUsername || !streamToken) {
        throw new Error('Username or streamToken is missing from login response');
      }

      // Store the correct values in sessionStorage
      sessionStorage.setItem('username', loggedInUsername); // Store the actual username
      sessionStorage.setItem('streamToken', streamToken); // Store the token correctly

      // Call the onSignUp function passed from App.js
      onSignUp(loggedInUsername, streamToken); // (username, token)

      // Redirect to homepage or any other page after successful signup
      navigate('/');
    } catch (error) {
      console.error('Sign up error:', error);
      setErrorMessage('Sign up failed. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Sign Up</h2>
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
        <button type="submit" style={styles.button}>Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login" style={styles.link}>Login here</Link></p>
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
    backgroundColor: '#28a745',
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
    color: '#28a745',
    textDecoration: 'none',
  },
};

export default SignUpPage;
