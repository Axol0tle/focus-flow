export default function Login({ loginWithGoogle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px', fontFamily: 'Arial' }}>
      <p style={{ fontSize: '100px', marginBottom: '40px' }}>FocusFlow</p>
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