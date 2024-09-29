import React, { useState } from 'react';
import ReplyForm from './ReplyForm';

const RequestItem = ({ request }) => {
  const [showReplies, setShowReplies] = useState(false);

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <div style={styles.requestCard}>
      <h3>{request.poster} is looking for:</h3>
      <p>{request.description}</p>
      <p style={styles.date}>{new Date(request.date_posted).toLocaleString()}</p>
      <button onClick={toggleReplies} style={styles.replyButton}>
        {showReplies ? 'Hide Replies' : 'Show Replies'}
      </button>
      {showReplies && (
        <div style={styles.repliesContainer}>
          {request.replies?.length > 0 ? (
            request.replies.map((reply) => (
              <div key={reply._id} style={styles.reply}>
                <p><strong>{reply.poster}</strong>: {reply.message}</p>
                <p>{new Date(reply.date_posted).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No replies yet.</p>
          )}
          <ReplyForm requestId={request._id} />
        </div>
      )}
    </div>
  );
};

const styles = {
  requestCard: {
    backgroundColor: '#fff',
    padding: '15px',
    margin: '15px 0',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  date: {
    fontSize: '0.85rem',
    color: '#777',
  },
  replyButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 12px',
    cursor: 'pointer',
  },
  repliesContainer: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
  },
  reply: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
};

export default RequestItem;
