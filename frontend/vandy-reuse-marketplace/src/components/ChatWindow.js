// src/components/ChatWindow.js

import React, { useState } from 'react';

const ChatWindow = ({ chatHistory, userName }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    // Here you would update the chatHistory with the new message.
    setNewMessage('');
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>Chat with {userName}</h2>
      </div>
      <div className="chat-history">
        {chatHistory.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender === 'Me' ? 'me' : ''}`}>
            <div className="message-text">{message.text}</div>
            <div className="message-timestamp">{message.timestamp}</div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
