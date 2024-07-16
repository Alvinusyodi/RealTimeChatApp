const socket = io();

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

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
    localStorage.setItem('username', username); // Save username for later use
    window.location.href = 'chat.html'; // Redirect to chat.html
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
    alert('Registration successful! Redirecting to login page.');
    window.location.href = '/login'; // Redirect to login page
  } else {
    alert('Registration failed');
  }
});

