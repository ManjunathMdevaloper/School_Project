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
        { name: 'Student Data', path: '/manage' },
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
          <span className="logo-mark">7V</span>
          <span className="logo-text">7Veda Management</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links desktop-only">
          {navLinks.map((link) => (
            link.dropdown ? (
              <div key={link.name} className="nav-dropdown-container">
                <span
                  className={`nav-link ${isDropdownActive(link.dropdown) ? 'active' : ''}`}
                >
                  {link.name} <i className="chevron-down"></i>
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
            {isDarkMode ? '☼' : '☾'}
          </button>

          {userRole === 'admin' && (
            <div
              className="notification-container"
              onMouseEnter={() => setIsNotificationOpen(true)}
              onMouseLeave={() => setIsNotificationOpen(false)}
            >
              <button className="notification-icon">
                <span className="bell-ico">🔔</span>
                {pendingOutpasses.length > 0 && (
                  <span className="notification-count">
                    {pendingOutpasses.length}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="notification-dropdown">
                  <h4 className="notif-title">Today's Requests</h4>
                  {pendingOutpasses.length === 0 ? (
                    <p className="notif-empty">No pending requests.</p>
                  ) : (
                    <div className="notif-list">
                      {pendingOutpasses.map(outpass => (
                        <div key={outpass.id} className="notif-item">
                          <div className="notif-header">
                            <p className="notif-name">{outpass.studentName}</p>
                            <span className="notif-class">{outpass.class}</span>
                          </div>
                          <p className="notif-reason">{outpass.reason}</p>
                          <div className="notif-actions">
                            <button onClick={() => updateOutpassStatus(outpass.id, 'Approved')} className="notif-btn notif-btn-approve">Approve</button>
                            <button onClick={() => updateOutpassStatus(outpass.id, 'Rejected')} className="notif-btn notif-btn-reject">Reject</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <button onClick={logout} className="btn-logout">Logout</button>
        </div>

        {/* Mobile Toggle */}
        <div className="mobile-only">
          {userRole === 'admin' && (
            <div
              className="notification-container"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <button className="notification-icon">
                <span className="bell-ico">🔔</span>
                {pendingOutpasses.length > 0 && (
                  <span className="notification-count">
                    {pendingOutpasses.length}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="notification-dropdown mobile-notif-dropdown">
                  <h4 className="notif-title">Today's Requests</h4>
                  {pendingOutpasses.length === 0 ? (
                    <p className="notif-empty">No pending requests.</p>
                  ) : (
                    <div className="notif-list">
                      {pendingOutpasses.map(outpass => (
                        <div key={outpass.id} className="notif-item">
                          <div className="notif-header">
                            <p className="notif-name">{outpass.studentName}</p>
                            <span className="notif-class">{outpass.class}</span>
                          </div>
                          <p className="notif-reason">{outpass.reason}</p>
                          <div className="notif-actions">
                            <button onClick={() => updateOutpassStatus(outpass.id, 'Approved')} className="notif-btn notif-btn-approve">Approve</button>
                            <button onClick={() => updateOutpassStatus(outpass.id, 'Rejected')} className="notif-btn notif-btn-reject">Reject</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <button onClick={toggleTheme} className="theme-toggle">{isDarkMode ? '☼' : '☾'}</button>
          <button className="menu-toggle" onClick={() => { setIsMenuOpen(!isMenuOpen); setIsNotificationOpen(false); }}>
            <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}></div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          link.dropdown ? (
            <React.Fragment key={link.name}>
              <div className="mobile-dropdown-title">{link.name}</div>
              {link.dropdown.map(subLink => (
                <Link key={subLink.name} to={subLink.path} className={`mobile-nav-link ${isActive(subLink.path) ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>{subLink.name}</Link>
              ))}
            </React.Fragment>
          ) : (
            <Link key={link.name} to={link.path} className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>{link.name}</Link>
          )
        ))}
        <button onClick={logout} className="mobile-nav-link text-danger">Logout</button>
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--glass-border);
          padding: 1.25rem 0;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }

        .logo-mark {
          background: var(--primary-color);
          color: white;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          font-weight: 800;
          font-family: var(--font-main);
        }

        .dark .logo-mark { color: #0F172A; }

        .logo-text {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          font-weight: 600;
          color: var(--text-secondary);
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .nav-link:hover, .nav-link.active {
          color: var(--primary-color);
        }

        /* Dropdown */
        .nav-dropdown-container { position: relative; }
        
        .nav-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(15px);
          background: var(--glass-bg);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          padding: 0.75rem;
          min-width: 200px;
          box-shadow: var(--glass-shadow);
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100;
        }

        .nav-dropdown-container:hover .nav-dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(8px);
        }

        .dropdown-item {
          padding: 0.8rem 1.25rem;
          margin-bottom: 2px;
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s;
          display: block;
        }

        .dropdown-item:hover, .dropdown-item.active {
          background: rgba(197, 160, 89, 0.12);
          color: var(--secondary-color);
          padding-left: 1.5rem;
        }

        .dark .dropdown-item:hover { background: rgba(255,255,255,0.05); }

        .theme-toggle {
          background: none;
          border: none;
          font-size: 1.4rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: color 0.3s;
        }

        .theme-toggle:hover { color: var(--secondary-color); }

        /* Notifications */
        .notification-container { position: relative; }
        .notification-icon { background: none; border: none; font-size: 1.25rem; cursor: pointer; position: relative; }
        .notification-count {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ff4757;
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          width: 350px;
          background: var(--glass-bg);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          padding: 1.5rem;
          margin-top: 12px;
          z-index: 101;
          animation: modalScaleUp 0.3s var(--ease-out-expo);
        }

        .notif-title { font-family: var(--font-serif); margin: 0 0 1rem 0; color: var(--primary-color); }
        .notif-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .notif-item { background: rgba(150,150,150,0.1); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--glass-border); }
        .notif-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .notif-name { font-weight: 700; font-size: 0.95rem; margin: 0; color: var(--text-primary); }
        .notif-class { font-size: 0.75rem; font-weight: 700; background: var(--secondary-color); color: white; padding: 2px 8px; border-radius: 4px; }
        .notif-reason { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.4; }
        .notif-actions { display: flex; gap: 0.75rem; }
        .notif-btn { flex: 1; border: 1px solid transparent; padding: 0.6rem; border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .notif-btn-approve { background: var(--success-bg); color: var(--success-text); border-color: var(--success-text); }
        .notif-btn-approve:hover { background: var(--success-text); color: white; }
        .notif-btn-reject { background: var(--error-bg); color: var(--error-text); border-color: var(--error-text); }
        .notif-btn-reject:hover { background: var(--error-text); color: white; }

        .btn-logout {
          background: var(--error-bg);
          border: 1px solid var(--error-text);
          color: var(--error-text);
          padding: 0.6rem 1.25rem;
          border-radius: var(--radius-sm);
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-logout:hover { background: var(--error-text); color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2); }

        /* Mobile */
        .mobile-only { display: none; align-items: center; gap: 1rem; }
        .menu-toggle { background: none; border: none; width: 30px; height: 20px; position: relative; cursor: pointer; }
        .hamburger { width: 100%; height: 2px; background: var(--text-primary); transition: all 0.3s; }
        .hamburger::before, .hamburger::after { content: ''; width: 100%; height: 2px; background: var(--text-primary); position: absolute; left: 0; transition: all 0.3s; }
        .hamburger::before { top: -8px; }
        .hamburger::after { top: 8px; }
        .hamburger.open { background: transparent; }
        .hamburger.open::before { transform: rotate(45deg); top: 0; }
        .hamburger.open::after { transform: rotate(-45deg); top: 0; }

        .mobile-menu {
          position: fixed;
          top: 5rem;
          left: 0;
          width: 100%;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          padding: 1.5rem;
          border-bottom: 1px solid var(--glass-border);
          transform: translateY(-110%);
          transition: transform 0.4s ease;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-menu.open { transform: translateY(0); }
        .mobile-nav-link { padding: 0.8rem 1rem; color: var(--text-secondary); text-decoration: none; font-weight: 600; border-radius: var(--radius-sm); }
        .mobile-nav-link.active { background: rgba(0,0,0,0.05); color: var(--primary-color); }
        .text-danger { color: #ef4444 !important; }

        @media (max-width: 992px) {
          .desktop-only { display: none; }
          .mobile-only { display: flex; }
          .mobile-notif-dropdown {
            position: fixed;
            top: 5rem;
            right: 0.5rem;
            left: 0.5rem;
            width: auto;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
