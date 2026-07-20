import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Login from './Login';
import Dashboard from './Dashboard';
import OneSignal from 'react-onesignal';

function App() {
  const [user, setUser] = useState(null);

  // For OneSignal - Setup and Prompt
  useEffect(() => {
    const runOneSignal = async () => {
      try {
        // wake up OneSignal in the background
        await OneSignal.init({
          appId: "a6c62313-30aa-487b-8401-ca6b9cf4f1ba", 
          allowLocalhostAsSecureOrigin: true, 
        });
      } catch (error) {
        // catch the error if React tries to initialize it twice, and just ignore it
      }

    };

    runOneSignal();
  }, [user]); // adding user tells React to run check again once they log in

  // Save OneSignal ID to Supabase
  useEffect(() => {
    // if user is logged in
    if (!user) return;

    const handleSubscriptionChange = async (event) => {
      // check if they just opted in (clicked "Allow")
      if (event.current.optedIn) {
        const onesignalId = event.current.id; 
        console.log("Success! Your OneSignal ID is:", onesignalId);

        // update the user's row in Supabase
        const { data, error } = await supabase
          .from('profiles') 
          .upsert({
            id: user.id,
            onesignal_id: onesignalId 
          })
          .select();
            

        if (error) {
          console.error("Error saving to Supabase:", error);
        } else {
          console.log("Saved ID to database successfully!");
        }
      }
    };

    // tell onesignal to listen for the user clicking "Allow"
    OneSignal.User.PushSubscription.addEventListener('change', handleSubscriptionChange);

    // cleanup listener when component unmounts
    return () => {
      OneSignal.User.PushSubscription.removeEventListener('change', handleSubscriptionChange);
    };
  }, [user]);

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