// src/data/Chats.js

export const users = [
    { id: 1, name: "Alice", avatar: "/path/to/avatar1.jpg" },
    { id: 2, name: "Bob", avatar: "/path/to/avatar2.jpg" },
    { id: 3, name: "Charlie", avatar: "/path/to/avatar3.jpg" },
  ];
  
  export const chats = {
    1: [
      { sender: "Alice", text: "Hey! How's it going?", timestamp: "10:00 AM" },
      { sender: "Me", text: "I'm good, thanks! How about you?", timestamp: "10:02 AM" },
    ],
    2: [
      { sender: "Bob", text: "Do you still have the textbook?", timestamp: "9:30 AM" },
      { sender: "Me", text: "Yes, I do.", timestamp: "9:35 AM" },
    ],
    3: [
      { sender: "Charlie", text: "Can we meet today?", timestamp: "Yesterday" },
      { sender: "Me", text: "Sure, let's meet at the library.", timestamp: "Yesterday" },
    ],
  };
  