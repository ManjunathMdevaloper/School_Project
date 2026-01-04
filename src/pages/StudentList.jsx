import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useStudents } from '../context/StudentContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import CustomSelect from '../components/CustomSelect';

const StudentList = () => {
  const { students, addStudent, addStudentsBulk, deleteStudent } = useStudents();
  const { userRole } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManualClass, setIsManualClass] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [filterClass, setFilterClass] = useState('');
  const [activeTab, setActiveTab] = useState('single');
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

  const classes = [...new Set(students.map(s => s.class))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const admissionNo = await addStudent(formData);
      setIsModalOpen(false);
      setIsManualClass(false);
      setMessage(`Student added successfully! Admission No: ${admissionNo}`);
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
    } finally {
      setIsSubmitting(false);
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

  const classOptions = [
    { value: '', label: 'All Classes' },
    ...classes.map(c => ({ value: c, label: c }))
  ];

  return (
    <div className="page-container section">
      <div className="container">
        <div className="flex-responsive mb-5">
          <div>
            <h1 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Student List</h1>
            <p className="text-secondary">A comprehensive view of your student body.</p>
          </div>
          <div className="flex gap-4">
            {userRole === 'admin' && (
              <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                + Register Student
              </button>
            )}
          </div>
        </div>

        <div className="filter-card" style={{ overflow: 'visible' }}>
          <div className="filter-group flex-4">
            <label>Search Directory</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, ID or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <CustomSelect
            containerClass="filter-group flex-1"
            label="Class Division"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            options={classOptions}
            placeholder="Filter by Class"
          />
        </div>

        {message && (
          <div className={`badge ${message.includes('Error') ? 'badge-error' : 'badge-success'} mb-8 p-6 rounded-xl flex items-center justify-center gap-3`}
            style={{ width: '100%', fontSize: '1.1rem', border: '1px solid currentColor', minHeight: '60px' }}>
            {message.includes('Error') ? '❌' : '✅'} {message}
          </div>
        )}

        <div className="card table-container">
          <table className="table table-wide">
            <thead>
              <tr>
                <th>Admission No</th>
                <th>Full Name</th>
                <th>Class</th>
                <th>Roll No</th>
                <th>Parent Name</th>
                <th>Contact</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.admissionNo}>
                  <td><span className="badge badge-info">{student.admissionNo}</span></td>
                  <td style={{ fontWeight: '600' }}>{student.firstName} {student.lastName}</td>
                  <td>{student.class}</td>
                  <td>{student.rollNo}</td>
                  <td>{student.parentName || '-'}</td>
                  <td>{student.phone}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link to={`/overview?id=${student.admissionNo}`} className="btn btn-sm btn-outline">
                        View Profile
                      </Link>
                      {userRole === 'admin' && (
                        <button
                          className="btn btn-sm btn-outline btn-danger"
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
                  <td colSpan="7" className="text-center py-8 text-secondary">No students found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Student Registration</h2>
              <button className="close-btn" onClick={() => {
                setIsModalOpen(false);
                setIsManualClass(false);
                setActiveTab('single');
              }}>&times;</button>
            </div>

            <div className="tabs-container">
              <button
                className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`}
                onClick={() => setActiveTab('single')}
              >
                Single Entry
              </button>
              <button
                className={`tab-btn ${activeTab === 'bulk' ? 'active' : ''}`}
                onClick={() => setActiveTab('bulk')}
              >
                Bulk Import
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'single' ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="form-control" />
                    </div>
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label className="form-label" style={{ marginBottom: 0 }}>Class Division</label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsManualClass(!isManualClass);
                            setFormData(prev => ({ ...prev, class: '' }));
                          }}
                          style={{ fontSize: '0.75rem', color: 'var(--secondary-color)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                        >
                          {isManualClass ? 'Switch to Select' : 'Type Manually'}
                        </button>
                      </div>

                      {!isManualClass ? (
                        <CustomSelect
                          value={formData.class}
                          onChange={(e) => handleInputChange({ target: { name: 'class', value: e.target.value } })}
                          options={classes.map(c => ({ value: c, label: c }))}
                          placeholder="Select Class"
                        />
                      ) : (
                        <input
                          required
                          type="text"
                          name="class"
                          placeholder="e.g. 10th Grade"
                          value={formData.class}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Roll Number</label>
                      <input required type="text" name="rollNo" value={formData.rollNo} onChange={handleInputChange} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Parent Name</label>
                      <input required name="parentName" value={formData.parentName} onChange={handleInputChange} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input required name="phone" value={formData.phone} onChange={handleInputChange} className="form-control" />
                    </div>
                  </div>
                  <div className="form-group mt-4">
                    <label className="form-label">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-control" />
                  </div>
                  <div className="text-center mt-6">
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={isSubmitting}>
                      {isSubmitting ? 'Registering...' : 'Complete Registration'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-8 text-center">
                  <div className="mb-6">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                    <h3 style={{ color: 'var(--primary-color)' }}>Bulk Excel Registration</h3>
                    <p className="text-secondary">Upload an Excel file with these columns:<br />First Name, Last Name, Class, Roll No, Phone, Parent Name</p>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleBulkUpload}
                    style={{ display: 'none' }}
                    accept=".xlsx, .xls"
                  />
                  <button
                    className="btn btn-outline"
                    onClick={() => fileInputRef.current.click()}
                    style={{ padding: '1.5rem 3rem', borderStyle: 'dashed', borderWidth: '2px' }}
                  >
                    Select Excel File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
