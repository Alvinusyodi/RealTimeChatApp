const socket = io();

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

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
    window.location.href = '/index.html'; // Redirect to login page
    } else {
    alert('Registration failed');
    }
});