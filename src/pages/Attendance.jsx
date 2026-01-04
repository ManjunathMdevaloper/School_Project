import React, { useState } from 'react';
import { useStudents } from '../context/StudentContext';
import CustomSelect from '../components/CustomSelect';

const Attendance = () => {
  const { students, attendance, setAttendanceForDate } = useStudents();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterClass, setFilterClass] = useState('');
  const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'saved', ''
  const [popup, setPopup] = useState(null); // { message: '', color: '' }

  const handleAttendanceChange = async (admissionNo, field, value) => {
    setSaveStatus('saving');

    const currentRecord = attendance[selectedDate]?.[admissionNo] || {
      present: true,
      intimation: false,
      intimatedBy: '',
      reason: ''
    };

    let newRecord = { ...currentRecord, [field]: value };

    if (field === 'present') {
      if (value === true) {
        newRecord.intimation = false;
        newRecord.intimatedBy = '';
        newRecord.reason = '';
        setPopup({ message: 'Presented', color: 'var(--success-bg)', textColor: 'var(--success-text)' });
      } else {
        setPopup({ message: 'Absent', color: 'var(--error-bg)', textColor: 'var(--error-text)' });
      }
      setTimeout(() => setPopup(null), 1500);
    }

    await setAttendanceForDate(selectedDate, admissionNo, newRecord);

    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 500);
  };

  const filteredStudents = students.filter(s => !filterClass || s.class === filterClass);
  const classes = [...new Set(students.map(s => s.class))].sort();

  const classOptions = [
    { value: '', label: 'All Classes' },
    ...classes.map(c => ({ value: c, label: c }))
  ];

  return (
    <div className="page-container section">
      {popup && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: popup.color,
          color: popup.textColor || 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '2rem',
          zIndex: 2000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontWeight: 'bold',
          border: `1px solid ${popup.textColor || 'transparent'}`,
          animation: 'slideDown 0.3s ease-out'
        }}>
          {popup.message}
        </div>
      )}

      <div className="container">
        <div className="flex justify-between items-center mb-5" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Daily Attendance</h1>
            <p className="text-secondary">Mark and manage daily student presence records.</p>
          </div>
          {saveStatus === 'saved' && (
            <span style={{ background: 'var(--success-bg)', color: 'var(--success-text)', padding: '0.5rem 1.5rem', borderRadius: '2rem', fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid var(--success-text)' }}>
              ✓ CHANGES SAVED
            </span>
          )}
        </div>

        <div className="filter-card" style={{ overflow: 'visible' }}>
          <div className="filter-group">
            <label>Select Date</label>
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <CustomSelect
            containerClass="filter-group"
            label="Class Division"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            options={classOptions}
            placeholder="Select Class"
          />
        </div>

        <div className="card table-container">
          <table className="table table-wide">
            <thead>
              <tr>
                <th>Admission No</th>
                <th>Name</th>
                <th>Class</th>
                <th>Status</th>
                <th>Intimation Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => {
                const record = attendance[selectedDate]?.[student.admissionNo] || {
                  present: true,
                  intimation: false,
                  intimatedBy: '',
                  reason: ''
                };

                return (
                  <tr key={student.admissionNo}>
                    <td><span className="badge badge-info">{student.admissionNo}</span></td>
                    <td style={{ fontWeight: '600' }}>{student.firstName} {student.lastName}</td>
                    <td>{student.class}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className={`btn btn-sm ${record.present ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => handleAttendanceChange(student.admissionNo, 'present', true)}
                        >
                          Present
                        </button>
                        <button
                          className={`btn btn-sm ${!record.present ? 'btn-danger' : 'btn-outline'}`}
                          onClick={() => handleAttendanceChange(student.admissionNo, 'present', false)}
                          style={!record.present ? { background: 'var(--error-bg)', color: 'var(--error-text)', borderColor: 'var(--error-text)' } : { color: 'var(--error-text)', borderColor: 'var(--error-text)' }}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2" style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: record.present ? 'not-allowed' : 'pointer',
                          opacity: record.present ? 0.5 : 1
                        }}>
                          <input
                            type="checkbox"
                            checked={record.intimation}
                            onChange={(e) => handleAttendanceChange(student.admissionNo, 'intimation', e.target.checked)}
                            disabled={record.present}
                            style={{ width: '1.1rem', height: '1.1rem' }}
                          />
                          <span style={{ fontSize: '0.85rem' }}>Intimation Received</span>
                        </label>

                        {record.intimation && (
                          <div className="mt-2 p-3 rounded" style={{ backgroundColor: 'rgba(150,150,150,0.1)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <CustomSelect
                              containerClass="compact-select"
                              value={record.intimatedBy || ''}
                              onChange={(e) => handleAttendanceChange(student.admissionNo, 'intimatedBy', e.target.value)}
                              options={[
                                { value: '', label: '-- Intimated By --' },
                                { value: 'Mother', label: 'Mother' },
                                { value: 'Father', label: 'Father' },
                                { value: 'Guardian', label: 'Guardian' },
                                { value: 'Relative', label: 'Relative' },
                                { value: 'Self', label: 'Self' },
                                { value: 'Other', label: 'Other' },
                              ]}
                            />
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Reason for absence..."
                              style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                              value={record.reason || ''}
                              onChange={(e) => handleAttendanceChange(student.admissionNo, 'reason', e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredStudents.length === 0 && (
                <tr><td colSpan="5" className="text-center py-8 text-secondary">No students found matching your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        @keyframes slideDown {
            from { transform: translate(-50%, -20px); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
        }
        .btn-danger:hover { background: #dc2626 !important; border-color: #dc2626 !important; color: white !important; }
      `}</style>
    </div>
  );
};

export default Attendance;
