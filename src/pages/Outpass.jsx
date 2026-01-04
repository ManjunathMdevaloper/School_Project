import React, { useState } from 'react';
import { useStudents } from '../context/StudentContext';
import CustomSelect from '../components/CustomSelect';

const Outpass = () => {
    const { students, outpasses, addOutpass } = useStudents();
    const [selectedClass, setSelectedClass] = useState('');
    const [formData, setFormData] = useState({
        admissionNo: '',
        reason: '',
        date: new Date().toISOString().split('T')[0],
        timeOut: '',
        timeIn: ''
    });
    const [message, setMessage] = useState('');

    // Filter students based on selected class
    const filteredStudents = selectedClass
        ? students.filter(s => s.class === selectedClass)
        : students;

    // Get unique classes
    const classes = [...new Set(students.map(s => s.class))].sort();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.admissionNo) {
            setMessage('Please select a student');
            return;
        }

        const student = students.find(s => s.admissionNo === formData.admissionNo);
        await addOutpass({
            ...formData,
            studentName: `${student.firstName} ${student.lastName}`,
            class: student.class
        });

        setMessage('Outpass request submitted successfully!');

        setFormData({
            admissionNo: '',
            reason: '',
            date: new Date().toISOString().split('T')[0],
            timeOut: '',
            timeIn: ''
        });
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="page-container section">
            <div className="container">
                <div style={{ marginBottom: '3rem' }}>
                    <h1 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Campus Outpass</h1>
                    <p className="text-secondary">Request and manage student temporary leave permissions.</p>
                </div>

                <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
                    {/* Form Section */}
                    <div className="card" style={{ overflow: 'visible' }}>
                        <h2 className="mb-4" style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>New Request</h2>
                        {message && <div className="p-3 mb-4 bg-green-100 text-green-700 rounded" style={{ padding: '1rem', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '0.5rem', marginBottom: '1rem' }}>{message}</div>}

                        <form onSubmit={handleSubmit}>
                            <CustomSelect
                                label="Select Class"
                                value={selectedClass}
                                onChange={(e) => {
                                    setSelectedClass(e.target.value);
                                    setFormData(prev => ({ ...prev, admissionNo: '' })); // Reset student
                                }}
                                options={[{ value: '', label: '-- All Classes --' }, ...classes.map(c => ({ value: c, label: c }))]}
                            />

                            <div className="mt-4">
                                <CustomSelect
                                    label="Select Student"
                                    value={formData.admissionNo}
                                    onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                                    options={[{ value: '', label: '-- Select Student --' }, ...filteredStudents.map(s => ({ value: s.admissionNo, label: `${s.firstName} ${s.lastName} (${s.admissionNo})` }))]}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2" style={{ gap: '1rem', marginTop: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Time Out</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={formData.timeOut}
                                        onChange={(e) => setFormData({ ...formData, timeOut: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Expected In</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={formData.timeIn}
                                        onChange={(e) => setFormData({ ...formData, timeIn: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group mt-4">
                                <label className="form-label">Reason</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    required
                                    placeholder="Reason for leaving campus..."
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary w-100" style={{ width: '100%', marginTop: '1rem' }}>Submit Request</button>
                        </form>
                    </div>

                    {/* List Section */}
                    <div className="card">
                        <h2 className="mb-4" style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Recent Outpasses</h2>
                        <div className="table-container" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            <table className="table" style={{ fontSize: '0.75rem', width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th style={{ padding: '0.5rem' }}>Student</th>
                                        <th style={{ padding: '0.5rem' }}>Reason</th>
                                        <th style={{ padding: '0.5rem' }}>Date</th>
                                        <th style={{ padding: '0.5rem' }}>Time</th>
                                        <th style={{ padding: '0.5rem' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {outpasses.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center" style={{ padding: '0.5rem' }}>No records found</td></tr>
                                    ) : (
                                        outpasses.map(op => (
                                            <tr key={op.id}>
                                                <td style={{ padding: '0.5rem' }}>
                                                    <div style={{ fontWeight: '500' }}>{op.studentName}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{op.class}</div>
                                                </td>
                                                <td style={{ padding: '0.5rem', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={op.reason}>{op.reason}</td>
                                                <td style={{ padding: '0.5rem' }}>{op.date}</td>
                                                <td style={{ padding: '0.5rem' }}>{op.timeOut} - {op.timeIn}</td>
                                                <td style={{ padding: '0.5rem' }}>
                                                    <span
                                                        className={`badge ${op.status === 'Approved' ? 'badge-success' : op.status === 'Rejected' ? 'badge-error' : 'badge-warning'}`}
                                                    >
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
                </div>
            </div>
        </div>
    );
};

export default Outpass;
