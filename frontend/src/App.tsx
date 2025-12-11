import React from 'react';
import JobList from './components/JobList';
import './App.css';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '20px' }}>
      <JobList />
    </div>
  );
}

export default App;