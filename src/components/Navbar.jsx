import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useStudents } from '../context/StudentContext';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { logout, userRole } = useAuth();
  const { outpasses, updateOutpassStatus } = useStudents();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const location = useLocation();

  const today = new Date().toISOString().split('T')[0];
  const pendingOutpasses = outpasses.filter(o => o.status === 'Pending' && o.timestamp.startsWith(today));

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Students', path: '/students' },
    { name: 'Overview', path: '/overview' },
    { name: 'Outpass', path: '/outpass' },
    {
      name: 'Manage',
      dropdown: [
        { name: 'Attendance', path: '/attendance' },
        { name: 'Marks', path: '/marks' },
        userRole === 'admin' && { name: 'Schedules', path: '/schedules' },
        { name: 'Manage Student Data', path: '/manage' },
      ].filter(Boolean)
    },
  ];

  const isActive = (path) => location.pathname === path;

  const isDropdownActive = (dropdown) => {
    return dropdown.some(item => isActive(item.path));
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/home" className="logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">7Veda Management</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links desktop-only">
          {navLinks.map((link) => (
            link.dropdown ? (
              <div key={link.name} className="nav-dropdown-container">
                <span
                  className={`nav-link ${isDropdownActive(link.dropdown) ? 'active' : ''}`}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  {link.name} <span style={{ fontSize: '0.7rem' }}>▼</span>
                </span>
                <div className="nav-dropdown-menu">
                  {link.dropdown.map(subLink => (
                    <Link
                      key={subLink.name}
                      to={subLink.path}
                      className={`dropdown-item ${isActive(subLink.path) ? 'active' : ''}`}
                    >
                      {subLink.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            )
          ))}

          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {userRole === 'admin' && (
            <div
              className="notification-container"
              style={{ position: 'relative' }}
              onMouseEnter={() => setIsNotificationOpen(true)}
              onMouseLeave={() => setIsNotificationOpen(false)}
            >
              <button
                className="notification-icon"
                style={{ position: 'relative', marginRight: '1rem', fontSize: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                🔔
                {pendingOutpasses.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {pendingOutpasses.length}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="notification-dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  width: '320px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  padding: '1rem',
                  zIndex: 1003,
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Today's Requests</h4>
                  {pendingOutpasses.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>No pending requests for today.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {pendingOutpasses.map(outpass => (
                        <div key={outpass.id} style={{ padding: '0.75rem', background: 'var(--bg-accent)', borderRadius: '0.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>{outpass.studentName}</p>
                            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{outpass.class}</span>
                          </div>
                          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <strong>Reason:</strong> {outpass.reason}
                          </p>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => updateOutpassStatus(outpass.id, 'Approved')}
                              style={{ flex: 1, padding: '0.25rem', fontSize: '0.8rem', background: '#dcfce7', color: '#15803d', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateOutpassStatus(outpass.id, 'Rejected')}
                              style={{ flex: 1, padding: '0.25rem', fontSize: '0.8rem', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            onClick={logout}
            className="btn btn-sm btn-outline"
            style={{ marginLeft: '1rem', borderColor: '#ef4444', color: '#ef4444' }}
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="mobile-only">
          <button
            onClick={toggleTheme}
            className="theme-toggle mobile-theme-toggle"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {userRole === 'admin' && (
            <div
              className="notification-container"
              style={{ position: 'relative' }}
            >
              <button
                className="notification-icon"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                style={{ position: 'relative', marginRight: '0.5rem', fontSize: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                🔔
                {pendingOutpasses.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {pendingOutpasses.length}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="notification-dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  right: '-50px',
                  width: '280px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  padding: '1rem',
                  zIndex: 1003,
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Today's Requests</h4>
                  {pendingOutpasses.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>No pending requests for today.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {pendingOutpasses.map(outpass => (
                        <div key={outpass.id} style={{ padding: '0.75rem', background: 'var(--bg-accent)', borderRadius: '0.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>{outpass.studentName}</p>
                            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{outpass.class}</span>
                          </div>
                          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <strong>Reason:</strong> {outpass.reason}
                          </p>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => updateOutpassStatus(outpass.id, 'Approved')}
                              style={{ flex: 1, padding: '0.25rem', fontSize: '0.8rem', background: '#dcfce7', color: '#15803d', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateOutpassStatus(outpass.id, 'Rejected')}
                              style={{ flex: 1, padding: '0.25rem', fontSize: '0.8rem', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          link.dropdown ? (
            <div key={link.name} className="mobile-dropdown-group">
              <div className="mobile-dropdown-title">{link.name}</div>
              {link.dropdown.map(subLink => (
                <Link
                  key={subLink.name}
                  to={subLink.path}
                  className={`mobile-nav-link sub-link ${isActive(subLink.path) ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {subLink.name}
                </Link>
              ))}
            </div>
          ) : (
            <Link
              key={link.name}
              to={link.path}
              className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          )
        ))}
        <button
          onClick={() => {
            setIsMenuOpen(false);
            logout();
          }}
          className="mobile-nav-link"
          style={{ textAlign: 'left', color: '#ef4444', width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          backdrop-filter: blur(10px);
          transition: background-color 0.3s ease;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 4.5rem;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 800;
          font-size: 1.5rem;
          color: var(--primary-color);
        }

        .logo-icon {
          font-size: 2rem;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          font-weight: 500;
          color: var(--text-secondary);
          transition: color 0.2s ease;
          position: relative;
        }

        .nav-link:hover, .nav-link.active {
          color: var(--primary-color);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--primary-color);
          border-radius: 2px;
        }

        /* Dropdown Styles */
        .nav-dropdown-container {
            position: relative;
            height: 100%;
            display: flex;
            align-items: center;
        }

        .nav-dropdown-menu {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 0.5rem;
            padding: 0.5rem;
            min-width: 220px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            z-index: 1002;
        }

        .nav-dropdown-container:hover .nav-dropdown-menu {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
        }

        .dropdown-item {
            padding: 0.75rem 1rem;
            border-radius: 0.375rem;
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 0.9rem;
            white-space: nowrap;
            transition: all 0.2s;
            display: block;
        }

        .dropdown-item:hover, .dropdown-item.active {
            background-color: var(--bg-accent);
            color: var(--primary-color);
        }

        .theme-toggle {
          font-size: 1.25rem;
          padding: 0.5rem;
          border-radius: 50%;
          background-color: var(--bg-accent);
          color: var(--text-primary);
          transition: transform 0.2s ease;
        }

        .theme-toggle:hover {
          transform: rotate(15deg);
        }

        .mobile-only {
          display: none;
          align-items: center;
          gap: 1rem;
        }

        .menu-toggle {
          width: 30px;
          height: 20px;
          position: relative;
          z-index: 1001;
        }

        .hamburger {
          display: block;
          width: 100%;
          height: 2px;
          background-color: var(--text-primary);
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          transition: all 0.3s ease;
        }

        .hamburger::before, .hamburger::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          background-color: var(--text-primary);
          transition: all 0.3s ease;
        }

        .hamburger::before { top: -8px; }
        .hamburger::after { top: 8px; }

        .hamburger.open { background-color: transparent; }
        .hamburger.open::before { transform: rotate(45deg); top: 0; }
        .hamburger.open::after { transform: rotate(-45deg); top: 0; }

        .mobile-menu {
          position: fixed;
          top: 4.5rem;
          left: 0;
          width: 100%;
          background-color: var(--bg-secondary);
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          transform: translateY(-150%);
          transition: transform 0.3s ease;
          z-index: 999;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: calc(100vh - 4.5rem);
          overflow-y: auto;
        }

        .mobile-menu.open {
          transform: translateY(0);
        }

        .mobile-nav-link {
          padding: 0.75rem;
          border-radius: 0.5rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .mobile-nav-link:hover, .mobile-nav-link.active {
          background-color: var(--bg-accent);
          color: var(--primary-color);
        }

        .mobile-dropdown-group {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            background-color: rgba(0,0,0,0.02);
            border-radius: 0.5rem;
            padding: 0.5rem;
        }
        .mobile-dropdown-title {
            font-weight: bold;
            color: var(--text-primary);
            padding: 0.5rem 0.75rem;
            opacity: 0.8;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .mobile-nav-link.sub-link {
            padding-left: 1.5rem;
            font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-only { display: flex; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
