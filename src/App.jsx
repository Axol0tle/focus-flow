import { useState } from 'react';
import { supabase } from './supabase';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  // Handle User Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    
    if (error) {
      setError(error.message);
    } else {
      setUser(data.user);
    }
  };

  // Handle User Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      setUser(data.user);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>FocusFlow 🚀</h1>
      <p>Technical Proof of Concept: Supabase Auth</p>

      {error && <p style={{ color: 'red', maxWidth: '300px', textAlign: 'center' }}>{error}</p>}

      {!user ? (
        <form style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ padding: '8px' }}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ padding: '8px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={handleLogin} style={{ padding: '10px 20px', cursor: 'pointer' }}>Login</button>
            <button onClick={handleRegister} style={{ padding: '10px 20px', cursor: 'pointer' }}>Register</button>
          </div>
        </form>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'green' }}>Welcome back, {user.email}!</h3>
          <p>You have successfully authenticated via Supabase.</p>
          <button onClick={handleLogout} style={{ padding: '10px 20px', cursor: 'pointer' }}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;