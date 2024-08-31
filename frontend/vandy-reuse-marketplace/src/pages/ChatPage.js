// src/pages/ChatPage.js

import React, { useState } from 'react';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { users, chats } from '../data/Chats';

const ChatPage = () => {
  const [selectedUserId, setSelectedUserId] = useState(users[0].id);

  return (
    <div className="chat-page">
      <ChatList
        users={users}
        onSelectUser={setSelectedUserId}
        selectedUserId={selectedUserId}
        chats={chats}
      />
      <ChatWindow
        chatHistory={chats[selectedUserId]}
        userName={users.find(user => user.id === selectedUserId).name}
      />
    </div>
  );
};

export default ChatPage;
