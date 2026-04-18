import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, LogOut, User, PlusSquare, BookOpen } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import ThemeToggle from './ThemeToggle';
import ConfirmationModal from './ConfirmationModal';

const Navbar = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    const res = await logout();
    if (res.status) {
      navigate('/login');
    }
  };

  return (
    <nav className="glass" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      height: '70px', 
      zIndex: 900, 
      display: 'flex', 
      alignItems: 'center', 
      padding: '0 40px',
      margin: '20px',
      borderRadius: '20px'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--primary)' }}>
        <BookOpen size={28} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Nebula Blog</h1>
      </Link>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 40px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
          <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search blogs..." 
            className="modern-input" 
            style={{ paddingLeft: '45px', borderRadius: '30px', height: '42px' }}
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <ThemeToggle />
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '1px solid var(--border)', paddingLeft: '20px' }}>
            <Link to="/create-post" style={{ color: 'var(--text)', textDecoration: 'none' }} title="Create Post">
              <PlusSquare size={22} />
            </Link>
            <Link to="/profile" style={{ color: 'var(--text)', textDecoration: 'none' }} title="Profile">
              {user.image ? (
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  overflow: 'hidden',
                  border: '2px solid var(--primary)'
                }}>
                  <img 
                    src={`http://localhost:5000${user.image}`} 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
              ) : (
                <User size={22} />
              )}
            </Link>
            <button 
              onClick={() => setShowLogoutModal(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: 0 }}
              title="Logout"
            >
              <LogOut size={22} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/login" className="text-muted" style={{ textDecoration: 'none', fontWeight: '500' }}>Sign In</Link>
            <Link to="/register" className="text-primary" style={{ textDecoration: 'none', fontWeight: '700' }}>Join</Link>
          </div>
        )}
      </div>

      <ConfirmationModal 
        isOpen={showLogoutModal}
        title="Sign Out?"
        message="Are you sure you want to end your current session?"
        confirmText="Sign Out"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        type="primary"
      />
    </nav>
  );
};

export default Navbar;
