// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/sidebar.css';

export default function Sidebar() {
  return (
    <aside className="app-sidebar">
      <div className="brand">
        <div className="brand-mark">7VM</div>
        <div className="brand-name">7Veda Management</div>
      </div>

      <nav className="side-nav">
        <NavLink to="/" className="nav-item" end>
          <span className="ico">🏠</span><span className="label">Home</span>
        </NavLink>

        <NavLink to="/overview" className="nav-item">
          <span className="ico">📊</span><span className="label">Overview</span>
        </NavLink>

        <NavLink to="/students" className="nav-item">
          <span className="ico">👥</span><span className="label">Students</span>
        </NavLink>

        <NavLink to="/attendance" className="nav-item">
          <span className="ico">🕘</span><span className="label">Attendance</span>
        </NavLink>

        <NavLink to="/marks" className="nav-item">
          <span className="ico">📝</span><span className="label">Marks</span>
        </NavLink>

        <NavLink to="/marks-import" className="nav-item">
          <span className="ico">📁</span><span className="label">Import</span>
        </NavLink>

        <NavLink to="/outpass" className="nav-item">
          <span className="ico">✉️</span><span className="label">Outpass</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="small">CBSE • Aff:130522</div>
      </div>
    </aside>
  );
}
