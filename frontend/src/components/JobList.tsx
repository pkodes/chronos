import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateJob from './CreateJob';

const API_BASE = 'http://localhost:3000/api';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axios.get(`${API_BASE}/jobs`);
            setJobs(response.data.jobs);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setLoading(false);
        }
    };

    const runJob = async (jobId: any) => {
        try {
            await axios.post(`${API_BASE}/jobs/${jobId}/run`);
            alert('Job queued for execution!');
        } catch (error) {
            console.error('Error running job:', error);
            alert('Failed to run job');
        }
    };

    const deleteJob = async (jobId: any) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await axios.delete(`${API_BASE}/jobs/${jobId}`);
                fetchJobs();
            } catch (error) {
                console.error('Error deleting job:', error);
            }
        }
    };

    // Simple inline styles
    const styles: any = {
        container: { maxWidth: '1200px', margin: '0 auto' },
        header: { fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' },
        jobCard: {
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
        },
        jobTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '10px', color: '#111827' },
        button: {
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
            fontWeight: '500'
        },
        runButton: { backgroundColor: '#3b82f6', color: 'white' },
        deleteButton: { backgroundColor: '#ef4444', color: 'white' },
        statusSuccess: { color: '#059669', fontWeight: '500' },
        statusFailed: { color: '#dc2626', fontWeight: '500' },
        loading: { textAlign: 'center', padding: '40px', fontSize: '18px' }
    };

    if (loading) {
        return <div style={styles.loading}>Loading jobs...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Chronos Job Scheduler</h1>
            <CreateJob onJobCreated={fetchJobs} />

            <p style={{ marginBottom: '20px', color: '#6b7280' }}>Total Jobs: {jobs.length}</p>

            {jobs.length === 0 ? (
                <div style={{
                    backgroundColor: '#fef3c7',
                    border: '1px solid #fbbf24',
                    borderRadius: '8px',
                    padding: '20px'
                }}>
                    <p>No jobs found. Create your first job using the API!</p>
                </div>
            ) : (
                <div>
                    {jobs.map((job: any) => (
                        <div key={job.id} style={styles.jobCard}>
                            <h2 style={styles.jobTitle}>{job.name}</h2>

                            <div style={{ marginBottom: '15px' }}>
                                <p><strong>Schedule:</strong> {job.schedule}</p>
                                <p><strong>Type:</strong> {job.type}</p>
                                <p><strong>Status:</strong> {job.enabled ? '✅ Active' : '⏸️ Paused'}</p>
                                <p><strong>Next Run:</strong> {job.nextRunAt ? new Date(job.nextRunAt).toLocaleString() : 'Not scheduled'}</p>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <button
                                    style={{ ...styles.button, ...styles.runButton }}
                                    onClick={() => runJob(job.id)}
                                >
                                    Run Now
                                </button>
                                <button
                                    style={{ ...styles.button, ...styles.deleteButton }}
                                    onClick={() => deleteJob(job.id)}
                                >
                                    Delete
                                </button>
                            </div>

                            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '15px' }}>
                                <h3 style={{ fontWeight: '600', marginBottom: '10px' }}>Recent Executions:</h3>
                                {job.executions && job.executions.length > 0 ? (
                                    job.executions.slice(0, 3).map((exec: any) => (
                                        <div key={exec.id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '5px',
                                            fontSize: '14px'
                                        }}>
                                            <span style={exec.status === 'SUCCESS' ? styles.statusSuccess : styles.statusFailed}>
                                                {exec.status}
                                            </span>
                                            <span style={{ color: '#6b7280' }}>
                                                {new Date(exec.scheduledAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: '#6b7280', fontSize: '14px' }}>No executions yet</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobList;