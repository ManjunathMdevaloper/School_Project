import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStudents } from '../context/StudentContext';

const StudentOverview = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { students, marks, attendance, outpasses } = useStudents();
  const [selectedId, setSelectedId] = useState(searchParams.get('id') || '');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [filterType, setFilterType] = useState('month'); // 'month' or 'all'

  useEffect(() => {
    if (selectedId) {
      setSearchParams({ id: selectedId });
    }
  }, [selectedId, setSearchParams]);

  const student = students.find(s => s.admissionNo === selectedId);

  // Filter students based on selected class
  const filteredStudents = selectedClass
    ? students.filter(s => s.class === selectedClass)
    : students;

  // Get unique classes
  const classes = [...new Set(students.map(s => s.class))].sort();

  // Calculate Attendance Stats
  const attendanceDates = Object.keys(attendance);
  let totalDays = 0;
  let presentDays = 0;
  let absentDays = 0;
  let absentWithIntimation = 0;

  if (student) {
    attendanceDates.forEach(date => {
      const record = attendance[date] && attendance[date][selectedId];
      if (record) {
        totalDays++;
        if (record.present) {
          presentDays++;
        } else {
          absentDays++;
          if (record.intimation) absentWithIntimation++;
        }
      }
    });
  }

  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  // Get Marks
  const studentMarks = React.useMemo(() => {
    if (!student || !marks[selectedId]) return [];

    if (filterType === 'month' && selectedMonth) {
      // Specific Month
      const monthlyMarks = marks[selectedId][selectedMonth];
      if (!monthlyMarks || typeof monthlyMarks !== 'object') return [];

      return Object.entries(monthlyMarks)
        .filter(([_, data]) => data && typeof data === 'object' && 'marks' in data)
        .map(([subject, data]) => ({
          subject,
          ...data
        }));
    } else {
      // All Months
      const allMarks = [];
      Object.keys(marks[selectedId]).forEach(month => {
        const monthlyMarks = marks[selectedId][month];

        if (!monthlyMarks || typeof monthlyMarks !== 'object') return;

        Object.entries(monthlyMarks).forEach(([subject, data]) => {
          if (data && typeof data === 'object' && 'marks' in data) {
            allMarks.push({
              month,
              subject,
              ...data
            });
          }
        });
      });
      return allMarks.sort((a, b) => b.month.localeCompare(a.month));
    }
  }, [marks, selectedId, selectedMonth, filterType]);

  // Get Outpasses
  const studentOutpasses = outpasses.filter(op => op.admissionNo === selectedId);

  // Get Recent Absences
  const recentAbsences = attendanceDates
    .map(date => ({ date, ...attendance[date][selectedId] }))
    .filter(record => record && !record.present)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5); // Show last 5 absences

  return (
    <div className="page-container section">
      <div className="container">
        <div className="header-flex mb-5">
          <h1 className="page-title">Student Overview</h1>
          <div className="filters-container">
            <div className="filter-item">
              <select
                className="form-control"
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSelectedId(''); // Reset student when class changes
                }}
              >
                <option value="">-- All Classes --</option>
                {classes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="filter-item">
              <select
                className="form-control"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                <option value="">-- Select Student --</option>
                {filteredStudents.map(s => (
                  <option key={s.admissionNo} value={s.admissionNo}>
                    {s.firstName} {s.lastName} ({s.class})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {student ? (
          <div className="grid grid-cols-1 gap-large">
            {/* Profile Section */}
            <div className="card profile-card">
              <div className="profile-header">
                <div className="profile-avatar">🎓</div>
                <div className="profile-info">
                  <h2>{student.firstName} {student.lastName}</h2>
                  <p className="text-secondary">{student.admissionNo}</p>
                </div>
              </div>

              <div className="profile-details-grid">
                <div className="detail-box">
                  <span className="label">Class</span>
                  <span className="value">{student.class}</span>
                </div>
                <div className="detail-box">
                  <span className="label">Roll No</span>
                  <span className="value">{student.rollNo}</span>
                </div>
                <div className="detail-box">
                  <span className="label">Parent</span>
                  <span className="value">{student.parentName || 'N/A'}</span>
                </div>
                <div className="detail-box">
                  <span className="label">Contact</span>
                  <span className="value">{student.phone}</span>
                </div>
                <div className="detail-box">
                  <span className="label">Email</span>
                  <span className="value">{student.email || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2">
              {/* Attendance Stats */}
              <div className="card">
                <h3 className="mb-4">Attendance Overview</h3>
                <div className="attendance-chart">
                  <div className="percentage-circle">
                    <span className="percentage">{attendancePercentage}%</span>
                    <span className="label">Overall</span>
                  </div>
                </div>
                <div className="attendance-stats-grid">
                  <div className="stat-box present">
                    <span className="count">{presentDays}</span>
                    <span className="label">Present</span>
                  </div>
                  <div className="stat-box absent">
                    <span className="count">{absentDays}</span>
                    <span className="label">Absent</span>
                  </div>
                </div>
                <div className="text-center mt-4 text-secondary text-sm">
                  Absent with Intimation: <strong>{absentWithIntimation}</strong>
                </div>
              </div>

              {/* Recent Absences */}
              <div className="card">
                <h3 className="mb-4">Recent Absences</h3>
                <div className="table-container" style={{ maxHeight: '250px', overflowY: 'auto', overflowX: 'auto' }}>
                  <table className="table" style={{ fontSize: '0.75rem', width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '0.5rem' }}>Date</th>
                        <th style={{ padding: '0.5rem' }}>Reason</th>
                        <th style={{ padding: '0.5rem' }}>Intimated By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAbsences.length === 0 ? (
                        <tr><td colSpan="3" className="text-center" style={{ padding: '0.5rem' }}>No recent absences</td></tr>
                      ) : (
                        recentAbsences.map((record, index) => (
                          <tr key={index}>
                            <td style={{ padding: '0.5rem' }}>{record.date}</td>
                            <td style={{ padding: '0.5rem' }}>{record.reason || '-'}</td>
                            <td style={{ padding: '0.5rem' }}>{record.intimatedBy || '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>


            {/* Second Row: Outpasses (Small) and Marks (Large) */}
            <div className="grid grid-cols-custom-marks">
              {/* Outpass History */}
              <div className="card">
                <h3 className="mb-4">Recent Outpasses</h3>
                <div className="table-container" style={{ maxHeight: '250px', overflowY: 'auto', overflowX: 'auto' }}>
                  <table className="table" style={{ fontSize: '0.75rem', width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '0.5rem' }}>Date</th>
                        <th style={{ padding: '0.5rem' }}>Reason</th>
                        <th style={{ padding: '0.5rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentOutpasses.length === 0 ? (
                        <tr><td colSpan="3" className="text-center" style={{ padding: '0.5rem' }}>No records</td></tr>
                      ) : (
                        studentOutpasses.map(op => (
                          <tr key={op.id}>
                            <td style={{ padding: '0.5rem' }}>{op.date}</td>
                            <td style={{ padding: '0.5rem' }}>{op.reason}</td>
                            <td style={{ padding: '0.5rem' }}><span className="badge badge-warning" style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>{op.status}</span></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Marks Table */}
              <div className="card">
                <div className="flex justify-between items-center mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <h3 style={{ margin: 0 }}>Academic Performance</h3>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                      className="form-control"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      style={{ padding: '0.4rem', fontSize: '0.9rem' }}
                    >
                      <option value="month">Specific Month</option>
                      <option value="all">All Months</option>
                    </select>
                    {filterType === 'month' && (
                      <input
                        type="month"
                        className="form-control"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        style={{ padding: '0.4rem', fontSize: '0.9rem' }}
                      />
                    )}
                  </div>
                </div>

                <div className="table-container">
                  <table className="table" style={{ fontSize: '0.75rem', width: '100%' }}>
                    <thead>
                      <tr>
                        {filterType === 'all' && <th style={{ padding: '0.5rem' }}>Month</th>}
                        <th style={{ padding: '0.5rem' }}>Subject</th>
                        <th style={{ padding: '0.5rem' }}>Marks</th>
                        <th style={{ padding: '0.5rem' }}>Status</th>
                        <th style={{ padding: '0.5rem' }}>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentMarks.length === 0 ? (
                        <tr><td colSpan={filterType === 'all' ? 5 : 4} className="text-center">No marks available.</td></tr>
                      ) : (
                        studentMarks.map((mark, index) => (
                          <tr key={index}>
                            {filterType === 'all' && (
                              <td style={{ padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                {new Date(mark.month + '-01').toLocaleString('default', { month: 'short', year: 'numeric' })}
                              </td>
                            )}
                            <td style={{ padding: '0.5rem', fontWeight: '500' }}>{mark.subject}</td>
                            <td style={{ padding: '0.5rem' }}>{mark.marks}</td>
                            <td style={{ padding: '0.5rem' }}>
                              <span className={`badge ${mark.status === 'present' ? 'badge-success' : 'badge-danger'}`}
                                style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>
                                {mark.status}
                              </span>
                            </td>
                            <td style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>{mark.remarks || '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 card">
            <p className="text-secondary" style={{ fontSize: '1.2rem' }}>Please select a student to view their overview.</p>
          </div>
        )}
      </div>

      <style>{`
        .header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .filters-container {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .filter-item {
          min-width: 200px;
        }

        .gap-large { gap: 2rem; }

        .grid { display: grid; gap: 1.5rem; }
        .grid-cols-1 { grid-template-columns: 1fr; }
        .grid-cols-2 { grid-template-columns: 1fr 1fr; }
        .grid-cols-custom-marks { grid-template-columns: 2fr 3fr; }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          background: var(--bg-accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
        }

        .profile-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.5rem;
        }

        .detail-box {
          display: flex;
          flex-direction: column;
        }

        .detail-box .label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-box .value {
          font-weight: 600;
          color: var(--text-primary);
        }

        .attendance-chart {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .percentage-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 8px solid var(--primary-color);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(44, 182, 125, 0.2);
        }

        .percentage {
          font-size: 2rem;
          font-weight: 800;
          color: var(--primary-color);
        }

        .attendance-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .stat-box {
          padding: 1rem;
          border-radius: var(--radius-md);
          text-align: center;
        }

        .stat-box.present { background: rgba(44, 182, 125, 0.1); color: #2CB67D; }
        .stat-box.absent { background: rgba(239, 68, 68, 0.1); color: #EF4444; }

        .stat-box .count {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .stat-box .label {
          font-size: 0.8rem;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .filters-container { width: 100%; flex-direction: column; }
          .filter-item { width: 100%; }
          .profile-header { flex-direction: column; text-align: center; }
          .grid-cols-2 { grid-template-columns: 1fr; }
          .grid-cols-custom-marks { grid-template-columns: 1fr; }
        }
      `}</style>
    </div >
  );
};

export default StudentOverview;
