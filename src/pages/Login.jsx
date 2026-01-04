import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    // Simulate a brief delay for a better animation feel
    setTimeout(() => {
      if (login(username, password)) {
        navigate('/');
      } else {
        setIsLoggingIn(false);
        setError('Invalid username or password');
      }
    }, 1500);
  };

  return (
    <div className="login-container">
      {isLoggingIn && (
        <div className="loading-overlay">
          <div className="loader"></div>
          <div className="loading-text">AUTHENTICATING</div>
        </div>
      )}
      <div className="login-card fade-in">
        <h1 className="login-title">Welcome</h1>
        <p className="login-subtitle">7Veda School Portal</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Login
          </button>
        </form>
      </div>

      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 90vh;
          background: transparent;
        }
        .login-card {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 3rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--glass-shadow);
          width: 100%;
          max-width: 450px;
          border: 1px solid var(--glass-border);
          transition: all 0.3s var(--ease-out-expo);
        }
        
        .login-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .login-title {
          font-family: var(--font-serif);
          font-size: 2.5rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 0.25rem;
          color: var(--primary-color);
        }
        .login-subtitle {
          text-align: center;
          color: var(--text-secondary);
          margin-bottom: 2.5rem;
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 1px;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9rem;
        }
        .form-control {
          width: 100%;
          padding: 0.9rem 1.2rem;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(0,0,0,0.1);
          background-color: rgba(255,255,255,0.05);
          color: var(--text-primary);
          transition: all 0.3s;
          font-size: 1rem;
        }
        .dark .form-control {
           border: 1px solid rgba(255,255,255,0.1);
        }
        .form-control:focus {
          outline: none;
          border-color: var(--secondary-color);
          background-color: rgba(255,255,255,0.1);
        }
        .btn-block {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
          font-weight: 700;
          margin-top: 1rem;
          background: var(--primary-color);
          color: white;
          border-radius: var(--radius-sm);
          transition: all 0.3s;
          cursor: pointer;
        }
        .dark .btn-block { color: #0F172A; }
        .btn-block:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .error-message {
          background-color: #fee2e2;
          color: #b91c1c;
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          margin-bottom: 1.5rem;
          text-align: center;
          font-size: 0.875rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default Login;
