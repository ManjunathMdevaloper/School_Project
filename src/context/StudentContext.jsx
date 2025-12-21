// src/context/StudentContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const StudentContext = createContext();

export function useStudents() {
  return useContext(StudentContext);
}

export function StudentProvider({ children }) {
  const API_URL = 'http://localhost:8080/api/students';

  // --- Students State (Fetched from Backend) ---
  const [students, setStudents] = useState([]);

  // --- Other States (Fetched from Backend) ---
  const [marks, setMarks] = useState({});
  const [attendance, setAttendance] = useState({});
  const [outpasses, setOutpasses] = useState([]);
  const [examSchedules, setExamSchedules] = useState([]);

  const API_BASE = 'http://localhost:8080/api';

  // --- Fetch Data on Mount ---
  useEffect(() => {
    fetchStudents();
    fetchMarks();
    fetchAttendance();
    fetchOutpasses();
    fetchExamSchedules();

    // Polling for Outpasses (Notifications)
    const interval = setInterval(() => {
      fetchOutpasses();
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, []);

  // --- Fetch Functions ---

  // Note: fetchStudents is defined below, ensure it uses API_BASE or existing API_URL

  const fetchMarks = async () => {
    try {
      const response = await fetch(`${API_BASE}/marks`);
      if (response.ok) {
        const data = await response.json();
        // Transform List<Mark> to Frontend Object Structure
        const marksObj = {};
        data.forEach(m => {
          // Safely access nested student
          const admNo = m.student ? m.student.admissionNo : 'UNKNOWN';
          const month = m.month || 'General';
          const subject = m.subject || 'Subject';

          if (!marksObj[admNo]) marksObj[admNo] = {};
          if (!marksObj[admNo][month]) marksObj[admNo][month] = {};

          marksObj[admNo][month][subject] = {
            marks: m.marksObtained,
            status: 'present', // Defaulting as backend Mark entity assumes presence if mark exists
            remarks: m.grade || ''
          };
        });
        setMarks(marksObj);
      }
    } catch (e) { console.error("Error fetching marks", e); }
  };

  // --- Helper: Get Local Date String (YYYY-MM-DD) ---
  const getLocalDateString = (date = new Date()) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  };

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${API_BASE}/attendance`);
      if (response.ok) {
        const data = await response.json();
        const attObj = {};
        data.forEach(a => {
          const dateStr = a.attendanceDate;
          const admNo = a.student ? a.student.admissionNo : 'UNKNOWN';

          if (!attObj[dateStr]) attObj[dateStr] = {};
          attObj[dateStr][admNo] = {
            present: a.present,
            intimation: a.intimation,
            intimatedBy: a.intimatedBy,
            reason: a.reason
          };
        });
        setAttendance(attObj);
      }
    } catch (e) { console.error("Error fetching attendance", e); }
  };

  const fetchOutpasses = async () => {
    try {
      const response = await fetch(`${API_BASE}/outpasses`);
      if (response.ok) {
        const data = await response.json();
        const mappedOutpasses = data.map(op => ({
          id: op.id,
          studentName: op.student ? `${op.student.firstName} ${op.student.lastName}` : 'Unknown',
          class: op.student ? op.student.className : '',
          admissionNo: op.student ? op.student.admissionNo : '',
          reason: op.reason,
          date: op.fromDate ? op.fromDate.split('T')[0] : '',
          timeOut: op.fromDate && op.fromDate.includes('T') ? op.fromDate.split('T')[1].substring(0, 5) : '',
          timeIn: op.toDate && op.toDate.includes('T') ? op.toDate.split('T')[1].substring(0, 5) : '',
          status: op.status,
          timestamp: op.fromDate
        }));
        // Sort newest first
        mappedOutpasses.sort((a, b) => b.id - a.id);
        setOutpasses(mappedOutpasses);
      }
    } catch (e) { console.error("Error fetching outpasses", e); }
  };

  const fetchExamSchedules = async () => {
    try {
      const response = await fetch(`${API_BASE}/exam-schedules`);
      if (response.ok) {
        const data = await response.json();
        setExamSchedules(data);
      }
    } catch (e) { console.error("Error fetching exams", e); }
  };


  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        // Map backend 'className' to frontend 'class'
        const mappedData = data.map(s => ({
          ...s,
          class: s.className // Map backend field to frontend expected field
        }));
        setStudents(mappedData);
      } else {
        console.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // --- LocalStorage Effects Removed (Now using Backend) ---


  // --- Helper: Generate Admission No (Client-side logic preserved for consistency) ---
  function generateAdmissionNo() {
    const year = new Date().getFullYear();
    let maxSeq = 0;
    students.forEach(s => {
      if (s.admissionNo && s.admissionNo.startsWith(`${year}-`)) {
        const parts = s.admissionNo.split('-');
        const seq = parseInt(parts[1], 10);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    });
    const next = maxSeq + 1;
    const pad = String(next).padStart(3, '0');
    return `${year}-${pad}`;
  }

  // --- Student CRUD Operations (Backend Connected) ---

  async function addStudent(studentObj) {
    const admissionNo = generateAdmissionNo();
    // Map frontend 'class' to backend 'className'
    const newStudentPayload = {
      admissionNo,
      firstName: studentObj.firstName,
      lastName: studentObj.lastName,
      className: studentObj.class, // Map here
      rollNo: studentObj.rollNo,
      email: studentObj.email,
      phone: studentObj.phone,
      parentName: studentObj.parentName
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudentPayload)
      });

      if (response.ok) {
        const savedStudent = await response.json();
        // Update local state with the saved student (mapped back)
        setStudents(prev => [...prev, { ...savedStudent, class: savedStudent.className }]);
        return admissionNo;
      } else {
        console.error('Failed to add student');
        return null;
      }
    } catch (error) {
      console.error('Error adding student:', error);
      return null;
    }
  }

  async function addStudentsBulk(studentsArray) {
    // For now, we will loop and add them one by one to ensure backend validation runs
    // In a production app, we would create a bulk endpoint
    let count = 0;
    const year = new Date().getFullYear();
    let maxSeq = 0;

    // Calculate maxSeq from current state to avoid duplicates during bulk loop
    students.forEach(s => {
      if (s.admissionNo && s.admissionNo.startsWith(`${year}-`)) {
        const parts = s.admissionNo.split('-');
        const seq = parseInt(parts[1], 10);
        if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
      }
    });

    for (let i = 0; i < studentsArray.length; i++) {
      const s = studentsArray[i];
      const next = maxSeq + 1 + i;
      const pad = String(next).padStart(3, '0');
      const admissionNo = `${year}-${pad}`;

      const payload = {
        admissionNo,
        firstName: s.firstName,
        lastName: s.lastName,
        className: s.class,
        rollNo: s.rollNo,
        email: s.email,
        phone: s.phone,
        parentName: s.parentName
      };

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) count++;
      } catch (e) {
        console.error('Error in bulk add:', e);
      }
    }

    // Refresh list after bulk add
    fetchStudents();
    return count;
  }

  async function updateStudent(admissionNo, updates) {
    // Find the student to get their DB ID
    const studentToUpdate = students.find(s => s.admissionNo === admissionNo);
    if (!studentToUpdate || !studentToUpdate.id) return;

    const payload = {
      ...studentToUpdate,
      ...updates,
      className: updates.class || studentToUpdate.class // Ensure class is mapped
    };

    try {
      const response = await fetch(`${API_URL}/${studentToUpdate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updatedData = await response.json();
        setStudents(prev => prev.map(s => s.admissionNo === admissionNo ? { ...updatedData, class: updatedData.className } : s));
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  }

  async function deleteStudent(admissionNo) {
    const studentToDelete = students.find(s => s.admissionNo === admissionNo);
    if (!studentToDelete || !studentToDelete.id) return;

    try {
      const response = await fetch(`${API_URL}/${studentToDelete.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setStudents(prev => prev.filter(s => s.admissionNo !== admissionNo));
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  }

  async function deleteStudentsBulk(admissionNos) {
    // Loop delete for now
    for (const admissionNo of admissionNos) {
      await deleteStudent(admissionNo);
    }
  }

  // --- Other Operations (Marks, Attendance, Outpass - Still LocalStorage) ---

  // --- Connected Operations ---

  async function updateMarks(admissionNo, month, subject, markObj) {
    // 1. Update Local State (Optimistic)
    setMarks(prev => {
      const copy = { ...prev };
      if (!copy[admissionNo]) copy[admissionNo] = {};
      if (!copy[admissionNo][month]) copy[admissionNo][month] = {};
      copy[admissionNo][month][subject] = markObj;
      return copy;
    });

    // 2. Persist to Backend
    const student = students.find(s => s.admissionNo === admissionNo);
    if (!student) return;

    const payload = {
      student: { id: student.id },
      month: month,
      subject: subject,
      marksObtained: markObj.marks,
      grade: markObj.remarks,
      maxMarks: 100
    };

    try {
      await fetch(`${API_BASE}/marks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) { console.error("Failed to save mark", e); }
  }

  async function importMarksFromArray(rows, selectedMonth) {
    // Loop serial requests for now
    for (const r of rows) {
      const markData = {
        marks: Number(r.marks),
        status: r.status || 'present',
        remarks: r.remarks || ''
      };
      await updateMarks(r.admissionNo, selectedMonth || r.month || new Date().toISOString().slice(0, 7), r.subject, markData);
    }
  }

  async function setAttendanceForDate(dateISO, admissionNo, record) {
    setAttendance(prev => {
      const copy = { ...prev };
      if (!copy[dateISO]) copy[dateISO] = {};
      copy[dateISO][admissionNo] = record;
      return copy;
    });

    const payload = {
      student: { admissionNo: admissionNo },
      attendanceDate: dateISO,
      present: record.present,
      intimation: record.intimation,
      intimatedBy: record.intimatedBy,
      reason: record.reason
    };

    try {
      const res = await fetch(`${API_BASE}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        console.error("Failed to save attendance, status:", res.status);
      }
    } catch (e) { console.error("Failed to save attendance", e); }
  }

  async function addOutpass(outpassObj) {
    const admissionNo = outpassObj.admissionNo;
    const student = students.find(s => s.admissionNo === admissionNo);

    // Optimistic
    const tempId = Date.now().toString();
    const newOutpass = { id: tempId, status: 'PENDING', timestamp: new Date().toISOString(), ...outpassObj };
    setOutpasses(prev => [newOutpass, ...prev]);

    if (student) {
      const payload = {
        student: { admissionNo: outpassObj.admissionNo },
        reason: outpassObj.reason,
        fromDate: `${outpassObj.date}T${outpassObj.timeOut}:00`,
        toDate: `${outpassObj.date}T${outpassObj.timeIn}:00`,
        status: 'PENDING'
      };
      try {
        const res = await fetch(`${API_BASE}/outpasses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          fetchOutpasses(); // Refresh to get real DB ID
        }
      } catch (e) { console.error("Failed to create outpass", e); }
    }
    return tempId;
  }

  async function updateOutpassStatus(id, newStatus) {
    setOutpasses(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    try {
      await fetch(`${API_BASE}/outpasses/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, approvedBy: 'Admin' })
      });
    } catch (e) { console.error("Failed status update", e); }
  }

  async function addExamSchedule(scheduleObj) {
    // scheduleObj is the batch from UI
    try {
      const response = await fetch(`${API_BASE}/exam-schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleObj)
      });
      if (response.ok) {
        fetchExamSchedules();
      }
    } catch (e) { console.error("Failed exam schedule", e); }

    return Date.now().toString(); // Return tempId for UI
  }

  async function deleteExamSchedule(id) {
    try {
      const response = await fetch(`${API_BASE}/exam-schedules/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setExamSchedules(prev => prev.filter(s => s.id !== id));
      }
    } catch (e) { console.error("Failed exam delete", e); }
  }

  async function updateExamSchedule(id, updates) {
    // For simplicity, we use POST/save for updates too since JPA .save handles both
    const payload = { ...updates, id: id };
    try {
      const response = await fetch(`${API_BASE}/exam-schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        fetchExamSchedules();
      }
    } catch (e) { console.error("Failed exam update", e); }
  }

  const value = {
    students,
    addStudent,
    addStudentsBulk,
    updateStudent,
    deleteStudent,
    deleteStudentsBulk,
    generateAdmissionNo,
    marks,
    updateMarks,
    importMarksFromArray,
    attendance,
    setAttendanceForDate,
    outpasses,
    addOutpass,
    updateOutpassStatus,
    examSchedules,
    addExamSchedule,
    updateExamSchedule,
    deleteExamSchedule
  };

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}
