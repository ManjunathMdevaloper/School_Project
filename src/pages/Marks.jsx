import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useStudents } from '../context/StudentContext';
import CustomSelect from '../components/CustomSelect';

const Marks = () => {
  const {
    students,
    updateMarks,
    importMarksFromArray,
    attendance,
    examSchedules,
    lastImport,
    undoLastImport
  } = useStudents();
  const [activeTab, setActiveTab] = useState('single');

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('');
  const [marks, setMarks] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);
  const [status, setStatus] = useState('Pass');
  const [remarks, setRemarks] = useState('');
  const [message, setMessage] = useState('');

  const handleUndo = async () => {
    if (window.confirm('Are you sure you want to undo the last import?')) {
      const count = await undoLastImport();
      setMessage(`Successfully reverted ${count} records.`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const [importData, setImportData] = useState('');

  const filteredStudents = selectedClass
    ? students.filter(s => s.class === selectedClass)
    : students;

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

  const isAbsent = selectedStudent && attendance[examDate] && attendance[examDate][selectedStudent]?.present === false;

  // Update max marks when schedule changes
  React.useEffect(() => {
    if (selectedSchedule) {
      const sch = examSchedules.find(s => s.id === selectedSchedule);
      if (sch && sch.totalMarks) {
        setMaxMarks(Number(sch.totalMarks));
      }
    }
  }, [selectedSchedule, examSchedules]);

  // Recalculate status when marks or maxMarks change
  React.useEffect(() => {
    if (marks !== '' && !isAbsent) {
      const obtained = Number(marks);
      const total = Number(maxMarks) || 100;
      const passMarks = Math.ceil(total * 0.35);
      setStatus(obtained >= passMarks ? 'Pass' : 'Fail');
    }
  }, [marks, maxMarks, isAbsent]);

  React.useEffect(() => {
    if (selectedClass && !classes.includes(selectedClass)) {
      setSelectedClass('');
      setSelectedStudent('');
    }
  }, [classes, selectedClass]);

  React.useEffect(() => {
    if (examDate) {
      setSelectedMonth(examDate.slice(0, 7));
    }
  }, [examDate]);

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !subject) {
      setMessage('Please select student and subject');
      return;
    }

    if (isAbsent) {
      setMessage('Cannot enter marks: Student is marked absent.');
      return;
    }

    if (marks !== '' && Number(marks) > Number(maxMarks)) {
      setMessage(`Error: Marks obtained (${marks}) cannot be greater than Max Marks (${maxMarks})`);
      return;
    }

    await updateMarks(selectedStudent, selectedMonth, subject, {
      marks: Number(marks),
      totalMarks: Number(maxMarks), // Save the total marks context
      status,
      remarks,
      date: examDate
    });

    setMessage('Marks updated successfully!');
    setTimeout(() => setMessage(''), 3000);
    setMarks('');
    setRemarks('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        let successCount = 0;
        let failCount = 0;
        const failedRows = [];

        const formattedData = data.map((row, index) => {
          const getKey = (key) => Object.keys(row).find(k => k.toLowerCase().replace(/\s/g, '') === key.toLowerCase().replace(/\s/g, ''));

          const marksVal = row[getKey('marks') || getKey('mark') || getKey('obtainedmarks')];
          const totalMarksVal = row[getKey('totalmarks') || getKey('maxmarks') || getKey('outOf')] || 100;
          const subjectVal = row[getKey('subject') || getKey('subjectname')];
          let admissionNo = row[getKey('admissionNo')] || row[getKey('admissionno')] || row[getKey('id')];

          // Lookup Logic If Admission No is missing
          if (!admissionNo) {
            const className = row[getKey('class')] || row[getKey('grade')];
            const rollNo = row[getKey('rollno')];
            const name = row[getKey('name')] || row[getKey('studentname')] || row[getKey('student')];

            if (className) {
              const cleanClass = String(className).trim().toLowerCase();

              // Try Roll No first
              if (rollNo) {
                const cleanRoll = String(rollNo).trim().toLowerCase();
                const found = students.find(s =>
                  s.class.toLowerCase() === cleanClass &&
                  String(s.rollNo).trim().toLowerCase() === cleanRoll
                );
                if (found) admissionNo = found.admissionNo;
              }

              // Try Name matching if roll matching failed or no roll provided
              if (!admissionNo && name) {
                const cleanName = String(name).trim().toLowerCase();
                const found = students.find(s => {
                  const sName = `${s.firstName} ${s.lastName}`.toLowerCase().trim();
                  return s.class.toLowerCase() === cleanClass && (
                    sName === cleanName ||
                    sName.includes(cleanName) ||
                    cleanName.includes(sName)
                  );
                });
                if (found) admissionNo = found.admissionNo;
              }
            }
          }

          if (admissionNo && subjectVal && marksVal !== undefined && marksVal !== '') {
            const obtained = Number(marksVal);
            const total = Number(totalMarksVal);

            if (obtained > total) {
              failCount++;
              failedRows.push({
                row: index + 2,
                name: row[getKey('name')] || row[getKey('studentname')] || 'Unknown',
                class: row[getKey('class')] || 'Unknown',
                reason: `Marks (${obtained}) exceed Max Marks (${total})`
              });
              return null;
            }

            successCount++;
            const passMarks = Math.ceil(total * 0.35);
            return {
              admissionNo: String(admissionNo),
              subject: subjectVal,
              marks: obtained,
              totalMarks: total,
              status: row[getKey('status')] || (obtained >= passMarks ? 'Pass' : 'Fail'),
              remarks: row[getKey('remarks')] || ''
            };
          } else {
            failCount++;
            failedRows.push({
              row: index + 2,
              name: row[getKey('name')] || row[getKey('studentname')] || 'Unknown',
              class: row[getKey('class')] || 'Unknown',
              reason: !admissionNo ? 'Student not found (check Class/Roll No)' : (!subjectVal ? 'Missing Subject' : 'Missing Marks')
            });
            return null;
          }
        }).filter(Boolean);

        if (formattedData.length === 0) {
          throw new Error('No valid data found. Check column headers: Class, Roll No (or Name), Subject, Marks.');
        }

        await importMarksFromArray(formattedData, selectedMonth);

        let finalMsg = `Successfully imported ${successCount} records.`;
        if (failCount > 0) {
          finalMsg += ` ${failCount} records failed (Check console for details).`;
          console.warn('Failed Import Rows:', failedRows);
        }
        setMessage(finalMsg);
      } catch (err) {
        setMessage('Error parsing Excel: ' + err.message);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="page-container section">
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <h1 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Marks Management</h1>
          <p className="text-secondary">Track academic performance across classes and subjects.</p>
        </div>

        <div className="card mb-5" style={{ overflow: 'visible' }}>
          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`}
              onClick={() => setActiveTab('single')}
            >
              Manual Entry
            </button>
            <button
              className={`tab-btn ${activeTab === 'import' ? 'active' : ''}`}
              onClick={() => setActiveTab('import')}
            >
              Excel Import
            </button>
            {lastImport && lastImport.records.length > 0 && (
              <button className="btn btn-sm" style={{ marginLeft: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }} onClick={handleUndo}>Revert Last Import</button>
            )}
          </div>

          {message && (
            <div className={`p-4 mb-6 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`} style={{ border: '1px solid currentColor' }}>
              {message}
            </div>
          )}

          <div className="tab-content" key={activeTab}>
            {activeTab === 'single' ? (
              <form onSubmit={handleSingleSubmit}>
                <div className="grid grid-cols-2" style={{ gap: '2rem', marginBottom: '2rem' }}>
                  <CustomSelect
                    label="Exam Schedule"
                    value={selectedSchedule}
                    onChange={(e) => { setSelectedSchedule(e.target.value); setSubject(''); }}
                    options={[{ value: '', label: '-- Manual Entry --' }, ...examSchedules.map(sch => ({ value: sch.id, label: sch.name }))]}
                  />

                  {!selectedSchedule ? (
                    <div className="filter-group">
                      <label>Exam Date</label>
                      <input type="date" className="form-control" value={examDate} onChange={(e) => setExamDate(e.target.value)} required />
                    </div>
                  ) : (
                    <div className="filter-group">
                      <label>Assigned Date</label>
                      <input type="date" className="form-control" value={examDate} readOnly style={{ background: 'rgba(0,0,0,0.02)', cursor: 'not-allowed' }} />
                    </div>
                  )}

                  <CustomSelect
                    label="Class"
                    value={selectedClass}
                    onChange={(e) => { setSelectedClass(e.target.value); setSelectedStudent(''); }}
                    options={[{ value: '', label: '-- Select Class --' }, ...classes.map(c => ({ value: c, label: c }))]}
                  />

                  <CustomSelect
                    label="Student"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    options={[{ value: '', label: '-- Select Student --' }, ...filteredStudents.map(s => ({ value: s.admissionNo, label: `${s.firstName} ${s.lastName} (${s.admissionNo})` }))]}
                  />

                  <CustomSelect
                    label="Subject"
                    value={subject}
                    onChange={(e) => {
                      const sub = e.target.value;
                      setSubject(sub);
                      if (selectedSchedule) {
                        const sch = examSchedules.find(s => s.id === selectedSchedule);
                        const subSch = sch?.subjects.find(s => s.subject === sub);
                        if (subSch) setExamDate(subSch.date);
                      }
                    }}
                    options={[
                      { value: '', label: '-- Select Subject --' },
                      ...(selectedSchedule
                        ? (examSchedules.find(s => s.id === selectedSchedule)?.subjects.map(s => ({ value: s.subject, label: `${s.subject} (${s.date})` })) || [])
                        : ['Mathematics', 'Science', 'Social Studies', 'English', 'Telugu', 'Hindi'].map(s => ({ value: s, label: s }))
                      )
                    ]}
                  />

                  <div className="filter-group">
                    <label>Max Marks</label>
                    <input
                      type="number"
                      className="form-control"
                      value={maxMarks}
                      onChange={(e) => setMaxMarks(e.target.value)}
                      readOnly={!!selectedSchedule}
                      placeholder="Max marks for this test"
                      style={selectedSchedule ? { background: 'rgba(0,0,0,0.02)', cursor: 'not-allowed' } : {}}
                      required
                    />
                  </div>

                  <div className="filter-group">
                    <label>
                      Marks Obtained
                      <span style={{ fontSize: '0.75rem', color: 'var(--secondary-color)', marginLeft: '0.5rem', textTransform: 'none' }}>
                        (Pass ≥ {Math.ceil(Number(maxMarks) * 0.35)})
                      </span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                      disabled={isAbsent}
                      max={maxMarks}
                      placeholder={isAbsent ? "Student Absent" : `Out of ${maxMarks}`}
                      style={isAbsent ? { background: '#fee2e2', cursor: 'not-allowed' } : {}}
                    />
                  </div>

                  <CustomSelect
                    label="Result Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    options={[
                      { value: 'Pass', label: 'Pass' },
                      { value: 'Fail', label: 'Fail' },
                      { value: 'Absent', label: 'Absent' }
                    ]}
                  />
                </div>

                <div className="form-group mb-8">
                  <label className="form-label">Additional Remarks</label>
                  <textarea className="form-control" rows="3" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Enter any teacher remarks..."></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem' }}>Finalize & Save Marks</button>
              </form>
            ) : (
              <div className="py-8">
                <div className="form-group mb-8" style={{ maxWidth: '400px', margin: '0 auto' }}>
                  <label className="form-label" style={{ textAlign: 'center', display: 'block' }}>Exam Month</label>
                  <input type="month" className="form-control" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} required />
                </div>

                <div className="p-12 border-2 border-dashed rounded-xl text-center" style={{ borderColor: 'var(--secondary-color)', background: 'rgba(197, 160, 89, 0.05)', transition: 'all 0.3s ease' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>📁</div>
                  <h3 className="mb-4" style={{ color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: 'bold' }}>Bulk Spreadsheet Import</h3>
                  <p className="text-secondary mb-8" style={{ fontSize: '1rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                    Quickly upload student marks using an Excel file. <br />
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--secondary-color)' }}>
                      Required Columns: Class, Roll No (or Name), Subject, and Marks.
                    </span>
                  </p>

                  <div style={{ position: 'relative', maxWidth: '450px', margin: '0 auto' }}>
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={handleFileUpload}
                      className="form-control"
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marks;