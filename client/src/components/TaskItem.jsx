import React, { useState } from 'react';

function TaskItem({ task, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description || '');

    const handleSave = () => {
        if (editTitle.trim()) {
            onUpdate(task.id, {
                title: editTitle.trim(),
                description: editDescription.trim()
            });
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditTitle(task.title);
        setEditDescription(task.description || '');
        setIsEditing(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const toggleComplete = () => {
        onUpdate(task.id, { completed: !task.completed });
    };

    return (
        <div className="glass-panel animate-fade-in" style={{
            display: 'flex',
            alignItems: isEditing ? 'flex-start' : 'center',
            padding: '1rem',
            marginBottom: '1rem',
            transition: 'all 0.3s',
            border: isEditing ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid var(--glass-border)',
        }}>
            {!isEditing && (
                <button
                    onClick={toggleComplete}
                    className="status-toggle-btn"
                    style={{
                        marginRight: '1rem',
                        padding: '0.5rem 1rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.3s ease',
                        background: task.completed
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        boxShadow: task.completed
                            ? '0 2px 8px rgba(16, 185, 129, 0.3)'
                            : '0 2px 8px rgba(245, 158, 11, 0.3)',
                        minWidth: '110px',
                        justifyContent: 'center'
                    }}
                    title={task.completed ? 'Mark as pending' : 'Mark as completed'}
                >
                    {task.completed ? (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Completed
                        </>
                    ) : (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            Pending
                        </>
                    )}
                </button>
            )}

            <div style={{ flex: 1 }}>
                {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="input-field"
                            placeholder="Task title"
                            autoFocus
                            style={{
                                fontSize: '1rem',
                                padding: '0.75rem',
                                background: 'rgba(15, 23, 42, 0.8)',
                                border: '1.5px solid rgba(139, 92, 246, 0.3)'
                            }}
                        />
                        <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="input-field"
                            placeholder="Description (optional)"
                            style={{
                                fontSize: '0.9rem',
                                padding: '0.75rem',
                                background: 'rgba(15, 23, 42, 0.8)',
                                border: '1.5px solid rgba(139, 92, 246, 0.3)'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <button
                                onClick={handleSave}
                                className="btn btn-primary"
                                style={{
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.875rem',
                                    flex: 1
                                }}
                            >
                                Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="btn"
                                style={{
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.875rem',
                                    background: 'rgba(148, 163, 184, 0.1)',
                                    color: 'var(--text-secondary)',
                                    border: '1px solid rgba(148, 163, 184, 0.2)',
                                    flex: 1
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3 style={{
                            margin: 0,
                            fontSize: '1.1rem',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                            transition: 'all 0.2s'
                        }}>
                            {task.title}
                        </h3>
                        {task.description && (
                            <p style={{
                                margin: '0.25rem 0 0',
                                fontSize: '0.9rem',
                                color: 'var(--text-secondary)',
                                textDecoration: task.completed ? 'line-through' : 'none',
                            }}>
                                {task.description}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {!isEditing && (
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn"
                        style={{
                            padding: '0.5rem',
                            background: 'rgba(139, 92, 246, 0.1)',
                            color: '#a78bfa',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                        }}
                        aria-label="Edit task"
                        title="Edit task"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="btn btn-danger"
                        style={{ padding: '0.5rem' }}
                        aria-label="Delete task"
                        title="Delete task"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

export default TaskItem;
