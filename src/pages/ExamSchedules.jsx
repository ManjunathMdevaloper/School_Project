import React, { useState } from 'react';
import { useStudents } from '../context/StudentContext';

const ExamSchedules = () => {
    const { examSchedules, addExamSchedule, deleteExamSchedule, updateExamSchedule, students } = useStudents();
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        totalMarks: '',
        classes: [],
        subjects: []
    });

    const [subjectInput, setSubjectInput] = useState({ date: '', subject: '' });
    const [message, setMessage] = useState('');

    // Get unique classes
    const availableClasses = [...new Set(students.map(s => s.class))].sort();

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'endDate' && formData.startDate && value < formData.startDate) {
            alert('End Date cannot be before Start Date');
            return;
        }

        if (name === 'startDate' && formData.endDate && value > formData.endDate) {
            setFormData(prev => ({ ...prev, [name]: value, endDate: '' }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleClassToggle = (cls) => {
        setFormData(prev => {
            const currentClasses = prev.classes;
            if (currentClasses.includes(cls)) {
                return { ...prev, classes: currentClasses.filter(c => c !== cls) };
            } else {
                return { ...prev, classes: [...currentClasses, cls] };
            }
        });
    };

    const addSubject = () => {
        if (!subjectInput.date || !subjectInput.subject) {
            alert('Please enter both date and subject');
            return;
        }

        if (!formData.startDate || !formData.endDate) {
            alert('Please select Start Date and End Date for the exam schedule first.');
            return;
        }

        const subjDate = new Date(subjectInput.date);
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);

        // Reset hours to compare just dates
        subjDate.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        if (subjDate < start || subjDate > end) {
            alert(`Subject date must be between ${formData.startDate} and ${formData.endDate}`);
            return;
        }

        setFormData(prev => ({
            ...prev,
            subjects: [...prev.subjects, subjectInput].sort((a, b) => new Date(a.date) - new Date(b.date))
        }));
        setSubjectInput({ date: '', subject: '' });
    };

    const removeSubject = (index) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.subjects.length === 0) {
            setMessage('Error: Please add at least one subject schedule.');
            return;
        }
        if (formData.classes.length === 0) {
            setMessage('Error: Please select at least one class.');
            return;
        }
        if (!formData.totalMarks) {
            setMessage('Error: Please enter total marks.');
            return;
        }

        if (editingId) {
            updateExamSchedule(editingId, formData);
            setMessage('Exam Schedule updated successfully!');
            setEditingId(null);
        } else {
            addExamSchedule(formData);
            setMessage('Exam Schedule created successfully!');
        }

        setFormData({
            name: '',
            startDate: '',
            endDate: '',
            totalMarks: '',
            classes: [],
            subjects: []
        });
        setTimeout(() => setMessage(''), 3000);
    };

    const handleEdit = (schedule) => {
        setEditingId(schedule.id);
        setFormData({
            name: schedule.name,
            startDate: schedule.startDate,
            endDate: schedule.endDate,
            totalMarks: schedule.totalMarks || '',
            classes: schedule.classes,
            subjects: schedule.subjects
        });
        // Scroll to top to see the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            name: '',
            startDate: '',
            endDate: '',
            totalMarks: '',
            classes: [],
            subjects: []
        });
    };

    return (
        <div className="page-container section">
            <div className="container">
                <h1 className="page-title mb-5" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Exam Schedules</h1>

                <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
                    {/* Form Section */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>{editingId ? 'Edit Schedule' : 'Create New Schedule'}</h2>
                            {editingId && (
                                <button onClick={handleCancelEdit} className="btn btn-sm btn-outline" style={{ fontSize: '0.8rem' }}>Cancel</button>
                            )}
                        </div>

                        {message && (
                            <div className={`p-3 mb-4 rounded ${message.includes('Error') ? 'badge-error' : 'badge-success'}`}
                                style={{ padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', width: '100%', textAlign: 'center' }}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Exam Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="e.g. Unit Test 1, Quarterly Exams"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Total Marks</label>
                                    <input
                                        type="number"
                                        name="totalMarks"
                                        className="form-control"
                                        placeholder="e.g. 50, 100"
                                        value={formData.totalMarks}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        className="form-control"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        className="form-control"
                                        value={formData.endDate}
                                        min={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Applicable Classes</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    {availableClasses.map(cls => (
                                        <button
                                            key={cls}
                                            type="button"
                                            onClick={() => handleClassToggle(cls)}
                                            className={`btn btn-sm ${formData.classes.includes(cls) ? 'btn-primary' : 'btn-outline'}`}
                                            style={{
                                                fontSize: '0.8rem',
                                                padding: '0.25rem 0.75rem',
                                            }}
                                        >
                                            {cls}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="divider" style={{ borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }}></div>

                            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Subject Schedule</h3>

                            <div className="grid grid-cols-2" style={{ gap: '1rem', alignItems: 'end', marginBottom: '1rem' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={subjectInput.date}
                                        min={formData.startDate}
                                        max={formData.endDate}
                                        onChange={(e) => setSubjectInput({ ...subjectInput, date: e.target.value })}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Subject</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Subject Name"
                                            value={subjectInput.subject}
                                            onChange={(e) => setSubjectInput({ ...subjectInput, subject: e.target.value })}
                                        />
                                        <button type="button" className="btn btn-primary" onClick={addSubject}>Add</button>
                                    </div>
                                </div>
                            </div>

                            {formData.subjects.length > 0 && (
                                <div className="table-container mb-4" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    <table className="table" style={{ fontSize: '0.85rem', width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ padding: '0.5rem' }}>Date</th>
                                                <th style={{ padding: '0.5rem' }}>Day</th>
                                                <th style={{ padding: '0.5rem' }}>Subject</th>
                                                <th style={{ padding: '0.5rem' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formData.subjects.map((s, index) => (
                                                <tr key={index}>
                                                    <td style={{ padding: '0.5rem' }}>{s.date}</td>
                                                    <td style={{ padding: '0.5rem' }}>{new Date(s.date).toLocaleDateString('en-US', { weekday: 'short' })}</td>
                                                    <td style={{ padding: '0.5rem' }}>{s.subject}</td>
                                                    <td style={{ padding: '0.5rem' }}>
                                                        <button
                                                            type="button"
                                                            className="badge-danger"
                                                            onClick={() => removeSubject(index)}
                                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--error-text)' }}
                                                        >
                                                            &times;
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary w-100" style={{ width: '100%', marginTop: '1rem' }}>
                                {editingId ? 'Update Schedule' : 'Create Schedule'}
                            </button>
                        </form>
                    </div>

                    {/* List Section */}
                    <div className="card">
                        <h2 className="mb-4" style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Active Schedules</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {examSchedules.length === 0 ? (
                                <p className="text-secondary text-center">No exam schedules found.</p>
                            ) : (
                                examSchedules.map(schedule => (
                                    <div key={schedule.id} className="card p-4" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{schedule.name}</h3>
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                <button
                                                    onClick={() => handleEdit(schedule)}
                                                    className="btn btn-sm btn-outline"
                                                    style={{ borderStyle: 'none', color: 'var(--accent-color)' }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteExamSchedule(schedule.id)}
                                                    className="btn btn-sm btn-outline btn-danger"
                                                    style={{ borderStyle: 'none' }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                            {schedule.startDate} to {schedule.endDate}
                                        </p>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                            <strong>Total Marks:</strong> {schedule.totalMarks || 'N/A'}
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.75rem' }}>
                                            {schedule.classes.map(c => (
                                                <span key={c} className="badge badge-info" style={{ fontSize: '0.7rem' }}>{c}</span>
                                            ))}
                                        </div>
                                        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                            <table className="table" style={{ fontSize: '0.75rem', width: '100%', margin: 0 }}>
                                                <tbody>
                                                    {schedule.subjects.map((s, i) => (
                                                        <tr key={i}>
                                                            <td style={{ padding: '0.25rem' }}>{s.date}</td>
                                                            <td style={{ padding: '0.25rem' }}>{s.subject}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamSchedules;
