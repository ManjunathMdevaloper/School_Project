import React from 'react';
import { useStudents } from '../context/StudentContext';

export default function StudentDropdown({ value, onChange }){
  const { students } = useStudents();
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} className="btn">
      <option value="">-- Select Student --</option>
      {students.map(s => <option key={s.admissionNo} value={s.admissionNo}>{s.admissionNo} — {s.firstName} {s.lastName}</option>)}
    </select>
  );
}
