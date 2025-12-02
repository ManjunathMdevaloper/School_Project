import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useStudents } from '../context/StudentContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const StudentList = () => {
  const { students, addStudent, addStudentsBulk, deleteStudent } = useStudents();
  const { userRole } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    class: '',
    rollNo: '',
    email: '',
    phone: '',
    parentName: ''
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNo.includes(searchTerm);
    const matchesClass = filterClass ? student.class === filterClass : true;
    return matchesSearch && matchesClass;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [message, setMessage] = useState('');

  // Get unique classes for dropdown
  const classes = [...new Set(students.map(s => s.class))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const newId = addStudent(formData);
      setIsModalOpen(false);
      setMessage(`Student added successfully! Admission No: ${newId}`);
      setTimeout(() => setMessage(''), 5000);
      setFormData({
        firstName: '',
        lastName: '',
        class: '',
        rollNo: '',
        email: '',
        phone: '',
        parentName: ''
      });
    } catch (error) {
      console.error("Failed to add student:", error);
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          setMessage('Error: No data found in file');
          return;
        }

        const studentsToAdd = [];
        data.forEach(row => {
          const student = {
            firstName: row['First Name'] || row['firstName'] || '',
            lastName: row['Last Name'] || row['lastName'] || '',
            class: row['Class'] || row['class'] || '',
            rollNo: row['Roll No'] || row['rollNo'] || '',
            email: row['Email'] || row['email'] || '',
            phone: row['Phone'] || row['phone'] || '',
            parentName: row['Parent Name'] || row['parentName'] || ''
          };

          if (student.firstName && student.class) {
            studentsToAdd.push(student);
          }
        });

        if (studentsToAdd.length > 0) {
          const count = addStudentsBulk(studentsToAdd);
          setMessage(`Successfully added ${count} students from Excel.`);
        } else {
          setMessage('Error: No valid student records found in Excel. Please check column names.');
        }
        setTimeout(() => setMessage(''), 5000);

      } catch (error) {
        console.error("Error parsing Excel:", error);
        setMessage('Error parsing Excel file');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = null;
  };

  return (
    <div className="page-container section">
      <div className="container">
        <div className="flex-responsive mb-5">
          <div>
            <h1 className="page-title" style={{ fontSize: '2rem', fontWeight: 'bold' }}>Student List</h1>
            <p className="text-secondary">Total Students: {students.length}</p>
          </div>
          <div>
            {userRole === 'admin' && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textAlign: 'right' }}>
                Excel Columns: First Name, Last Name, Class, Roll No, Parent Name, Phone, Email
              </p>
            )}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {userRole === 'admin' && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleBulkUpload}
                    style={{ display: 'none' }}
                    accept=".xlsx, .xls"
                  />
                  <button className="btn btn-outline" onClick={() => fileInputRef.current.click()}>
                    Import Excel
                  </button>
                  <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    + Add New Student
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="card mb-5">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or admission number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <select
                className="form-control"
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
              >
                <option value="">-- All Classes --</option>
                {classes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {message && (
          <div className={`card mb-5 p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
            style={{ padding: '1rem', backgroundColor: message.includes('Error') ? '#fee2e2' : '#dcfce7', color: message.includes('Error') ? '#b91c1c' : '#15803d', borderRadius: '0.5rem' }}>
            {message}
          </div>
        )}

        <div className="card table-container">
          <table className="table" style={{ fontSize: '0.75rem', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ padding: '0.5rem' }}>Admission No</th>
                <th style={{ padding: '0.5rem' }}>Name</th>
                <th style={{ padding: '0.5rem' }}>Class</th>
                <th style={{ padding: '0.5rem' }}>Roll No</th>
                <th style={{ padding: '0.5rem' }}>Parent Name</th>
                <th style={{ padding: '0.5rem' }}>Contact</th>
                <th style={{ padding: '0.5rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.admissionNo}>
                  <td style={{ padding: '0.5rem' }}><span className="badge badge-info" style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>{student.admissionNo}</span></td>
                  <td style={{ padding: '0.5rem' }}>{student.firstName} {student.lastName}</td>
                  <td style={{ padding: '0.5rem' }}>{student.class}</td>
                  <td style={{ padding: '0.5rem' }}>{student.rollNo}</td>
                  <td style={{ padding: '0.5rem' }}>{student.parentName || '-'}</td>
                  <td style={{ padding: '0.5rem' }}>{student.phone}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/overview?id=${student.admissionNo}`} className="btn btn-sm btn-outline" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                        View
                      </Link>
                      {userRole === 'admin' && (
                        <button
                          className="btn btn-sm btn-outline"
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderColor: '#ef4444', color: '#ef4444' }}
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this student?')) {
                              deleteStudent(student.admissionNo);
                              setMessage('Student deleted successfully.');
                              setTimeout(() => setMessage(''), 3000);
                            }
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center" style={{ padding: '0.5rem' }}>No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Add New Student</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label className="form-label">Class</label>
                  <select required name="class" value={formData.class} onChange={handleInputChange} className="form-control">
                    <option value="">Select Class</option>
                    {classes.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="New Class">New Class (Type Manually)</option>
                  </select>
                  {formData.class === 'New Class' && (
                    <input
                      type="text"
                      placeholder="Enter Class Name"
                      className="form-control mt-2"
                      style={{ marginTop: '0.5rem' }}
                      onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                    />
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Roll No</label>
                  <input required type="text" name="rollNo" value={formData.rollNo} onChange={handleInputChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label className="form-label">Parent Name</label>
                  <input required name="parentName" value={formData.parentName} onChange={handleInputChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} className="form-control" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-control" />
              </div>
              <div className="text-center mt-4" style={{ marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
