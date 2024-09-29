import React, { useState } from 'react';
import axios from 'axios';

const ReplyForm = ({ requestId }) => {
  const [message, setMessage] = useState('');

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`http://localhost:8000/api/v1/requests/${requestId}/reply`, {
        poster: sessionStorage.getItem('username'),
        message,
      });

      setMessage('');
      alert('Reply posted successfully!');
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  return (
    <form onSubmit={handleReplySubmit} style={styles.form}>
      <textarea
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your reply..."
        required
        style={styles.textarea}
      />
      <button type="submit" style={styles.submitButton}>Reply</button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '10px',
  },
  textarea: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    resize: 'vertical',
  },
  submitButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 12px',
    cursor: 'pointer',
  },
};

export default ReplyForm;
