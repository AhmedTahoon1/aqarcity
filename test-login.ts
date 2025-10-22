import fetch from 'node-fetch';

async function testLogin() {
  try {
    const response = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@aqarcity.ae',
        password: 'admin123!'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful');
      console.log('User:', data.user);
      console.log('Token:', data.accessToken.substring(0, 50) + '...');
      console.log('\n🔧 Run this in browser console:');
      console.log(`localStorage.setItem('token', '${data.accessToken}');`);
    } else {
      console.log('❌ Login failed:', data);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin();