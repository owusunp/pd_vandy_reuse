import React, { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
} from 'stream-chat-react';
import '../../node_modules/stream-chat-react/dist/css/v2/index.css'; // Stream pre-built CSS
import { useNavigate } from 'react-router-dom';

const apiKey = 'wh9yrcrxaqss'; // Replace with your Stream.io API key
const channelId = 'public-chat-channel'; // Unique ID for the public channel

const RequestItem = () => {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const initChat = async () => {
      const userToken = sessionStorage.getItem('streamToken'); // Assume Stream token is stored in sessionStorage
      const userName = sessionStorage.getItem('username');

      if (!userToken || !userName) {
        alert('User not authenticated.');
        return;
      }

      const chatClient = StreamChat.getInstance(apiKey);

      try {
        await chatClient.connectUser(
          {
            id: userName,
            name: userName,
          },
          userToken
        );

        const channel = chatClient.channel('livestream', channelId, {
          name: 'Public Item Requests Channel',
        });

        await channel.watch();

        setClient(chatClient);
        setChannel(channel);
        setUsername(userName);
      } catch (error) {
        console.error('Error connecting to chat:', error);
      }
    };

    initChat();

    return () => {
      // Ensure the client disconnects only if it has been initialized
      if (client) {
        client.disconnectUser();
      }
    };
  }, []);

  if (!client || !channel) {
    return <div>Loading chat...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Public Item Request Chat</h1>

      <Chat client={client} theme="messaging light">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader title="Public Item Requests" />
            <MessageList messageFilters={{ limit: 100 }} />
            <MessageInput placeholder="Type your request here..." />
          </Window>
        </Channel>
      </Chat>
    </div>
  );
};

// Inline styles to customize the appearance
const styles = {
  container: {
    padding: '2rem',
    maxWidth: '100vw',
    backgroundColor: '#f5f8fa',
    fontFamily: 'Arial, sans-serif',
    marginTop: '70px',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    textAlign: 'center',
    color: '#333',
  },
};

export default RequestItem;
