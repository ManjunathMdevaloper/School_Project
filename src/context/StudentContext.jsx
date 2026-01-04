// src/context/StudentContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  writeBatch,
  deleteField
} from 'firebase/firestore';
import studentsData from '../data/students.json';

const StudentContext = createContext();

export function useStudents() {
  return useContext(StudentContext);
}

export function StudentProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [attendance, setAttendance] = useState({});
  const [outpasses, setOutpasses] = useState([]);
  const [examSchedules, setExamSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastImport, setLastImport] = useState(null); // { records: [{admissionNo, month, subject}] }

  // ... (rest of the listeners)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'students'),
      (snapshot) => {
        const data = snapshot.docs.map(doc => doc.data());
        if (data.length === 0 && loading) {
          seedInitialData();
        } else {
          setStudents(data);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firestore Students Error:", error);
        setLoading(false); // Stop loading even on error
      });
    return () => unsub();
  }, [loading]);

  // 2. Listen for Marks
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'marks'),
      (snapshot) => {
        const marksObj = {};
        snapshot.docs.forEach(doc => {
          marksObj[doc.id] = doc.data();
        });
        setMarks(marksObj);
      },
      (error) => console.error("Firestore Marks Error:", error));
    return () => unsub();
  }, []);

  // 3. Listen for Attendance
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'attendance'),
      (snapshot) => {
        const attObj = {};
        snapshot.docs.forEach(doc => {
          attObj[doc.id] = doc.data();
        });
        setAttendance(attObj);
      },
      (error) => console.error("Firestore Attendance Error:", error));
    return () => unsub();
  }, []);

  // 4. Listen for Outpasses
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'outpasses'),
      (snapshot) => {
        const data = snapshot.docs.map(doc => doc.data());
        setOutpasses(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      },
      (error) => console.error("Firestore Outpasses Error:", error));
    return () => unsub();
  }, []);

  // 5. Listen for Exam Schedules
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'examSchedules'),
      (snapshot) => {
        const data = snapshot.docs.map(doc => doc.data());
        setExamSchedules(data);
      },
      (error) => console.error("Firestore Schedules Error:", error));
    return () => unsub();
  }, []);


  async function seedInitialData() {
    try {
      console.log("Seeding initial data to Firestore...");
      const batch = writeBatch(db);
      studentsData.forEach(s => {
        const ref = doc(db, 'students', s.admissionNo);
        batch.set(ref, s);
      });
      await batch.commit();
      console.log("Seeding complete!");
    } catch (err) {
      console.error("Seeding failed. This is likely due to Firestore Rules or a missing 'students' collection.", err);
    }
  }


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

  async function addStudent(studentObj) {
    const admissionNo = generateAdmissionNo();
    const newStudent = { admissionNo, ...studentObj };
    await setDoc(doc(db, 'students', admissionNo), newStudent);
    return admissionNo;
  }

  async function addStudentsBulk(studentsArray) {
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

    const batch = writeBatch(db);
    studentsArray.forEach((s, index) => {
      const next = maxSeq + 1 + index;
      const pad = String(next).padStart(3, '0');
      const admissionNo = `${year}-${pad}`;
      const newStudent = { admissionNo, ...s };
      const ref = doc(db, 'students', admissionNo);
      batch.set(ref, newStudent);
    });

    await batch.commit();
    return studentsArray.length;
  }

  async function updateStudent(admissionNo, updates) {
    await updateDoc(doc(db, 'students', admissionNo), updates);
  }

  async function updateMarks(admissionNo, month, subject, markObj) {
    const ref = doc(db, 'marks', admissionNo);
    // Use dot notation to update nested fields without overwriting the whole month object
    await updateDoc(ref, {
      [`${month}.${subject}`]: markObj
    }).catch(async (error) => {
      // If document doesn't exist, create it
      if (error.code === 'not-found') {
        await setDoc(ref, { [month]: { [subject]: markObj } });
      }
    });
  }

  async function importMarksFromArray(rows, selectedMonth) {
    const groupedByStudent = {};
    const importStats = [];

    rows.forEach(r => {
      const month = selectedMonth || r.month || new Date().toISOString().slice(0, 7);
      if (!groupedByStudent[r.admissionNo]) groupedByStudent[r.admissionNo] = {};

      const updateKey = `${month}.${r.subject}`;
      groupedByStudent[r.admissionNo][updateKey] = {
        marks: Number(r.marks),
        status: r.status || (Number(r.marks) >= 35 ? 'Pass' : 'Fail'),
        remarks: r.remarks || '',
        date: r.date || new Date().toISOString().split('T')[0]
      };
      importStats.push({ admissionNo: r.admissionNo, month, subject: r.subject });
    });

    const promises = Object.entries(groupedByStudent).map(async ([admissionNo, updates]) => {
      const ref = doc(db, 'marks', admissionNo);
      try {
        await updateDoc(ref, updates);
      } catch (error) {
        if (error.code === 'not-found') {
          const nestedData = {};
          Object.entries(updates).forEach(([key, value]) => {
            const [m, s] = key.split('.');
            if (!nestedData[m]) nestedData[m] = {};
            nestedData[m][s] = value;
          });
          await setDoc(ref, nestedData);
        } else {
          console.error(`Error updating marks for ${admissionNo}:`, error);
        }
      }
    });

    await Promise.all(promises);
    setLastImport({ records: importStats });
  }

  async function undoLastImport() {
    if (!lastImport || !lastImport.records.length) return 0;

    const groupedByStudent = {};
    lastImport.records.forEach(r => {
      if (!groupedByStudent[r.admissionNo]) groupedByStudent[r.admissionNo] = {};
      groupedByStudent[r.admissionNo][`${r.month}.${r.subject}`] = deleteField();
    });

    const promises = Object.entries(groupedByStudent).map(async ([admissionNo, updates]) => {
      const ref = doc(db, 'marks', admissionNo);
      await updateDoc(ref, updates).catch(err => console.error("Undo failed for", admissionNo, err));
    });

    await Promise.all(promises);
    const count = lastImport.records.length;
    setLastImport(null);
    return count;
  }

  async function setAttendanceForDate(dateISO, admissionNo, record) {
    const ref = doc(db, 'attendance', dateISO);
    await updateDoc(ref, {
      [admissionNo]: record
    }).catch(async (error) => {
      if (error.code === 'not-found') {
        await setDoc(ref, { [admissionNo]: record });
      }
    });
  }


  async function addOutpass(outpassObj) {
    const id = Date.now().toString();
    const newOutpass = { id, status: 'Pending', timestamp: new Date().toISOString(), ...outpassObj };
    await setDoc(doc(db, 'outpasses', id), newOutpass);
    return id;
  }

  async function updateOutpassStatus(id, newStatus) {
    await updateDoc(doc(db, 'outpasses', id), { status: newStatus });
  }

  async function addExamSchedule(scheduleObj) {
    const id = Date.now().toString();
    const newSchedule = { id, ...scheduleObj };
    await setDoc(doc(db, 'examSchedules', id), newSchedule);
    return id;
  }

  async function deleteExamSchedule(id) {
    await deleteDoc(doc(db, 'examSchedules', id));
  }

  async function updateExamSchedule(id, updates) {
    await updateDoc(doc(db, 'examSchedules', id), updates);
  }

  async function deleteStudent(admissionNo) {
    await deleteDoc(doc(db, 'students', admissionNo));
  }

  async function deleteStudentsBulk(admissionNos) {
    const batch = writeBatch(db);
    admissionNos.forEach(id => {
      batch.delete(doc(db, 'students', id));
    });
    await batch.commit();
  }

  async function forceSyncWithJSON() {
    const batch = writeBatch(db);
    studentsData.forEach(s => {
      const ref = doc(db, 'students', s.admissionNo);
      batch.set(ref, s);
    });
    await batch.commit();
    return true;
  }

  const value = {
    students,
    loading,
    forceSyncWithJSON,
    addStudent,
    addStudentsBulk,
    updateStudent,
    deleteStudent,
    deleteStudentsBulk,
    generateAdmissionNo,
    marks,
    updateMarks,
    importMarksFromArray,
    lastImport,
    undoLastImport,
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

