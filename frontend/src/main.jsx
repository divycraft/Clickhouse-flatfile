import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AuthPage from './components/AuthLogin.jsx'
import { useState } from 'react'

function MainApp() {
  const [user, setUser] = useState(localStorage.getItem('user') || '');
  const [chConfig, setChConfig] = useState({
    token: localStorage.getItem('token') || ''
  });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  // Function to check if user is authenticated
  const isAuthenticated = () => {
    return !!chConfig.token;
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated() ? 
              <Navigate to="/data-ingestion" /> : 
              <AuthPage 
                setUser={setUser} 
                setChConfig={setChConfig} 
                setIsLogin={setIsLogin} 
                isLogin={isLogin} 
                setError={setError} 
              />
          } 
        />
        <Route 
          path="/data-ingestion" 
          element={
            isAuthenticated() ? 
              <App user={user} chConfig={chConfig} /> : 
              <Navigate to="/" />
          } 
        />
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainApp />
  </StrictMode>,
)