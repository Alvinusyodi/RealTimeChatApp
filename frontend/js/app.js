const socket = io();

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const chatContainer = document.getElementById('chat-container');
const loginContainer = document.getElementById('login-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messages = document.getElementById('messages');

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (response.ok) {
    const { token } = await response.json();
    localStorage.setItem('token', token);
    socket.emit('join', username);
    loginContainer.style.display = 'none';
    chatContainer.style.display = 'block';
  } else {
    alert('Login failed');
  }
});

// Register
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (response.ok) {
    alert('Registration successful! Please log in.');
  } else {
    alert('Registration failed');
  }
});

// Chat
sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message) {
    socket.emit('sendMessage', message);
    messageInput.value = '';
  }
});

// Receive messages
socket.on('userJoined', (username) => {
  const joinMessage = document.createElement('div');
  joinMessage.textContent = `${username} has joined the chat`;
  joinMessage.style.color = 'green';
  messages.appendChild(joinMessage);
});

socket.on('receiveMessage', ({ username, message }) => {
  const messageElement = document.createElement('div');
  messageElement.innerHTML = `<strong>${username}:</strong> ${message}`;
  messages.appendChild(messageElement);
});
