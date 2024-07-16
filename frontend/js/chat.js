const socket = io();
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messages = document.getElementById('messages');
const logoutLink = document.getElementById('logout-link');

// Check if user is logged in
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');
if (!token || !username) {
  window.location.href = 'index.html';
} else {
  // Emit join event after login
  socket.emit('join', username);
}

// Logout functionality
logoutLink.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = 'index.html';
});

// Chat functionality
sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message) {
    socket.emit('sendMessage', { username, message });
    addMessage({ username, message, sent: true });
    messageInput.value = '';
  }
});

// Function to add message to chat container
function addMessage({ username, message, sent = false }) {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message');
  if (sent) {
    messageContainer.classList.add('sent-message');
  } else {
    messageContainer.classList.add('received-message');
  }

  const usernameElement = document.createElement('div');
  usernameElement.classList.add('username');
  usernameElement.textContent = username;

  const messageElement = document.createElement('div');
  messageElement.classList.add('message-text');
  messageElement.textContent = message;

  messageContainer.appendChild(usernameElement);
  messageContainer.appendChild(messageElement);
  messages.appendChild(messageContainer);
  messages.scrollTop = messages.scrollHeight; // Scroll to the bottom
}

// Receive messages
socket.on('userJoined', (username) => {
  const joinMessage = document.createElement('div');
  joinMessage.classList.add('join-message');
  joinMessage.textContent = `${username} has joined the chat`;
  joinMessage.style.color = 'green';
  messages.appendChild(joinMessage);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('receiveMessage', ({ username: sender, message }) => {
  if (sender !== username) {
    addMessage({ username: sender, message });
  }
});
