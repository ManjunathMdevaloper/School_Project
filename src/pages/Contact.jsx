import React from 'react';

const Contact = () => {
  return (
    <div className="page-container">
      <section className="section">
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="page-title">Contact Us</h1>
            <p className="page-subtitle">We'd love to hear from you.</p>
          </div>

          <div className="grid grid-cols-2">
            <div className="contact-info">
              <div className="info-item">
                <h3>Address</h3>
                <p>School Address, City, State, Zip Code</p>
              </div>
              <div className="info-item">
                <h3>Phone</h3>
                <p>+91 XXXXX XXXXX</p>
              </div>
              <div className="info-item">
                <h3>Email</h3>
                <p>contact@school.edu</p>
              </div>
              <div className="info-item">
                <h3>Office Hours</h3>
                <p>Monday - Saturday: 8:00 AM - 4:00 PM</p>
              </div>
            </div>

            <div className="contact-form card">
              <h2 className="mb-4">Send us a Message</h2>
              <form>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" className="form-control" placeholder="Your Name" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" className="form-control" placeholder="Your Email" />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" className="form-control" rows="5" placeholder="Your Message"></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <div className="map-section">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3846.66763456789!2d77.9!3d15.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDMwJzAwLjAiTiA3N8KwNTQnMDAuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="School Location"
        ></iframe>
      </div>

      <style>{`
        .page-title {
          font-size: 3rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }
        .page-subtitle {
          font-size: 1.2rem;
          color: var(--text-secondary);
        }
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .info-item h3 {
          color: var(--primary-color);
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
        }
        .info-item p {
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-weight: 500;
        }
        .form-control {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          background-color: var(--bg-primary);
          color: var(--text-primary);
          transition: border-color 0.2s ease;
        }
        .form-control:focus {
          outline: none;
          border-color: var(--primary-color);
        }
        .w-100 { width: 100%; }
        .mb-4 { margin-bottom: 2rem; }
        .mb-5 { margin-bottom: 3rem; }
        .map-section {
          margin-top: 4rem;
          filter: grayscale(100%) invert(0%);
        }
        :global(.dark) .map-section {
          filter: grayscale(100%) invert(90%);
        }
      `}</style>
    </div>
  );
};

export default Contact;
