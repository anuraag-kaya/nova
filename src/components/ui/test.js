// app/test-tableau/page.js
"use client";
import { useState } from 'react';

export default function TestTableau() {
  const [url, setUrl] = useState('');
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Quick Tableau Test</h1>
      <input 
        type="text" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste Tableau URL here"
        style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
      />
      {url && (
        <iframe 
          src={url} 
          width="100%" 
          height="800" 
          style={{ border: 'none' }}
        />
      )}
    </div>
  );
}