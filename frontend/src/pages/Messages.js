import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Window,
  Thread,
  ChannelList,
} from 'stream-chat-react';
import '../../node_modules/stream-chat-react/dist/css/v2/index.css'; // Stream pre-built CSS

const apiKey = 'wh9yrcrxaqss';

const Messages = () => {
  const [client, setClient] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [otherUserName, setOtherUserName] = useState(''); // Store the username of the person you're texting
  const chatClientRef = useRef(null);
  const location = useLocation(); // To access query params

  useEffect(() => {
    const token = sessionStorage.getItem('streamToken');
    const username = sessionStorage.getItem('username');
    const query = new URLSearchParams(location.search);
    const seller = query.get('to');  // Get the seller from the URL

    if (!username || !token) {
      console.error('Username or token is missing');
      return;
    }

    const initChat = async () => {
      try {
        if (!chatClientRef.current) {
          const chatClient = StreamChat.getInstance(apiKey);
          await chatClient.connectUser(
            { id: username, name: username },
            token
          );

          chatClientRef.current = chatClient; // Persist the chat client instance
          setClient(chatClient);
        }

        if (seller) {
          // Create or fetch the channel between buyer and seller
          const channel = chatClientRef.current.channel('messaging', {
            members: [username, seller],
          });

          await channel.watch();

          setActiveChannel(channel);
          setOtherUserName(seller); // Set the seller's username as the conversation partner
        }
      } catch (error) {
        console.error('Error connecting to chat service:', error);
      }
    };

    initChat();

    return () => {
      if (chatClientRef.current) {
        chatClientRef.current.disconnectUser();
      }
    };
  }, [location.search]); // Re-run when location.search (URL query params) changes

  const handleChannelSelect = (channel) => {
    setActiveChannel(channel);

    // Get the other member's username (the person you're texting)
    const members = Object.values(channel.state.members);
    const otherMember = members.find(
      (member) => member.user.id !== sessionStorage.getItem('username')
    );
    if (otherMember) {
      setOtherUserName(otherMember.user.name || otherMember.user.id); // Display either name or ID if the name is missing
    }
  };

  if (!client) {
    return <div>Loading...</div>;
  }

  const filters = { members: { $in: [sessionStorage.getItem('username')] } };
  const sort = { last_message_at: -1 };

  return (
    <Chat client={client} theme="messaging light">
      <div style={styles.container}>
        {/* Channel list showing users with whom the current user has interacted */}
        <div style={styles.channelList}>
          <ChannelList
            filters={filters}
            sort={sort}
            Preview={(props) => {
              const members = Object.values(props.channel.state.members);
              const otherMember = members.find(
                (member) => member.user.id !== sessionStorage.getItem('username')
              );
              const displayName = otherMember?.user?.name || otherMember?.user?.id || 'user'; // Use name or ID or fallback to 'user'
              return (
                <div
                  onClick={() => handleChannelSelect(props.channel)}
                  style={styles.channelPreview}
                >
                  <img
                    src={
                      props.channel.state.messages[0]?.user?.image ||
                      '/path/to/default-avatar.png'
                    }
                    alt={displayName}
                    style={styles.avatar}
                  />
                  <div style={styles.channelInfo}>
                    <div style={styles.channelName}>
                      {displayName}
                    </div>
                    <div style={styles.lastMessage}>
                      {props.channel.state.messages[0]?.text || 'No messages yet'}
                    </div>
                  </div>
                </div>
              );
            }}
          />
        </div>

        {/* Message window displaying selected conversation */}
        <div style={styles.messageWindow}>
          {activeChannel ? (
            <Channel channel={activeChannel}>
              <Window>
                {/* Display the other user's name here */}
                <div style={styles.headerContainer}>
                  <h2 style={styles.usernameDisplay}>{otherUserName}</h2>
                </div>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          ) : (
            <div style={styles.placeholder}>
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </Chat>
  );
};

// Styles for Instagram-like messaging interface
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
  },
  channelList: {
    width: '30%',
    borderRight: '1px solid #ccc',
    overflowY: 'auto',
  },
  messageWindow: {
    width: '70%',
    padding: '1rem',
  },
  channelPreview: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.3s',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '1rem',
  },
  channelInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  channelName: {
    fontWeight: 'bold',
  },
  lastMessage: {
    color: '#888',
  },
  placeholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    fontSize: '1.2rem',
    color: '#aaa',
  },
  headerContainer: {
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  usernameDisplay: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '10px 0',
  },
};

export default Messages;
