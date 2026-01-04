import React, { useState } from 'react';
import { useStudents } from '../context/StudentContext';

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

    // If marking present, clear intimation details
    if (field === 'present') {
      if (value === true) {
        newRecord.intimation = false;
        newRecord.intimatedBy = '';
        newRecord.reason = '';
        setPopup({ message: 'Presented', color: '#15803d' }); // Green
      } else {
        setPopup({ message: 'Absent', color: '#b91c1c' }); // Red
      }
      // Clear popup after 1.5 seconds
      setTimeout(() => setPopup(null), 1500);
    }

    await setAttendanceForDate(selectedDate, admissionNo, newRecord);


    // Simulate save delay for visual feedback
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 500);
  };

  const filteredStudents = students.filter(s => !filterClass || s.class === filterClass);

  // Get unique classes
  const classes = [...new Set(students.map(s => s.class))];

  return (
    <div className="page-container section">
      {popup && (
        <div style={{
          position: 'fixed',
          top: '80px', // Below navbar
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: popup.color,
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          zIndex: 2000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontWeight: 'bold',
          animation: 'slideDown 0.3s ease-out'
        }}>
          {popup.message}
        </div>
      )}

      <div className="container">
        <div className="flex justify-between items-center mb-5" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="page-title" style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Daily Attendance</h1>
          {saveStatus === 'saved' && (
            <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 'bold', animation: 'fadeIn 0.3s' }}>
              ✓ Saved
            </span>
          )}
        </div>

        <div className="card mb-5">
          <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
            <div className="form-group">
              <label className="form-label">Select Date</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Filter by Class</label>
              <select
                className="form-control"
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
              >
                <option value="">All Classes</option>
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="card table-container">
          <table className="table" style={{ fontSize: '0.75rem', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ padding: '0.5rem' }}>Admission No</th>
                <th style={{ padding: '0.5rem' }}>Name</th>
                <th style={{ padding: '0.5rem' }}>Class</th>
                <th style={{ padding: '0.5rem' }}>Status</th>
                <th style={{ padding: '0.5rem' }}>Intimation Details</th>
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
                    <td style={{ padding: '0.5rem' }}><span className="badge badge-info" style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>{student.admissionNo}</span></td>
                    <td style={{ padding: '0.5rem' }}>{student.firstName} {student.lastName}</td>
                    <td style={{ padding: '0.5rem' }}>{student.class}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <div className="flex gap-2" style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className={`btn btn-sm ${record.present ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => handleAttendanceChange(student.admissionNo, 'present', true)}
                          style={{ backgroundColor: record.present ? 'var(--secondary-color)' : 'transparent', borderColor: 'var(--secondary-color)', fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                        >
                          Present
                        </button>
                        <button
                          className={`btn btn-sm ${!record.present ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => handleAttendanceChange(student.admissionNo, 'present', false)}
                          style={{ backgroundColor: !record.present ? '#EF4444' : 'transparent', borderColor: '#EF4444', color: !record.present ? 'white' : '#EF4444', fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '0.5rem' }}>
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
                            style={{ width: '1rem', height: '1rem', cursor: record.present ? 'not-allowed' : 'pointer' }}
                          />
                          <span>Intimation Received</span>
                        </label>

                        {record.intimation && (
                          <div className="mt-2 p-2 rounded border" style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--bg-accent)', borderRadius: '0.5rem', minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <select
                              className="form-control"
                              style={{ fontSize: '0.8rem', padding: '0.3rem', width: '100%' }}
                              value={record.intimatedBy || ''}
                              onChange={(e) => handleAttendanceChange(student.admissionNo, 'intimatedBy', e.target.value)}
                            >
                              <option value="">-- Intimated By --</option>
                              <option value="Mother">Mother</option>
                              <option value="Father">Father</option>
                              <option value="Guardian">Guardian</option>
                              <option value="Relative">Relative</option>
                              <option value="Self">Self</option>
                              <option value="Other">Other</option>
                            </select>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Reason for absence..."
                              style={{ fontSize: '0.8rem', padding: '0.3rem', width: '100%' }}
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
                <tr><td colSpan="5" className="text-center" style={{ padding: '0.5rem' }}>No students found.</td></tr>
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
      `}</style>
    </div>
  );
};

export default Attendance;
