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
  Avatar,
  TypingIndicator,
  ReactionSelector, // For adding reactions
  MessageActions, // For message actions
} from 'stream-chat-react';
import '../../node_modules/stream-chat-react/dist/css/v2/index.css'; // Stream pre-built CSS

const apiKey = 'wh9yrcrxaqss';

const Messages = () => {
  const [client, setClient] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const chatClientRef = useRef(null); // Ref to ensure only one instance
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem('streamToken');
    const username = sessionStorage.getItem('username');
    const query = new URLSearchParams(location.search);
    const seller = query.get('to');
    const imageUrl = query.get('image'); // Get the image URL from the query parameters

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

          // Fetch all existing channels for the user
          const filter = { type: 'messaging', members: { $in: [username] } };
          const sort = [{ last_message_at: -1 }];
          const userChannels = await chatClient.queryChannels(filter, sort);

          setChannels(userChannels); // Set all the fetched channels

          // If there is a seller, set up a conversation
          if (seller) {
            const channel = chatClientRef.current.channel('messaging', {
              members: [username, seller],
            });

            await channel.watch();
            setActiveChannel(channel);

            // If an image URL is provided, send it automatically as a message
            if (imageUrl) {
              channel.sendMessage({
                text: "I am interested in this item.",
                attachments: [{ type: 'image', asset_url: imageUrl }],
              });
            }
          }
        }
      } catch (error) {
        console.error('Error connecting to chat service:', error);
      }
    };

    initChat();
  }, [location.search]);

  const handleChannelSelect = (channel) => {
    setActiveChannel(channel);
  };

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <Chat client={client} theme="messaging light">
      <div style={styles.container}>
        {/* Channel list showing all users the current user has interacted with */}
        <div style={styles.channelList}>
          {channels.map((channel) => {
            const members = Object.values(channel.state.members);
            const otherMember = members.find(
              (member) => member.user.id !== sessionStorage.getItem('username')
            );
            const displayName =
              otherMember?.user?.name || otherMember?.user?.id || 'user';
            const unreadCount = channel.countUnread();

            // Get the last message and determine its type
            const lastMessageIndex = channel.state.messages.length - 1;
            const lastMessageObj =
              lastMessageIndex >= 0
                ? channel.state.messages[lastMessageIndex]
                : null;
            let lastMessagePreview = 'Start a conversation'; // Default message if no messages exist

            if (lastMessageObj) {
              if (lastMessageObj.attachments && lastMessageObj.attachments.length > 0) {
                lastMessagePreview = 'Sent a photo';
              } else if (lastMessageObj.text) {
                lastMessagePreview = lastMessageObj.text;
              }
            }

            return (
              <div
                key={channel.id}
                onClick={() => handleChannelSelect(channel)}
                style={styles.channelPreview}
              >
                <div style={styles.avatarContainer}>
                  <Avatar
                    image={otherMember?.user?.image || ''} // Use image if available, fallback to initials
                    name={displayName} // Display initials based on the name if no image
                    size={40}
                    presenceIndicator
                  />
                </div>
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
          })}
        </div>

        {/* Message window displaying selected conversation */}
        <div style={styles.messageWindow}>
          {activeChannel ? (
            <Channel channel={activeChannel}>
              <Window>
                <div style={styles.headerContainer}>
                  <h2 style={styles.usernameDisplay}>
                    {activeChannel?.state?.members?.[1]?.user?.name || 'User'}
                  </h2>
                </div>
                <ChannelHeader />
                <MessageList
                  messageActions={['react', 'reply', 'edit', 'delete', 'pin']}
                  reactionsEnabled
                  showReadStatus
                  typingIndicator={<TypingIndicator channel={activeChannel} />}
                  reactionSelector={(message) => <ReactionSelector message={message} />}
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

// Styles for Avatar and other components
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
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50px',
    height: '50px',
    borderRadius: '50%', // Ensures circular shape
    backgroundColor: '#eee', // Fallback color
    border: '2px solid black', // Added black border
    marginRight: '1rem',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', // Adds a stronger shadow effect
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
