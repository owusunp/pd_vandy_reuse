import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Channel, ChannelHeader, MessageList, MessageInput } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';

const client = StreamChat.getInstance('wh9yrcrxaqss');

const ChatPage = () => {
  const { channelId } = useParams();
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const streamToken = sessionStorage.getItem('streamToken');
    const username = sessionStorage.getItem('username');

    if (streamToken && username) {
      client.connectUser({ id: username }, streamToken).then(() => {
        const selectedChannel = client.channel('messaging', channelId);
        setChannel(selectedChannel);
      });
    }
  }, [channelId]);

  if (!channel) return <div>Loading...</div>;

  return (
    <div>
      <Channel channel={channel}>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Channel>
    </div>
  );
};

export default ChatPage;
