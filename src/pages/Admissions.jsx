import React from 'react';

const Admissions = () => {
    return (
        <div className="page-container">
            <section className="section">
                <div className="container">
                    <div className="text-center mb-5">
                        <h1 className="page-title">Admissions</h1>
                        <p className="page-subtitle">Join our vibrant community of learners.</p>
                    </div>

                    <div className="grid grid-cols-2">
                        <div className="admission-info">
                            <h2>Admission Process</h2>
                            <div className="step-list">
                                <div className="step-item">
                                    <div className="step-number">1</div>
                                    <div className="step-content">
                                        <h3>Inquiry</h3>
                                        <p>Fill out the inquiry form or visit our campus to learn more.</p>
                                    </div>
                                </div>
                                <div className="step-item">
                                    <div className="step-number">2</div>
                                    <div className="step-content">
                                        <h3>Application</h3>
                                        <p>Submit the completed application form with necessary documents.</p>
                                    </div>
                                </div>
                                <div className="step-item">
                                    <div className="step-number">3</div>
                                    <div className="step-content">
                                        <h3>Interaction</h3>
                                        <p>Attend an interaction session with the principal/coordinator.</p>
                                    </div>
                                </div>
                                <div className="step-item">
                                    <div className="step-number">4</div>
                                    <div className="step-content">
                                        <h3>Enrollment</h3>
                                        <p>Pay the fees and complete the admission formalities.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="admission-form card">
                            <h2 className="text-center mb-4">Inquiry Form</h2>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="name">Parent's Name</label>
                                    <input type="text" id="name" className="form-control" placeholder="Enter your name" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input type="email" id="email" className="form-control" placeholder="Enter your email" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input type="tel" id="phone" className="form-control" placeholder="Enter your phone number" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="grade">Grade Applying For</label>
                                    <select id="grade" className="form-control">
                                        <option>Select Grade</option>
                                        <option>Grade 1</option>
                                        <option>Grade 2</option>
                                        <option>Grade 3</option>
                                        <option>Grade 4</option>
                                        <option>Grade 5</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Submit Inquiry</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

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
        .step-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-top: 2rem;
        }
        .step-item {
          display: flex;
          gap: 1.5rem;
        }
        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
        }
        .step-content h3 {
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        .step-content p {
          color: var(--text-secondary);
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
      `}</style>
        </div>
    );
};

export default Admissions;
