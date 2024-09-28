// src/data/messages.js

const messages = [
    {
      id: 1,
      participants: ['buyer1', 'seller1'],
      messages: [
        { sender: 'buyer1', text: 'Is this item still available?', timestamp: '2024-08-01 10:00' },
        { sender: 'seller1', text: 'Yes, it is!', timestamp: '2024-08-01 10:05' },
        { sender: 'buyer1', text: 'Great! What’s the condition?', timestamp: '2024-08-01 10:10' },
      ],
    },
    {
      id: 2,
      participants: ['buyer2', 'seller2'],
      messages: [
        { sender: 'buyer2', text: 'Can you ship this to me?', timestamp: '2024-08-02 14:00' },
        { sender: 'seller2', text: 'Yes, but shipping costs extra.', timestamp: '2024-08-02 14:10' },
      ],
    },
    // Add more conversation data as needed
  ];
  
  export default messages;
  