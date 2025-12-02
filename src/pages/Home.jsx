import React from 'react';
import { Link } from 'react-router-dom';
import { useStudents } from '../context/StudentContext';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { students } = useStudents();
  const { userRole } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container text-center">
          <div className="school-badge animate-float">
            <span className="logo-icon">🏫</span>
          </div>
          <h1 className="hero-title animate-fade-in">
            <span className="text-gradient">7Veda</span> Management
          </h1>
          <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Innovating Education for Tomorrow's Leaders
          </p>

          <div className="school-details-grid animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="detail-item">
              <span className="label">Affiliation No</span>
              <span className="value">999999 (CBSE)</span>
            </div>
            <div className="detail-item">
              <span className="label">Status</span>
              <span className="value">Senior Secondary</span>
            </div>
            <div className="detail-item">
              <span className="label">Trust</span>
              <span className="value">7Veda Management Trust</span>
            </div>
          </div>
        </div>
        <div className="hero-bg-glow"></div>
      </section>

      {/* Dashboard Grid */}
      <section className="section dashboard-section">
        <div className="container">
          <h2 className="section-title text-center mb-5">Management Portal</h2>

          <div className="grid grid-cols-3">
            {/* Student List Card */}
            <Link to="/students" className="card dashboard-card">
              <div className="card-icon">👥</div>
              <h3>Student List</h3>
              <p>
                {userRole === 'admin'
                  ? 'Manage student records, add new admissions, and view class lists.'
                  : 'View student records and class lists.'}
              </p>
              <div className="card-stat">
                <span className="stat-value">{students.length}</span>
                <span className="stat-label">Total Students</span>
              </div>
            </Link>

            {/* Attendance Card */}
            <Link to="/attendance" className="card dashboard-card">
              <div className="card-icon">📅</div>
              <h3>Attendance</h3>
              <p>Mark daily attendance, track absenteeism, and manage intimation records.</p>
              <div className="card-action">Mark Now &rarr;</div>
            </Link>

            {/* Marks Card */}
            <Link to="/marks" className="card dashboard-card">
              <div className="card-icon">📊</div>
              <h3>Marks & Results</h3>
              <p>Update subject-wise marks, import results, and track academic performance.</p>
              <div className="card-action">Update Marks &rarr;</div>
            </Link>

            {/* Outpass Card */}
            <Link to="/outpass" className="card dashboard-card">
              <div className="card-icon">🚪</div>
              <h3>Outpass System</h3>
              <p>Issue and track student outpasses for campus exit permissions.</p>
              <div className="card-action">Issue Outpass &rarr;</div>
            </Link>

            {/* Overview Card */}
            <Link to="/overview" className="card dashboard-card">
              <div className="card-icon">👤</div>
              <h3>Student Overview</h3>
              <p>Comprehensive 360° view of individual student performance and history.</p>
              <div className="card-action">View Profile &rarr;</div>
            </Link>

            {/* Contact/Support Card */}
            <Link to="/contact" className="card dashboard-card support-card">
              <div className="card-icon">📞</div>
              <h3>School Support</h3>
              <p>Need help? Contact administration or technical support.</p>
              <div className="contact-mini">
                <small>+1 234 567 8900</small>
                <small>support@7vedamanagement.edu</small>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .hero-section {
          position: relative;
          padding: 6rem 0 4rem;
          overflow: hidden;
          background: radial-gradient(circle at top center, var(--bg-accent) 0%, var(--bg-primary) 70%);
        }

        .hero-bg-glow {
          position: absolute;
          top: -50%;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(9, 132, 227, 0.1) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .school-badge {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          display: inline-block;
          filter: drop-shadow(0 0 20px rgba(9, 132, 227, 0.4));
        }

        .hero-title {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
        }

        .school-details-grid {
          display: inline-flex;
          gap: 2rem;
          background: var(--glass-bg);
          padding: 1.5rem 2.5rem;
          border-radius: 50px;
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(10px);
          box-shadow: var(--glass-shadow);
          flex-wrap: wrap;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .detail-item .label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .detail-item .value {
          font-weight: 700;
          color: var(--primary-color);
        }

        .dashboard-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        .card-icon {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          background: var(--bg-accent);
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .dashboard-card h3 {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .dashboard-card p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          flex-grow: 1;
        }

        .card-stat {
          display: flex;
          flex-direction: column;
          background: rgba(9, 132, 227, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(9, 132, 227, 0.2);
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary-color);
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .card-action {
          color: var(--primary-color);
          font-weight: 600;
          margin-top: auto;
          transition: transform 0.2s;
        }

        .dashboard-card:hover .card-action {
          transform: translateX(5px);
        }

        .contact-mini {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2rem; }
          .school-details-grid { flex-direction: column; gap: 1rem; border-radius: 20px; }
        }
      `}</style>
    </div>
  );
};

export default Home;
