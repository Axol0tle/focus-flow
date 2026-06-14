import ToDoList from './to-do-list';
import './App.css';

export default function Dashboard({ user, handleLogout }) {
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