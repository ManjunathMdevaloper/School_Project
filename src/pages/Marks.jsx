import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useStudents } from '../context/StudentContext';

const Marks = () => {
  const { students, updateMarks, importMarksFromArray, attendance, examSchedules } = useStudents();
  const [activeTab, setActiveTab] = useState('single'); // single or import

  // Single Entry State
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('');
  const [marks, setMarks] = useState('');
  const [status, setStatus] = useState('Pass');
  const [remarks, setRemarks] = useState('');
  const [message, setMessage] = useState('');

  // Import State
  const [importData, setImportData] = useState('');

  // Filter students based on selected class
  const filteredStudents = selectedClass
    ? students.filter(s => s.class === selectedClass)
    : students;

  // Get unique classes
  // Get unique classes
  const classes = React.useMemo(() => {
    const allClasses = [...new Set(students.map(s => s.class))].sort();
    if (selectedSchedule) {
      const schedule = examSchedules.find(s => s.id === selectedSchedule);
      if (schedule && schedule.classes && schedule.classes.length > 0) {
        return allClasses.filter(c => schedule.classes.includes(c));
      }
    }
    return allClasses;
  }, [students, selectedSchedule, examSchedules]);

  // Reset selected class if it's not in the available classes when schedule changes
  React.useEffect(() => {
    if (selectedClass && !classes.includes(selectedClass)) {
      setSelectedClass('');
      setSelectedStudent('');
    }
  }, [classes, selectedClass]);

  // Check if student is absent on the selected date
  const isAbsent = selectedStudent && attendance[examDate] && attendance[examDate][selectedStudent]?.present === false;

  // Sync selectedMonth with examDate
  React.useEffect(() => {
    if (examDate) {
      setSelectedMonth(examDate.slice(0, 7));
    }
  }, [examDate]);

  const handleSingleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent || !subject) {
      setMessage('Please select student and subject');
      return;
    }

    if (isAbsent) {
      setMessage('Cannot enter marks: Student is marked absent on this date.');
      return;
    }

    updateMarks(selectedStudent, selectedMonth, subject, {
      marks: Number(marks),
      status,
      remarks,
      date: examDate
    });

    setMessage('Marks updated successfully!');
    setTimeout(() => setMessage(''), 3000);

    // Reset some fields
    setMarks('');
    setRemarks('');
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importData);
      if (!Array.isArray(parsed)) throw new Error('Data must be an array');
      importMarksFromArray(parsed, selectedMonth);
      setMessage(`Successfully imported ${parsed.length} records.`);
      setImportData('');
    } catch (err) {
      setMessage('Error importing data: ' + err.message);
    }
  };

  const handleFileUpload = (e) => {
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

        // Normalize keys to lowercase to be safe, then map to our format
        const formattedData = data.map(row => {
          // Helper to find key case-insensitively
          const getKey = (key) => Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase());

          const marksKey = getKey('marks') || getKey('mark');
          const marksVal = marksKey ? row[marksKey] : undefined;

          // Find student by Admission No OR (Class + Roll No/Name)
          let admissionNo = row[getKey('admissionNo')] || row[getKey('admission no')] || row[getKey('id')];

          if (!admissionNo) {
            const className = row[getKey('class')];
            const rollNo = row[getKey('rollno')] || row[getKey('roll no')];
            const name = row[getKey('name')] || row[getKey('student name')] || row[getKey('student')];

            if (className) {
              const cleanClass = String(className).trim().toLowerCase();

              // Try Roll No first
              if (rollNo) {
                const cleanRoll = String(rollNo).trim().toLowerCase();
                const found = students.find(s =>
                  s.class.toLowerCase() === cleanClass &&
                  String(s.rollNo).toLowerCase() === cleanRoll
                );
                if (found) admissionNo = found.admissionNo;
              }

              // Try Name if no admissionNo yet
              if (!admissionNo && name) {
                const cleanName = String(name).trim().toLowerCase();
                const found = students.find(s =>
                  s.class.toLowerCase() === cleanClass &&
                  (`${s.firstName} ${s.lastName}`).toLowerCase() === cleanName
                );
                if (found) admissionNo = found.admissionNo;
              }
            }
          }

          return {
            admissionNo,
            subject: row[getKey('subject')],
            marks: marksVal !== undefined ? marksVal : '',
            status: row[getKey('status')] || (marksVal !== undefined ? (Number(marksVal) >= 35 ? 'Pass' : 'Fail') : 'Pass'),
            remarks: row[getKey('remarks')] || ''
          };
        }).filter(item => item.admissionNo && item.subject && item.marks !== ''); // Filter out invalid rows

        if (formattedData.length === 0) {
          throw new Error('No valid data found. Please ensure columns include: Class & Roll No (or Name), Subject, Marks.');
        }

        importMarksFromArray(formattedData, selectedMonth);
        setMessage(`Successfully imported ${formattedData.length} records from Excel.`);
      } catch (err) {
        setMessage('Error parsing Excel file: ' + err.message);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="page-container section">
      <div className="container">
        <h1 className="page-title mb-5" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Marks Management</h1>

        <div className="card mb-5">
          <div className="flex gap-4 mb-4" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button
              className={`btn ${activeTab === 'single' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('single')}
            >
              Single Entry
            </button>
            <button
              className={`btn ${activeTab === 'import' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('import')}
            >
              Bulk Import
            </button>
          </div>

          {message && (
            <div className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
              style={{ padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', backgroundColor: message.includes('Error') ? '#fee2e2' : '#dcfce7', color: message.includes('Error') ? '#b91c1c' : '#15803d' }}>
              {message}
            </div>
          )}

          {activeTab === 'single' ? (
            <form onSubmit={handleSingleSubmit}>
              <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>

                <div className="form-group">
                  <label className="form-label">Exam Schedule (Optional)</label>
                  <select
                    className="form-control"
                    value={selectedSchedule}
                    onChange={(e) => {
                      setSelectedSchedule(e.target.value);
                      setSubject(''); // Reset subject
                    }}
                  >
                    <option value="">-- Manual Entry --</option>
                    {examSchedules.map(sch => (
                      <option key={sch.id} value={sch.id}>{sch.name}</option>
                    ))}
                  </select>
                </div>

                {!selectedSchedule && (
                  <div className="form-group">
                    <label className="form-label">Exam Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Select Class</label>
                  <select
                    className="form-control"
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setSelectedStudent(''); // Reset student when class changes
                    }}
                  >
                    <option value="">{selectedSchedule ? "-- Select Scheduled Class --" : "-- All Classes --"}</option>
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
                    required
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
                  <label className="form-label">Subject</label>
                  <select
                    className="form-control"
                    value={subject}
                    onChange={(e) => {
                      const newSubject = e.target.value;
                      setSubject(newSubject);

                      // Auto-set date if schedule is selected
                      if (selectedSchedule) {
                        const schedule = examSchedules.find(s => s.id === selectedSchedule);
                        const subjectSch = schedule?.subjects.find(s => s.subject === newSubject);
                        if (subjectSch) {
                          setExamDate(subjectSch.date);
                        }
                      }
                    }}
                    required
                  >
                    <option value="">-- Select Subject --</option>
                    {selectedSchedule ? (
                      // Show subjects from selected schedule
                      examSchedules.find(s => s.id === selectedSchedule)?.subjects.map((s, i) => (
                        <option key={i} value={s.subject}>{s.subject} ({s.date})</option>
                      ))
                    ) : (
                      // Default subjects
                      <>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="Social Studies">Social Studies</option>
                        <option value="English">English</option>
                        <option value="Telugu">Telugu</option>
                        <option value="Hindi">Hindi</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Marks Obtained</label>
                  <input
                    type="number"
                    className="form-control"
                    value={marks}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMarks(val);
                      if (val !== '' && !isAbsent) {
                        setStatus(Number(val) >= 35 ? 'Pass' : 'Fail');
                      }
                    }}
                    disabled={isAbsent}
                    placeholder={isAbsent ? "Student Absent" : ""}
                    style={isAbsent ? { backgroundColor: '#fee2e2', cursor: 'not-allowed' } : {}}
                  />
                  {isAbsent && <small className="text-red-500" style={{ color: '#b91c1c', marginTop: '0.25rem', display: 'block' }}>Student is marked absent on this date.</small>}
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Remarks</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter any remarks..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary">Update Marks</button>
            </form>
          ) : (
            <div>
              <div className="form-group mb-4" style={{ maxWidth: '300px', margin: '0 auto 2rem auto' }}>
                <label className="form-label">Select Exam Month</label>
                <input
                  type="month"
                  className="form-control"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  required
                />
              </div>

              <div className="mb-5 p-4 border rounded bg-gray-50" style={{ marginBottom: '2rem', border: '1px dashed #ccc', padding: '2rem', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Import from Excel</h3>
                <p className="text-secondary mb-3">Upload a .xlsx or .xls file with columns: <strong>Class, Roll No (or Name), Subject, Marks, Status</strong></p>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="form-control"
                  style={{ maxWidth: '400px', margin: '0 auto' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marks;
