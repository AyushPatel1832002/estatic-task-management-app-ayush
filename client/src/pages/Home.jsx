import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskItem from '../components/TaskItem';

function Home() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const API_URL = 'http://localhost:5000/api/tasks';

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError('Failed to load tasks. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description }),
            });

            if (!response.ok) {
                throw new Error('Failed to add task');
            }

            const newTask = await response.json();
            setTasks([...tasks, newTask]);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Error adding task:', error);
            setError('Failed to add task. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const updateTask = async (id, updates) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            if (!response.ok) throw new Error('Failed to update task');

            const updatedTask = await response.json();
            setTasks(tasks.map(t => t.id === id ? updatedTask : t));
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete task');

            setTasks(tasks.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="container">
            <header style={{
                marginBottom: '3rem',
                textAlign: 'center',
                position: 'relative'
            }}>
                <button
                    onClick={handleLogout}
                    className="logout-btn"
                    style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        borderRadius: '0.75rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                        transition: 'all 0.3s ease',
                    }}
                    title="Logout"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                </button>

                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '0.5rem'
                }}>
                    Task Master
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Manage your daily goals with elegance.
                </p>
            </header>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
                <form onSubmit={addTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input
                            type="text"
                            placeholder="What needs to be done?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input-field"
                            required
                            disabled={submitting}
                        />
                        <input
                            type="text"
                            placeholder="Add a description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="input-field"
                            disabled={submitting}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting}
                        style={{ opacity: submitting ? 0.7 : 1 }}
                    >
                        {submitting ? 'Adding...' : 'Add New Task'}
                    </button>
                    {error && (
                        <p style={{ color: 'var(--danger-color)', fontSize: '0.9rem', textAlign: 'center' }}>
                            {error}
                        </p>
                    )}
                </form>
            </div>

            <div className="task-list">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        Loading your tasks...
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                            No tasks yet. Start by adding one above!
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {tasks.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onUpdate={updateTask}
                                onDelete={deleteTask}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
