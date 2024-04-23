const io = require('socket.io-client');

// Replace with the URL of your NestJS WebSocket server
const serverUrl = 'http://localhost:3333'; // Modify as needed

// Replace with your JWT token
const jwtToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYsImVtYWlsIjoibGlua2RhZ2d5QGdtYWlsLmNvbSIsInJvbGUiOiJlbnRyZXByZW5ldXIiLCJpYXQiOjE3MTM4MjM1NjIsImV4cCI6MTcxMzgyNDQ2Mn0.8ET-ECXuin0HjKM27ubjOOQCfzvZzbJ5TfGgj52bQp0';

// Create a WebSocket client connection to the server
const socket = io(serverUrl, {
  // Include the JWT token in the auth header
  auth: {
    token: `Bearer ${jwtToken}`,
  },
});

// Event listener for connection
socket.on('connect', () => {
  console.log('Connected to server');

  // Replace with the conversationId you want to join
  const conversationId = 1;

  // Join the room
  socket.emit('joinRoom', { userId: 1, conversationId });

  // Listen for the 'conversationJoined' event to confirm the user has joined the room
  socket.on('conversationJoined', (data) => {
    console.log('Conversation joined:', data);

    // Send a message
    sendMessage(conversationId, 'Hello, this is a test message!');
  });

  // Listen for the 'newMessage' event to see messages from other users
  socket.on('newMessage', (message) => {
    console.log('New message received:', message);
  });
});

// Function to send a message
function sendMessage(conversationId, content) {
  const senderId = 1; // Replace with your sender ID

  // Emit a 'sendMessage' event with the message data
  socket.emit('sendMessage', {
    senderId,
    conversationId,
    content,
  });
}

// Event listener for disconnection
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
