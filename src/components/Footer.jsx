import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon">🏫</span>
              <span className="logo-text">7Veda Management</span>
            </div>
            <p className="footer-desc">
              7Veda Management<br />
              Affiliation Number: 999999<br />
              Status: Senior Secondary Level<br />
              Trust: 7Veda Management Trust
            </p>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/academics">Academics</Link></li>
              <li><Link to="/admissions">Admissions</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p>📍 123 Innovation Drive, Tech City, 90210</p>
            <p>📞 +1 234 567 8900</p>
            <p>✉️ info@7vedamanagement.edu</p>
          </div>

          <div className="footer-social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} 7Veda Management. All rights reserved. Category: CBSE</p>
        </div>
      </div>

      <style>{`
        .footer {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          padding: 4rem 0 2rem;
          margin-top: auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .footer-brand .logo {
          margin-bottom: 1rem;
          color: var(--primary-color);
          font-weight: 800;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .footer-desc {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .footer h3 {
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .footer-links ul {
          list-style: none;
        }

        .footer-links li {
          margin-bottom: 0.75rem;
        }

        .footer-links a {
          color: var(--text-secondary);
          transition: color 0.2s ease;
        }

        .footer-links a:hover {
          color: var(--primary-color);
        }

        .footer-contact p {
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .social-icons {
          display: flex;
          gap: 1rem;
        }

        .social-icons a {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--bg-accent);
          color: var(--primary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .social-icons a:hover {
          background-color: var(--primary-color);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .footer-bottom {
          border-top: 1px solid var(--border-color);
          padding-top: 2rem;
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
