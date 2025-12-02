// src/ui/DashboardTiles.jsx
import React from 'react';
import '../styles/dashboard.css';
import { Link } from 'react-router-dom';

export default function DashboardTiles(){
  const tiles = [
    { to: '/students', title: 'Student Directory', desc: 'View & manage students', icon:'👥' },
    { to: '/attendance', title: 'Attendance', desc: 'Mark & review attendance', icon:'🕘' },
    { to: '/marks', title: 'Marks & Exams', desc: 'Subject-wise marks', icon:'📝' },
    { to: '/marks-import', title: 'Import Marks', desc: 'CSV importer', icon:'📁' },
    { to: '/outpass', title: 'Outpass Requests', desc: 'Apply & manage outpasses', icon:'✉️' },
    { to: '/overview', title: 'Overview', desc: 'Quick student snapshot', icon:'📊' },
  ];

  return (
    <div className="tiles-root">
      {tiles.map(t => (
        <Link to={t.to} className="tile-card" key={t.title}>
          <div className="tile-icon">{t.icon}</div>
          <div className="tile-body">
            <div className="tile-title">{t.title}</div>
            <div className="tile-desc">{t.desc}</div>
          </div>
          <div className="tile-arrow">›</div>
        </Link>
      ))}
    </div>
  );
}
