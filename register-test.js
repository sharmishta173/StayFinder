// Using native fetch API in Node.js v18+

async function registerUser() {
  try {
    console.log('Attempting to connect to backend server...');
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'testuser2', // Changed username to avoid potential duplicate
        email: 'testuser2@example.com', // Changed email to avoid potential duplicate
        password: 'password123',
        role: 'guest'
      })
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
  } catch (error) {
    console.error('Error details:');
    console.error('- Message:', error.message);
    console.error('- Cause:', error.cause);
    console.error('- Stack:', error.stack);
  }
}

registerUser();