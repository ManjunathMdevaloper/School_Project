// src/context/StudentContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import studentsData from '../data/students.json';

const StudentContext = createContext();

export function useStudents() {
  return useContext(StudentContext);
}

export function StudentProvider({ children }) {
  const STORAGE_KEY = 'sri_sudha_students_v2';

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return studentsData;
  });

  const [marks, setMarks] = useState(() => {
    const saved = localStorage.getItem('sri_sudha_marks_v1');
    return saved ? JSON.parse(saved) : {};
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('sri_sudha_attendance_v1');
    return saved ? JSON.parse(saved) : {};
  });

  const [outpasses, setOutpasses] = useState(() => {
    const saved = localStorage.getItem('sri_sudha_outpasses_v1');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('sri_sudha_marks_v1', JSON.stringify(marks));
  }, [marks]);

  useEffect(() => {
    localStorage.setItem('sri_sudha_attendance_v1', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('sri_sudha_outpasses_v1', JSON.stringify(outpasses));
  }, [outpasses]);

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

  function addStudent(studentObj) {
    const admissionNo = generateAdmissionNo();
    const newStudent = { admissionNo, ...studentObj };
    setStudents(prev => [...prev, newStudent]);
    return admissionNo;
  }

  function addStudentsBulk(studentsArray) {
    const year = new Date().getFullYear();
    let maxSeq = 0;

    // Find current max sequence
    students.forEach(s => {
      if (s.admissionNo && s.admissionNo.startsWith(`${year}-`)) {
        const parts = s.admissionNo.split('-');
        const seq = parseInt(parts[1], 10);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    });

    const newStudents = studentsArray.map((s, index) => {
      const next = maxSeq + 1 + index;
      const pad = String(next).padStart(3, '0');
      const admissionNo = `${year}-${pad}`;
      return { admissionNo, ...s };
    });

    setStudents(prev => [...prev, ...newStudents]);
    return newStudents.length;
  }

  function updateStudent(admissionNo, updates) {
    setStudents(prev => prev.map(s => s.admissionNo === admissionNo ? { ...s, ...updates } : s));
  }

  function updateMarks(admissionNo, month, subject, markObj) {
    setMarks(prev => {
      const copy = { ...prev };
      if (!copy[admissionNo]) copy[admissionNo] = {};
      if (!copy[admissionNo][month]) copy[admissionNo][month] = {};

      copy[admissionNo][month][subject] = markObj; // { marks, status, remarks }
      return copy;
    });
  }

  function importMarksFromArray(rows, selectedMonth) {
    const copy = { ...marks };
    rows.forEach(r => {
      if (!copy[r.admissionNo]) copy[r.admissionNo] = {};

      // Use selectedMonth if provided, otherwise try to find it in row, or default to current month
      const month = selectedMonth || r.month || new Date().toISOString().slice(0, 7);

      if (!copy[r.admissionNo][month]) copy[r.admissionNo][month] = {};

      copy[r.admissionNo][month][r.subject] = {
        marks: Number(r.marks),
        status: r.status || 'present',
        remarks: r.remarks || ''
      };
    });
    setMarks(copy);
  }

  function setAttendanceForDate(dateISO, admissionNo, record) {
    setAttendance(prev => {
      const copy = { ...prev };
      if (!copy[dateISO]) copy[dateISO] = {};
      copy[dateISO][admissionNo] = record;
      return copy;
    });
  }

  function addOutpass(outpassObj) {
    const id = Date.now().toString();
    const newOutpass = { id, status: 'Pending', timestamp: new Date().toISOString(), ...outpassObj };
    setOutpasses(prev => [newOutpass, ...prev]);
    return id;
  }

  function updateOutpassStatus(id, newStatus) {
    setOutpasses(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  }

  const [examSchedules, setExamSchedules] = useState(() => {
    const saved = localStorage.getItem('sri_sudha_exam_schedules_v1');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sri_sudha_exam_schedules_v1', JSON.stringify(examSchedules));
  }, [examSchedules]);

  function addExamSchedule(scheduleObj) {
    const id = Date.now().toString();
    const newSchedule = { id, ...scheduleObj };
    setExamSchedules(prev => [newSchedule, ...prev]);
    return id;
  }

  function deleteExamSchedule(id) {
    setExamSchedules(prev => prev.filter(s => s.id !== id));
  }

  function updateExamSchedule(id, updates) {
    setExamSchedules(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }

  function deleteStudent(admissionNo) {
    setStudents(prev => prev.filter(s => s.admissionNo !== admissionNo));
  }

  function deleteStudentsBulk(admissionNos) {
    setStudents(prev => prev.filter(s => !admissionNos.includes(s.admissionNo)));
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
