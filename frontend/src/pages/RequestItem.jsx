import React, { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Avatar,
} from 'stream-chat-react';
import '../../node_modules/stream-chat-react/dist/css/v2/index.css'; // Stream pre-built CSS

const apiKey = 'wh9yrcrxaqss'; // Replace with your Stream.io API key
const channelId = 'public-chat-channel'; // Unique ID for the public channel

const RequestItem = () => {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const initChat = async () => {
      const userToken = sessionStorage.getItem('streamToken'); // Assume Stream token is stored in sessionStorage
      const userName = sessionStorage.getItem('username');

      if (!userToken || !userName) {
        alert('User not authenticated.');
        return;
      }

      // Check if there's an existing client
      if (client && client.userID !== userName) {
        // Disconnect previous user if switching accounts
        await client.disconnectUser();
        setClient(null); // Reset client state
      }

      if (!client) {
        const chatClient = StreamChat.getInstance(apiKey);

        try {
          await chatClient.connectUser(
            {
              id: userName,
              name: userName,
            },
            userToken
          );

          setClient(chatClient);
          setUsername(userName);

          const newChannel = chatClient.channel('livestream', channelId, {
            name: 'Public Item Requests Channel',
          });

          await newChannel.watch();
          setChannel(newChannel);
        } catch (error) {
          console.error('Error connecting to chat:', error);
        }
      }
    };

    initChat();
  }, [client, channel]);

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
            {/* Custom Circle Avatar */}
            <div style={styles.avatarContainer}>
              <Avatar
                image={client.user?.image} // Use the user image if available
                name={client.user?.name || username} // Display initials based on the name if no image
                size={50} // Adjust the size of the avatar
              />
            </div>
            <MessageList messageFilters={{ limit: 100 }} />
            <MessageInput placeholder="Type your request here..." />
          </Window>
        </Channel>
      </Chat>
    </div>
  );
};

// Styles for Avatar and other components
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
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    borderRadius: '50%', // Makes the container circular
    backgroundColor: '#eee', // Background color for the avatar circle
    margin: '20px auto', // Center the avatar with some margin
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)', // Optional: Adds a soft shadow effect
  },
};

export default RequestItem;
