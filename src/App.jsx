import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import ToDoList from './to-do-list';

function App() {
  const [user, setUser] = useState(null);

  // This checks if the user is already logged in when they open the app
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // The single function to trigger Google Login
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  // The function to log out
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // ==========================================
  // PAGE 1: THE LOGIN SCREEN (If not logged in)
  // ==========================================
  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px', fontFamily: 'Arial' }}>
        <h1>FocusFlow 🚀</h1>
        <p style={{ marginBottom: '30px' }}>Please sign in to access your tasks.</p>
        
        <button 
          onClick={loginWithGoogle} 
          style={{ 
            padding: '12px 24px', 
            fontSize: '16px', 
            cursor: 'pointer', 
            backgroundColor: '#4285F4', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontWeight: 'bold'
          }}>
          Sign in with Google
        </button>
      </div>
    );
  }

  // ==========================================
  // PAGE 2: THE WELCOME DASHBOARD (If logged in)
  // ==========================================
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Top Navigation Bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #ccc', paddingBottom: '10px' }}>
        <h2 style={{ margin: 0 }}>FocusFlow</h2>
        <button 
          onClick={handleLogout} 
          style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>
          Logout
        </button>
      </header>
      
      {/* Main Welcome Content */}
      <main style={{ marginTop: '40px' }}>
        {/* Real Name Display From Google*/}
        <h1>Welcome, {user.user_metadata?.full_name || 'User'}! </h1>
        <p>Logged in as: <strong>{user.email}</strong></p>
      </main>

      <ToDoList />

    </div>
  );
}

export default App;