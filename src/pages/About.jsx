import React from 'react';

const About = () => {
    return (
        <div className="page-container">
            <section className="section">
                <div className="container">
                    <div className="text-center mb-5">
                        <h1 className="page-title">About Us</h1>
                        <p className="page-subtitle">Building a legacy of education and character since 1995.</p>
                    </div>

                    <div className="grid grid-cols-2 items-center">
                        <div className="about-content">
                            <h2>Our Mission</h2>
                            <p>
                                To provide a safe, nurturing, and challenging environment where students are empowered to reach their full potential.
                                We strive to foster a love for learning, critical thinking, and social responsibility.
                            </p>

                            <h2>Our Vision</h2>
                            <p>
                                To be a leading institution that shapes global citizens who are innovative, compassionate, and capable of making a positive impact on the world.
                            </p>
                        </div>
                        <div className="about-image">
                            <img
                                src="/school_building_exterior.png"
                                alt="School Building"
                                className="premium-image"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="section bg-secondary">
                <div className="container">
                    <h2 className="text-center mb-5">Our Core Values</h2>
                    <div className="grid grid-cols-3">
                        <div className="card text-center">
                            <h3>Integrity</h3>
                            <p>We uphold the highest standards of honesty and ethics.</p>
                        </div>
                        <div className="card text-center">
                            <h3>Excellence</h3>
                            <p>We strive for excellence in everything we do.</p>
                        </div>
                        <div className="card text-center">
                            <h3>Respect</h3>
                            <p>We value and respect every individual in our community.</p>
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
        .about-content h2 {
          color: var(--primary-color);
          margin-bottom: 1rem;
          margin-top: 2rem;
        }
        .about-content h2:first-child { margin-top: 0; }
        .about-content p {
          color: var(--text-secondary);
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }
        .about-image {
          position: relative;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          transition: transform 0.3s ease;
        }
        .about-image:hover {
          transform: translateY(-10px);
        }
        .premium-image {
          width: 100%;
          height: auto;
          border-radius: 1rem;
          display: block;
          object-fit: cover;
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .bg-secondary { background-color: var(--bg-secondary); }
        .mb-5 { margin-bottom: 3rem; }
        .items-center { align-items: center; }
      `}</style>
        </div>
    );
};

export default About;
