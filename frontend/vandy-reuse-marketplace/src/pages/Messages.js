// src/pages/Messages.js

import React, { useState } from 'react';
import messagesData from '../data/messages';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className="messages-page" style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '1rem', background: '#f5f5f5' }}>
        <h2>Conversations</h2>
        <ul>
          {messagesData.map((chat) => (
            <li
              key={chat.id}
              style={{
                padding: '0.5rem',
                borderBottom: '1px solid #ccc',
                cursor: 'pointer',
                fontWeight: selectedChat && selectedChat.id === chat.id ? 'bold' : 'normal',
              }}
              onClick={() => handleChatSelect(chat)}
            >
              {chat.participants.join(' & ')}
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                {chat.messages[chat.messages.length - 1].text}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ width: '70%', padding: '1rem' }}>
        {selectedChat ? (
          <div>
            <h2>Chat with {selectedChat.participants.join(' & ')}</h2>
            <div style={{ border: '1px solid #ccc', padding: '1rem', height: '80vh', overflowY: 'scroll' }}>
              {selectedChat.messages.map((message, index) => (
                <div key={index} style={{ margin: '1rem 0' }}>
                  <strong>{message.sender}</strong>
                  <p>{message.text}</p>
                  <p style={{ fontSize: '0.8rem', color: '#666' }}>{message.timestamp}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem' }}>
              <input
                type="text"
                placeholder="Type your message"
                style={{ width: '80%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <button style={{ padding: '0.5rem', marginLeft: '1rem', backgroundColor: '#0064d2', color: '#fff', border: 'none', borderRadius: '4px' }}>Send</button>
            </div>
          </div>
        ) : (
          <p>Select a conversation to start chatting.</p>
        )}
      </div>
    </div>
  );
};

export default Messages;
