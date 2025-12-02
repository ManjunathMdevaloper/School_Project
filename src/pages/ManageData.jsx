import React, { useState, useMemo } from 'react';
import { useStudents } from '../context/StudentContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ManageData = () => {
    const { students, attendance, marks } = useStudents();

    const [selectedClass, setSelectedClass] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [filterType, setFilterType] = useState('month'); // 'month' or 'all'
    const [whatsappNumber, setWhatsappNumber] = useState('');

    // Get unique classes
    const classes = useMemo(() => [...new Set(students.map(s => s.class))].sort(), [students]);

    // Filter students based on class
    const filteredStudents = useMemo(() => {
        return selectedClass
            ? students.filter(s => s.class === selectedClass)
            : students;
    }, [selectedClass, students]);

    // Calculate Attendance Stats
    const attendanceStats = useMemo(() => {
        if (!selectedStudent) return null;

        if (filterType === 'month' && selectedMonth) {
            let totalDays = 0;
            let presentDays = 0;
            let absentDays = 0;
            const details = [];

            Object.keys(attendance).forEach(dateISO => {
                if (dateISO.startsWith(selectedMonth)) {
                    const dayRecord = attendance[dateISO][selectedStudent];
                    if (dayRecord) {
                        totalDays++;
                        if (dayRecord.present) presentDays++;
                        else absentDays++;

                        details.push({
                            date: dateISO,
                            status: dayRecord.present ? 'Present' : 'Absent',
                            intimation: dayRecord.intimation
                        });
                    }
                }
            });

            details.sort((a, b) => new Date(a.date) - new Date(b.date));
            return { view: 'daily', totalDays, presentDays, absentDays, details };
        } else {
            // All Months - Group by Month
            const monthlyGroups = {};
            let totalDays = 0;
            let presentDays = 0;
            let absentDays = 0;

            Object.keys(attendance).forEach(dateISO => {
                const dayRecord = attendance[dateISO][selectedStudent];
                if (dayRecord) {
                    const monthKey = dateISO.slice(0, 7); // YYYY-MM
                    if (!monthlyGroups[monthKey]) {
                        monthlyGroups[monthKey] = { total: 0, present: 0, absent: 0 };
                    }

                    monthlyGroups[monthKey].total++;
                    totalDays++;

                    if (dayRecord.present) {
                        monthlyGroups[monthKey].present++;
                        presentDays++;
                    } else {
                        monthlyGroups[monthKey].absent++;
                        absentDays++;
                    }
                }
            });

            const monthlyData = Object.entries(monthlyGroups).map(([month, stats]) => ({
                month,
                ...stats
            })).sort((a, b) => b.month.localeCompare(a.month)); // Descending order

            return { view: 'monthly', totalDays, presentDays, absentDays, monthlyData };
        }
    }, [attendance, selectedStudent, selectedMonth, filterType]);

    // Get Marks
    const studentMarks = useMemo(() => {
        if (!selectedStudent || !marks[selectedStudent]) return [];

        if (filterType === 'month' && selectedMonth) {
            // Specific Month
            const monthlyMarks = marks[selectedStudent][selectedMonth];
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
            Object.keys(marks[selectedStudent]).forEach(month => {
                const monthlyMarks = marks[selectedStudent][month];

                // Ensure monthlyMarks is a valid object
                if (!monthlyMarks || typeof monthlyMarks !== 'object') return;

                Object.entries(monthlyMarks).forEach(([subject, data]) => {
                    // Ensure data is a valid mark object
                    if (data && typeof data === 'object' && 'marks' in data) {
                        allMarks.push({
                            month,
                            subject,
                            ...data
                        });
                    }
                });
            });
            // Sort by month descending
            return allMarks.sort((a, b) => b.month.localeCompare(a.month));
        }
    }, [marks, selectedStudent, selectedMonth, filterType]);

    const selectedStudentDetails = students.find(s => s.admissionNo === selectedStudent);

    const generatePDF = (action = 'download') => {
        if (!selectedStudentDetails) return;

        const doc = new jsPDF();

        // Header
        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        doc.text('7Veda Management', 105, 15, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Student Performance Report', 105, 22, { align: 'center' });

        // Student Details
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(`Name: ${selectedStudentDetails.firstName} ${selectedStudentDetails.lastName}`, 14, 35);
        doc.text(`Class: ${selectedStudentDetails.class}`, 14, 40);
        doc.text(`Admission No: ${selectedStudentDetails.admissionNo}`, 14, 45);
        doc.text(`Report Period: ${filterType === 'all' ? 'All Months' : new Date(selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}`, 14, 50);

        let yPos = 60;

        // Attendance Section
        if (attendanceStats) {
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text('Attendance Summary', 14, yPos);
            yPos += 5;

            const attendanceHeaders = attendanceStats.view === 'daily'
                ? [['Date', 'Status', 'Intimation']]
                : [['Month', 'Total Days', 'Present', 'Absent']];

            const attendanceData = attendanceStats.view === 'daily'
                ? attendanceStats.details.map(r => [r.date, r.status, r.intimation ? 'Yes' : '-'])
                : attendanceStats.monthlyData.map(r => [
                    new Date(r.month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' }),
                    r.total,
                    r.present,
                    r.absent
                ]);

            autoTable(doc, {
                startY: yPos,
                head: attendanceHeaders,
                body: attendanceData,
                theme: 'grid',
                headStyles: { fillColor: [22, 163, 74] } // Greenish
            });

            yPos = doc.lastAutoTable.finalY + 15;
        }

        // Marks Section
        if (studentMarks.length > 0) {
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text('Academic Performance', 14, yPos);
            yPos += 5;

            const marksHeaders = filterType === 'all'
                ? [['Month', 'Subject', 'Marks', 'Status', 'Remarks']]
                : [['Subject', 'Marks', 'Status', 'Remarks']];

            const marksData = studentMarks.map(m => {
                const row = [m.subject, m.marks, m.status, m.remarks || '-'];
                if (filterType === 'all') {
                    row.unshift(new Date(m.month + '-01').toLocaleString('default', { month: 'short', year: 'numeric' }));
                }
                return row;
            });

            autoTable(doc, {
                startY: yPos,
                head: marksHeaders,
                body: marksData,
                theme: 'grid',
                headStyles: { fillColor: [37, 99, 235] } // Blueish
            });
        }

        if (action === 'download') {
            doc.save(`${selectedStudentDetails.firstName}_Report.pdf`);
        } else if (action === 'whatsapp') {
            if (!whatsappNumber) {
                alert('Please enter a WhatsApp number.');
                return;
            }
            const cleanNumber = whatsappNumber.replace(/\D/g, '');

            // Download the PDF first
            doc.save(`${selectedStudentDetails.firstName}_Report.pdf`);

            // Open WhatsApp Chat
            const text = `Here is the student report for ${selectedStudentDetails.firstName}.`;
            const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        }
    };

    return (
        <div className="page-container section">
            <div className="container">
                <h1 className="page-title mb-5" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Manage Student Data</h1>

                {/* Filters */}
                <div className="card mb-5">
                    <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Select Class</label>
                            <select
                                className="form-control"
                                value={selectedClass}
                                onChange={(e) => {
                                    setSelectedClass(e.target.value);
                                    setSelectedStudent('');
                                }}
                            >
                                <option value="">-- All Classes --</option>
                                {classes.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Select Student</label>
                            <select
                                className="form-control"
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                                disabled={!filteredStudents.length}
                            >
                                <option value="">-- Select Student --</option>
                                {filteredStudents.map(s => (
                                    <option key={s.admissionNo} value={s.admissionNo}>
                                        {s.firstName} {s.lastName} ({s.class})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Time Period</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <select
                                    className="form-control"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    style={{ flex: 1 }}
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
                                        style={{ flex: 1.5 }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {selectedStudent && (
                    <>
                        <div className="grid grid-cols-2" style={{ gap: '2rem' }}>

                            {/* Attendance Section */}
                            <div className="card">
                                <h2 className="card-title mb-4" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                                    Attendance - {filterType === 'all' ? 'All Time' : new Date(selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </h2>

                                {attendanceStats && attendanceStats.totalDays > 0 ? (
                                    <div>
                                        <div className="stats-grid mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                                            <div className="stat-box" style={{ background: 'var(--bg-accent)', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Working Days</div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{attendanceStats.totalDays}</div>
                                            </div>
                                            <div className="stat-box" style={{ background: '#dcfce7', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.9rem', color: '#15803d' }}>Present</div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#15803d' }}>{attendanceStats.presentDays}</div>
                                            </div>
                                            <div className="stat-box" style={{ background: '#fee2e2', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.9rem', color: '#b91c1c' }}>Absent</div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#b91c1c' }}>{attendanceStats.absentDays}</div>
                                            </div>
                                        </div>

                                        <div className="table-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                            <table className="table" style={{ fontSize: '0.75rem', width: '100%' }}>
                                                <thead>
                                                    {attendanceStats.view === 'daily' ? (
                                                        <tr>
                                                            <th style={{ padding: '0.5rem' }}>Date</th>
                                                            <th style={{ padding: '0.5rem' }}>Status</th>
                                                            <th style={{ padding: '0.5rem' }}>Intimation</th>
                                                        </tr>
                                                    ) : (
                                                        <tr>
                                                            <th style={{ padding: '0.5rem' }}>Month</th>
                                                            <th style={{ padding: '0.5rem', whiteSpace: 'normal', lineHeight: '1.2' }}>Total Working Days</th>
                                                            <th style={{ padding: '0.5rem' }}>Present</th>
                                                            <th style={{ padding: '0.5rem' }}>Absent</th>
                                                        </tr>
                                                    )}
                                                </thead>
                                                <tbody>
                                                    {attendanceStats.view === 'daily' ? (
                                                        attendanceStats.details.map((record, index) => (
                                                            <tr key={index}>
                                                                <td style={{ padding: '0.5rem' }}>{record.date}</td>
                                                                <td style={{ padding: '0.5rem' }}>
                                                                    <span className={`badge ${record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                                                        style={{
                                                                            backgroundColor: record.status === 'Present' ? '#dcfce7' : '#fee2e2',
                                                                            color: record.status === 'Present' ? '#15803d' : '#b91c1c',
                                                                            padding: '0.15rem 0.4rem',
                                                                            borderRadius: '0.25rem',
                                                                            fontSize: '0.7rem'
                                                                        }}>
                                                                        {record.status}
                                                                    </span>
                                                                </td>
                                                                <td style={{ padding: '0.5rem' }}>{record.intimation ? 'Yes' : '-'}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        attendanceStats.monthlyData.map((monthRecord, index) => (
                                                            <tr key={index}>
                                                                <td style={{ padding: '0.5rem' }}>{new Date(monthRecord.month + '-01').toLocaleString('default', { month: 'short', year: 'numeric' })}</td>
                                                                <td style={{ padding: '0.5rem' }}>{monthRecord.total}</td>
                                                                <td style={{ padding: '0.5rem', color: '#15803d', fontWeight: 'bold' }}>{monthRecord.present}</td>
                                                                <td style={{ padding: '0.5rem', color: '#b91c1c', fontWeight: 'bold' }}>{monthRecord.absent}</td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-secondary">No attendance records found for this {filterType === 'all' ? 'period' : 'month'}.</p>
                                )}
                            </div>

                            {/* Marks Section */}
                            <div className="card">
                                <h2 className="card-title mb-4" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                                    Academic Performance
                                </h2>

                                {studentMarks.length > 0 ? (
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
                                                {studentMarks.map((mark, index) => (
                                                    <tr key={index}>
                                                        {filterType === 'all' && (
                                                            <td style={{ padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                                {new Date(mark.month + '-01').toLocaleString('default', { month: 'short', year: 'numeric' })}
                                                            </td>
                                                        )}
                                                        <td style={{ padding: '0.5rem', fontWeight: '500' }}>{mark.subject}</td>
                                                        <td style={{ padding: '0.5rem' }}>
                                                            <span style={{
                                                                fontWeight: 'bold',
                                                                color: mark.marks >= 35 ? '#15803d' : '#b91c1c'
                                                            }}>
                                                                {mark.marks}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '0.5rem' }}>{mark.status}</td>
                                                        <td style={{ padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{mark.remarks || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-secondary">No marks available.</p>
                                )}
                            </div>

                        </div>

                        {/* Actions Section */}
                        <div className="card mb-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', marginTop: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 'bold' }}>Actions</h3>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => generatePDF('download')}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <span>Download Report (PDF)</span>
                                </button>

                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', flex: 1, minWidth: '300px' }}>
                                    <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                                        <label className="form-label" style={{ fontSize: '0.9rem' }}>WhatsApp Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. 919876543210"
                                            value={whatsappNumber}
                                            onChange={(e) => setWhatsappNumber(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        className="btn"
                                        style={{ background: '#25D366', color: 'white', borderColor: '#25D366' }}
                                        onClick={() => generatePDF('whatsapp')}
                                    >
                                        Send to WhatsApp
                                    </button>
                                </div>
                                <div style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                    * Mobile: Attaches PDF automatically.<br />
                                    * Desktop: Downloads PDF (must attach manually).
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div >
    );
};

export default ManageData;
