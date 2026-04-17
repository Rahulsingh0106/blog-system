import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await login(email, password);
      if (res.status) {
        navigate('/');
      } else {
        setError(res.msg || "Invalid credentials");
      }
    } catch (err) {
      setError("System connection failed. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center min-h-screen w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass" 
        style={{ width: '100%', maxWidth: '440px', padding: '40px' }}
      >
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Sign In</h2>
          <p className="text-muted">Enter your email and password to access your account</p>
        </div>
        
        {error && (
          <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#ef4444', marginBottom: '20px', fontSize: '0.85rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '8px' }}>
              Email Address
            </label>
            <input 
              type="email" 
              className="modern-input" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500' }}>
                Password
              </label>
              <a href="#" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}>
                Forgot password?
              </a>
            </div>
            <input 
              type="password" 
              className="modern-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="modern-button" disabled={loading} style={{ marginTop: '12px' }}>
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: '32px', fontSize: '0.9rem', textAlign: 'center' }}>
          <span className="text-muted">Don't have an account? </span>
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;