import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStudents } from '../context/StudentContext';
import CustomSelect from '../components/CustomSelect';

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
  const studentMarks = useMemo(() => {
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
  }, [marks, selectedId, selectedMonth, filterType, student]);

  // Get Outpasses
  const studentOutpasses = outpasses.filter(op => op.admissionNo === selectedId);

  // Get Recent Absences
  const recentAbsences = student ? attendanceDates
    .map(date => ({ date, ...attendance[date][selectedId] }))
    .filter(record => record && !record.present)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5) : []; // Show last 5 absences

  return (
    <div className="page-container section">
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <h1 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Student Analytics</h1>
          <p className="text-secondary">Comprehensive view of student's academic and behavioral performance.</p>
        </div>

        <div className="filter-card mb-5" style={{ overflow: 'visible' }}>
          <CustomSelect
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedId(''); // Reset student when class changes
            }}
            options={[{ value: '', label: '-- All Classes --' }, ...classes.map(c => ({ value: c, label: c }))]}
            placeholder="Select Class"
          />
          <CustomSelect
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            options={[{ value: '', label: '-- Select Student --' }, ...filteredStudents.map(s => ({ value: s.admissionNo, label: `${s.firstName} ${s.lastName} (${s.admissionNo})` }))]}
            placeholder="Select Student"
          />
        </div>

        {student ? (
          <div className="grid grid-cols-1 gap-large" style={{ display: 'grid', gap: '2rem' }}>
            {/* Profile Section */}
            <div className="card profile-card" style={{ padding: '2rem' }}>
              <div className="profile-header" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div className="profile-avatar" style={{ width: '80px', height: '80px', background: 'rgba(197, 160, 89, 0.1)', border: '2px solid var(--secondary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🎓</div>
                <div className="profile-info">
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{student.firstName} {student.lastName}</h2>
                  <p className="text-secondary">{student.admissionNo}</p>
                </div>
              </div>

              <div className="profile-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
                <div className="detail-box" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span className="label" style={{ fontSize: '0.75rem', color: 'var(--secondary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Class</span>
                  <span className="value" style={{ fontWeight: 600, fontSize: '1.1rem' }}>{student.class}</span>
                </div>
                <div className="detail-box" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span className="label" style={{ fontSize: '0.75rem', color: 'var(--secondary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Roll No</span>
                  <span className="value" style={{ fontWeight: 600, fontSize: '1.1rem' }}>{student.rollNo}</span>
                </div>
                <div className="detail-box" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span className="label" style={{ fontSize: '0.75rem', color: 'var(--secondary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Parent</span>
                  <span className="value" style={{ fontWeight: 600, fontSize: '1.1rem' }}>{student.parentName || 'N/A'}</span>
                </div>
                <div className="detail-box" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span className="label" style={{ fontSize: '0.75rem', color: 'var(--secondary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</span>
                  <span className="value" style={{ fontWeight: 600, fontSize: '1.1rem' }}>{student.phone}</span>
                </div>
                <div className="detail-box" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span className="label" style={{ fontSize: '0.75rem', color: 'var(--secondary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</span>
                  <span className="value" style={{ fontWeight: 600, fontSize: '1.1rem' }}>{student.email || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2">
              {/* Attendance Stats */}
              <div className="card">
                <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Attendance Overview</h3>
                <div className="attendance-chart" style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                  <div className="percentage-circle" style={{ width: '120px', height: '120px', borderRadius: '50%', border: '8px solid var(--primary-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(44, 182, 125, 0.2)', background: 'rgba(44, 182, 125, 0.05)' }}>
                    <span className="percentage" style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-color)' }}>{attendancePercentage}%</span>
                    <span className="label" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Overall</span>
                  </div>
                </div>
                <div className="attendance-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="stat-box present" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', background: 'var(--success-bg)', color: 'var(--success-text)' }}>
                    <span className="count" style={{ display: 'block', fontSize: '1.75rem', fontWeight: 800 }}>{presentDays}</span>
                    <span className="label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Present</span>
                  </div>
                  <div className="stat-box absent" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', background: 'var(--error-bg)', color: 'var(--error-text)' }}>
                    <span className="count" style={{ display: 'block', fontSize: '1.75rem', fontWeight: 800 }}>{absentDays}</span>
                    <span className="label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Absent</span>
                  </div>
                </div>
                <div className="text-center mt-4 text-secondary" style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                  Intimated Absences: <strong style={{ color: 'var(--warning-text)' }}>{absentWithIntimation}</strong>
                </div>
              </div>

              {/* Recent Absences */}
              <div className="card">
                <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Recent Absences</h3>
                <div className="table-container" style={{ maxHeight: '250px', overflowY: 'auto' }}>
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
                        <tr><td colSpan="3" className="text-center" style={{ padding: '0.5rem', textAlign: 'center' }}>No recent absences</td></tr>
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
            <div className="grid grid-stats">
              {/* Outpass History */}
              <div className="card">
                <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Recent Outpasses</h3>
                <div className="table-container" style={{ maxHeight: '250px', overflowY: 'auto' }}>
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
                            <td style={{ padding: '0.5rem' }}>
                              <span className={`badge ${op.status === 'Approved' ? 'badge-success' : op.status === 'Rejected' ? 'badge-error' : 'badge-warning'}`}>
                                {op.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Marks Table */}
              <div className="card">
                <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>Academic Performance</h3>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <CustomSelect
                      containerClass="compact-select"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      options={[
                        { value: 'month', label: 'Monthly' },
                        { value: 'all', label: 'All Time' }
                      ]}
                    />
                    {filterType === 'month' && (
                      <input
                        type="month"
                        className="form-control"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
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
                        <tr><td colSpan={filterType === 'all' ? 5 : 4} className="text-center" style={{ textAlign: 'center', padding: '1rem' }}>No marks available.</td></tr>
                      ) : (
                        studentMarks.map((mark, index) => (
                          <tr key={index}>
                            {filterType === 'all' && (
                              <td style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>
                                {new Date(mark.month + '-01').toLocaleString('default', { month: 'short', year: 'numeric' })}
                              </td>
                            )}
                            <td style={{ padding: '0.5rem', fontWeight: '600' }}>{mark.subject}</td>
                            <td style={{ padding: '0.5rem' }}><span className="badge badge-info">{mark.marks}</span></td>
                            <td style={{ padding: '0.5rem' }}>
                              <span className={`badge ${mark.status === 'Pass' ? 'badge-success' : 'badge-error'}`}>
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
          <div className="text-center py-10 card" style={{ textAlign: 'center', padding: '5rem' }}>
            <p className="text-secondary" style={{ fontSize: '1.2rem' }}>Please select a student to view their metrics.</p>
          </div>
        )}
      </div>
    </div >
  );
};

export default StudentOverview;
