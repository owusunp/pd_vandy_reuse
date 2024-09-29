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
  Avatar, // Import Avatar component
  TypingIndicator, // Typing indicator feature
} from 'stream-chat-react';
import '../../node_modules/stream-chat-react/dist/css/v2/index.css'; // Stream pre-built CSS

const apiKey = 'wh9yrcrxaqss';

const Messages = () => {
  const [client, setClient] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [otherUserName, setOtherUserName] = useState('');
  const chatClientRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem('streamToken');
    const username = sessionStorage.getItem('username');
    const query = new URLSearchParams(location.search);
    const seller = query.get('to');

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

          chatClientRef.current = chatClient;
          setClient(chatClient);
        }

        if (seller) {
          const channel = chatClientRef.current.channel('messaging', {
            members: [username, seller],
          });

          await channel.watch();

          setActiveChannel(channel);
          setOtherUserName(seller);
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
  }, [location.search]);

  const handleChannelSelect = (channel) => {
    setActiveChannel(channel);

    const members = Object.values(channel.state.members);
    const otherMember = members.find(
      (member) => member.user.id !== sessionStorage.getItem('username')
    );
    if (otherMember) {
      setOtherUserName(otherMember.user.name || otherMember.user.id);
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
              const displayName =
                otherMember?.user?.name || otherMember?.user?.id || 'user';
              const unreadCount = props.channel.countUnread();

              // Get the last message and determine its type
              const lastMessageIndex = props.channel.state.messages.length - 1;
              const lastMessageObj =
                lastMessageIndex >= 0
                  ? props.channel.state.messages[lastMessageIndex]
                  : null;
              let lastMessagePreview = 'Start a conversation'; // Default message if no messages exist

              if (lastMessageObj) {
                if (lastMessageObj.attachments && lastMessageObj.attachments.length > 0) {
                  // If the last message has attachments (e.g., an image), show "Sent a photo"
                  lastMessagePreview = 'Sent a photo';
                } else if (lastMessageObj.text) {
                  // Otherwise, show the text of the message
                  lastMessagePreview = lastMessageObj.text;
                }
              }

              return (
                <div
                  onClick={() => handleChannelSelect(props.channel)}
                  style={styles.channelPreview}
                >
                  <Avatar
                    name={displayName}
                    size={40}
                    userId={otherMember?.user?.id}
                    presenceIndicator
                  />
                  <div style={styles.channelInfo}>
                    <div
                      style={{
                        fontWeight: unreadCount > 0 ? 'bold' : 'normal',
                      }}
                    >
                      {displayName}
                      {unreadCount > 0 && (
                        <span style={styles.unreadBadge}>{unreadCount}</span>
                      )}
                    </div>
                    <div style={styles.lastMessage}>
                      {lastMessagePreview}
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
                <div style={styles.headerContainer}>
                  <h2 style={styles.usernameDisplay}>{otherUserName}</h2>
                </div>
                <ChannelHeader />
                <MessageList
                  messageActions={['react', 'reply', 'edit', 'delete', 'pin']}
                  reactionsEnabled
                  showReadStatus
                  typingIndicator={<TypingIndicator channel={activeChannel} />}
                />
                <MessageInput
                  mentionAutocomplete
                  reactionsEnabled
                  attachmentsEnabled
                  giphyEnabled
                />
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
  lastMessage: {
    color: '#888',
  },
  unreadBadge: {
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 8px',
    marginLeft: '8px',
    fontSize: '0.8rem',
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