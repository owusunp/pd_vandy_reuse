// src/components/ChatList.js

import React from 'react';

const ChatList = ({ users, onSelectUser, selectedUserId, chats }) => {
  return (
    <div className="chat-list">
      {users.map((user) => {
        const lastMessage = chats[user.id].slice(-1)[0];
        return (
          <div
            key={user.id}
            className={`chat-list-item ${selectedUserId === user.id ? 'selected' : ''}`}
            onClick={() => onSelectUser(user.id)}
          >
            <img src={user.avatar} alt={user.name} className="avatar" />
            <div className="chat-info">
              <div className="chat-name">{user.name}</div>
              <div className={`chat-preview ${lastMessage.sender !== 'Me' ? 'unread' : ''}`}>
                {lastMessage.text}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
