import React, { useState } from 'react';
import { useStudents } from '../context/StudentContext';
import StudentDropdown from '../components/StudentDropdown';

export default function OutpassForm(){
  const { students } = useStudents();
  const [student, setStudent] = useState(students[0]?.admissionNo || '');
  const [reason, setReason] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [message, setMessage] = useState('');

  function submit(e){
    e.preventDefault();
    // For frontend-only demo, just show summary
    setMessage(`Outpass requested for ${student} from ${fromDate} to ${toDate} (${reason})`);
    setReason(''); setFromDate(''); setToDate('');
  }

  return (
    <div>
      <h2>Student Outpass Form</h2>
      <form onSubmit={submit} style={{background:'#fff',padding:12,borderRadius:8,maxWidth:600}}>
        <div><StudentDropdown value={student} onChange={setStudent} /></div>
        <div><input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} /></div>
        <div><input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} /></div>
        <div><input placeholder="Reason" value={reason} onChange={e=>setReason(e.target.value)} /></div>
        <div style={{marginTop:8}}><button className="btn small">Submit Outpass</button></div>
      </form>
      {message && <div style={{marginTop:12,background:'#e9ffe9',padding:10,borderRadius:6}}>{message}</div>}
    </div>
  );
}
