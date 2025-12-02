import React from 'react';

const Academics = () => {
    return (
        <div className="page-container">
            <section className="section">
                <div className="container">
                    <div className="text-center mb-5">
                        <h1 className="page-title">Academics</h1>
                        <p className="page-subtitle">A comprehensive curriculum designed for holistic growth.</p>
                    </div>

                    <div className="grid grid-cols-3">
                        <div className="card">
                            <div className="card-header">
                                <h3>Primary School</h3>
                                <span className="badge">Grades 1-5</span>
                            </div>
                            <div className="card-body">
                                <p>Focus on foundational skills in literacy, numeracy, and social development through play-based and inquiry-based learning.</p>
                                <ul className="feature-list">
                                    <li>Interactive Learning</li>
                                    <li>Arts & Crafts</li>
                                    <li>Basic Sciences</li>
                                </ul>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h3>Middle School</h3>
                                <span className="badge">Grades 6-8</span>
                            </div>
                            <div className="card-body">
                                <p>Transitioning to more structured learning with a focus on critical thinking, problem-solving, and subject mastery.</p>
                                <ul className="feature-list">
                                    <li>Project-Based Learning</li>
                                    <li>Computer Science</li>
                                    <li>Foreign Languages</li>
                                </ul>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h3>High School</h3>
                                <span className="badge">Grades 9-10</span>
                            </div>
                            <div className="card-body">
                                <p>Preparing students for board exams and future careers with rigorous academic training and career guidance.</p>
                                <ul className="feature-list">
                                    <li>Advanced Sciences</li>
                                    <li>Career Counseling</li>
                                    <li>Leadership Programs</li>
                                </ul>
                            </div>
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
        .card-header {
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .card-header h3 {
          color: var(--primary-color);
          margin: 0;
        }
        .badge {
          background-color: var(--bg-accent);
          color: var(--text-primary);
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .card-body p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }
        .feature-list {
          list-style: none;
          padding: 0;
        }
        .feature-list li {
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          padding-left: 1.5rem;
          position: relative;
        }
        .feature-list li::before {
          content: '✓';
          color: var(--secondary-color);
          position: absolute;
          left: 0;
        }
        .mb-5 { margin-bottom: 3rem; }
      `}</style>
        </div>
    );
};

export default Academics;
