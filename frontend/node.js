const StreamChat = require('stream-chat').StreamChat;

const serverClient = StreamChat.getInstance('wh9yrcrxaqss', 'cqkmutnzs62cb9eqsnn24c6zvyem7m63uu6d37hbmr2s5vxvzyhsdubzcdze9muu');

// Replace 'user-id' with the actual user ID you want to generate a token for
const token = serverClient.createToken('owusunp');

console.log(token);
