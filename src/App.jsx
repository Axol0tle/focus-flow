import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Login from './Login';
import Dashboard from './Dashboard';

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

  if (!user) {
    return <Login loginWithGoogle={loginWithGoogle} />;
  }

  return <Dashboard user={user} handleLogout={handleLogout} />;
}

export default App;