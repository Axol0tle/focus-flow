import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Login from './Login';
import Dashboard from './Dashboard';
import OneSignal from 'react-onesignal';

function App() {
  const [user, setUser] = useState(null);

  // For OneSignal
  useEffect(() => {
    const runOneSignal = async () => {
      await OneSignal.init({
        appId: "a6c62313-30aa-487b-8401-ca6b9cf4f1ba", // <-- Put your App ID from Step 1 here!
        allowLocalhostAsSecureOrigin: true, // Needed for local testing
      });
      
      // show the native browser prompt to ask for permission
      OneSignal.Slidedown.promptPush();
    };

    runOneSignal();
  }, []);

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