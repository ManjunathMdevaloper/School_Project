import React, { useState } from 'react';
import CustomSelect from '../components/CustomSelect';

const Admissions = () => {
  const [formData, setFormData] = useState({
    parentName: '',
    email: '',
    phone: '',
    grade: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="page-container section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="page-title" style={{ fontSize: '3.5rem', fontWeight: '800' }}>Join 7Veda Academy</h1>
          <p className="page-subtitle" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Nurturing excellence through innovative education.</p>
        </div>

        <div className="grid grid-cols-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div className="admission-info">
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 'bold' }}>Our Admission Journey</h2>
            <div className="step-list" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="step-item" style={{ display: 'flex', gap: '1.5rem' }}>
                <div className="step-number" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>1</div>
                <div className="step-content">
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Digital Inquiry</h3>
                  <p className="text-secondary">Fill out our elegant inquiry form to express interest in our curriculum.</p>
                </div>
              </div>
              <div className="step-item" style={{ display: 'flex', gap: '1.5rem' }}>
                <div className="step-number" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>2</div>
                <div className="step-content">
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Application Submission</h3>
                  <p className="text-secondary">Provide detailed student profiles and prior academic records digitally.</p>
                </div>
              </div>
              <div className="step-item" style={{ display: 'flex', gap: '1.5rem' }}>
                <div className="step-number" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>3</div>
                <div className="step-content">
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Personalized Interaction</h3>
                  <p className="text-secondary">A digital or in-person meeting with our academic counselors.</p>
                </div>
              </div>
              <div className="step-item" style={{ display: 'flex', gap: '1.5rem' }}>
                <div className="step-number" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>4</div>
                <div className="step-content">
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Campus Enrollment</h3>
                  <p className="text-secondary">Welcome to the family! Formalize enrollment and access our digital portal.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '2.5rem' }}>
            <h2 className="text-center" style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>Inquiry Form</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Parent's Full Name</label>
                <input
                  type="text"
                  name="parentName"
                  className="form-control"
                  placeholder="Enter your name"
                  value={formData.parentName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="+91..."
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <CustomSelect
                label="Grade Applying For"
                value={formData.grade}
                onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                options={[
                  { value: '', label: '-- Select Grade --' },
                  { value: 'Grade 1', label: 'Grade 1' },
                  { value: 'Grade 2', label: 'Grade 2' },
                  { value: 'Grade 3', label: 'Grade 3' },
                  { value: 'Grade 4', label: 'Grade 4' },
                  { value: 'Grade 5', label: 'Grade 5' },
                ]}
              />
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>Submit Inquiry</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admissions;
