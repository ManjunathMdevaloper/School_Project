import React from 'react';
import { useStudents } from '../context/StudentContext';
import CustomSelect from './CustomSelect';

export default function StudentDropdown({ value, onChange, label }) {
  const { students } = useStudents();

  const options = [
    { value: '', label: '-- Select Student --' },
    ...students.map(s => ({
      value: s.admissionNo,
      label: `${s.admissionNo} — ${s.firstName} ${s.lastName}`
    }))
  ];

  return (
    <CustomSelect
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={options}
      placeholder="Select Student"
    />
  );
}
