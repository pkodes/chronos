import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

const CreateJob = ({ onJobCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    schedule: 'every 5 minutes',
    type: 'WEBHOOK',
    payload: JSON.stringify({
      url: 'https://httpbin.org/get',
      method: 'GET'
    }, null, 2)
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // Parse payload JSON
      let payload;
      try {
        payload = JSON.parse(formData.payload);
      } catch (err) {
        setMessage('Invalid JSON in payload');
        setLoading(false);
        return;
      }
      
      const jobData = {
        name: formData.name,
        schedule: formData.schedule,
        type: formData.type,
        payload: payload
      };
      
      await axios.post(`${API_BASE}/jobs`, jobData);
      
      setMessage('✅ Job created successfully!');
      setFormData({
        name: '',
        schedule: 'every 5 minutes',
        type: 'WEBHOOK',
        payload: JSON.stringify({
          url: 'https://httpbin.org/get',
          method: 'GET'
        }, null, 2)
      });
      
      if (onJobCreated) {
        onJobCreated();
      }
      
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '20px',
      color: '#111827'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: '500',
      color: '#374151'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: '4px',
      border: '1px solid #d1d5db',
      fontSize: '14px'
    },
    select: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: '4px',
      border: '1px solid #d1d5db',
      fontSize: '14px',
      backgroundColor: 'white'
    },
    textarea: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: '4px',
      border: '1px solid #d1d5db',
      fontSize: '14px',
      fontFamily: 'monospace',
      minHeight: '100px'
    },
    button: {
      backgroundColor: '#10b981',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '16px'
    },
    buttonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },
    message: {
      marginTop: '15px',
      padding: '10px',
      borderRadius: '4px'
    },
    success: {
      backgroundColor: '#d1fae5',
      color: '#065f46'
    },
    error: {
      backgroundColor: '#fee2e2',
      color: '#991b1b'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create New Job</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Job Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            placeholder="Daily Backup"
            required
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Schedule *</label>
          <select
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="every 5 minutes">Every 5 minutes</option>
            <option value="every 30 minutes">Every 30 minutes</option>
            <option value="every 1 hour">Every hour</option>
            <option value="every day at 9 AM">Every day at 9 AM</option>
            <option value="now">Run immediately once</option>
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Job Type *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="WEBHOOK">Webhook (HTTP Request)</option>
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Payload (JSON) *</label>
          <textarea
            name="payload"
            value={formData.payload}
            onChange={handleChange}
            style={styles.textarea}
            required
          />
        </div>
        
        <button
          type="submit"
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Job'}
        </button>
      </form>
      
      {message && (
        <div style={{
          ...styles.message,
          ...(message.includes('✅') ? styles.success : styles.error)
        }}>
          {message}
        </div>
      )}
      
      <div style={{ marginTop: '15px', fontSize: '14px', color: '#6b7280' }}>
        <p><strong>Sample Payloads:</strong></p>
        <pre style={{ 
          backgroundColor: '#f3f4f6', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '12px',
          overflowX: 'auto'
        }}>
{`{
  "url": "https://httpbin.org/get",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer token"
  }
}`}</pre>
      </div>
    </div>
  );
};

export default CreateJob;