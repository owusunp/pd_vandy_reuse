const { StreamChat } = require('stream-chat');

// Replace these values with your actual API key, user ID, and token
const apiKey = 'wh9yrcrxaqss'; // Your API key
const userId = 'owusunp'; // Your user ID (for example, 'owusunp')
const userToken = 'your_user_token'; // Make sure this token matches the userId
const channelId = 'messaging'; // The channel type
const channelName = 'prince_dave'; // Use a unique name for the channel

const client = StreamChat.getInstance(apiKey, {
  allowServerSideConnect: true, // Add this option to suppress the warning
});

const testChat = async () => {
  try {
    // Connect the user
    await client.connectUser(
      {
        id: userId,
        name: 'davist', // Provide a name here
      },
      userToken
    );
    console.log('User connected successfully');

    // Create or get the channel
    const channel = client.channel(channelId, channelName, {
      members: [userId, 'owusunp'], // Replace 'davis' with the user you want to contact
    });

    await channel.watch();
    console.log('Channel watched:', channel.id);

    // Send a test message
    const response = await channel.sendMessage({
      text: 'Hello from the terminal!',
    });
    console.log('Message sent:', response);
  } catch (error) {
    console.error('Error in Stream Chat:', error);
  } finally {
    // Disconnect the user
    await client.disconnectUser();
    console.log('User disconnected');
  }
};

testChat();
