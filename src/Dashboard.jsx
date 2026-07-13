import ToDoList from './to-do-list';
import './App.css';
import OneSignal from 'react-onesignal';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react'; 

export default function Dashboard({ user, handleLogout }) {
  // state to track if they are subscribed
  const [isSubscribed, setIsSubscribed] = useState(false);

  // useEffect to check status and listen for the allow button
  useEffect(() => {
    // check if they are ALREADY subscribed when they load the page
    if (OneSignal.User.PushSubscription.optedIn) {
      setIsSubscribed(true);
    }

    // listen for the exact moment they click "Allow" in the browser
    const handleSubscriptionChange = (event) => {
      setIsSubscribed(event.current.optedIn);
    };

    OneSignal.User.PushSubscription.addEventListener('change', handleSubscriptionChange);

    return () => {
      OneSignal.User.PushSubscription.removeEventListener('change', handleSubscriptionChange);
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Top Navigation Bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #ccc', paddingBottom: '10px' }}>
        <h2 style={{ margin: 0 }}>FocusFlow</h2>
        <button className='logout' onClick={handleLogout}>
          Logout
        </button>
      </header>
      
      {/* Main Welcome Content */}
      <main style={{ marginTop: '40px' }}>
        {/* Real Name Display From Google*/}
        <h1>Welcome, {user.user_metadata?.full_name || 'User'}! </h1>
        <p>Logged in as: <strong>{user.email}</strong></p>
      </main>

      {/* The conditionally rendered notification card */}
      {!isSubscribed && (
        <div style={{ 
          padding: '24px', 
          backgroundColor: '#43faeb', 
          border: '10px solid #006eff', 
          borderRadius: '30px', 
          marginBottom: '20px',
          marginTop: '20px',
          textAlign: 'center' 
        }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>Never miss a task!</h3>
          <p style={{ margin: '0 0 16px 0', color: '#64748b' }}>
            Turn on reminders to get pinged when a task is due.
          </p>
          
          <button 
            onClick={() => OneSignal.User.PushSubscription.optIn()}
            style={{ 
              backgroundColor: '#267bca', 
              color: 'white', 
              padding: '10px 24px', 
              borderRadius: '8px', 
              border: 'none', 
              fontWeight: 'bold',
              cursor: 'pointer' 
            }}
          >
            Enable Notifications
          </button>
        </div>
      )}

      <ToDoList />

    </div>
  );
}