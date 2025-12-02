import React from 'react';
import { useStudents } from '../context/StudentContext';

export default function MarksImport(){
  const { importMarksFromArray } = useStudents();

  function handleFile(e){
    const f = e.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target.result;
      const rows = parseCSV(text);
      // rows -> array of objects
      importMarksFromArray(rows);
      alert('Imported ' + rows.length + ' rows');
    };
    reader.readAsText(f);
  }

  function parseCSV(text){
    const lines = text.split(/\r?\n/).filter(Boolean);
    if(lines.length === 0) return [];
    const headers = lines[0].split(',').map(h=>h.trim());
    const rows = lines.slice(1).map(line => {
      const cols = line.split(',').map(c=>c.trim());
      const obj = {};
      headers.forEach((h,i) => obj[h] = cols[i] ?? '');
      return obj;
    });
    return rows;
  }

  return (
    <div>
      <h2>Import Marks (CSV)</h2>
      <div style={{background:'#fff',padding:12,borderRadius:8}}>
        <div>CSV format (header row required): <code>admissionNo,subject,marks,status,remarks</code></div>
        <div style={{marginTop:8}}>
          <input type="file" accept=".csv" onChange={handleFile} />
        </div>
        <div style={{marginTop:12,fontSize:13,color:'#666'}}>
          Example CSV row:
          <pre>2025-001,Math,88,present,Good</pre>
        </div>
      </div>
    </div>
  );
}
