import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import type { CreateUserDto } from '../types';
import './UsersPage.css';

export function UsersPage() {
  const { users, loading, error, createUser, deleteUser } = useUsers();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateUserDto>({ name: '', email: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createUser(formData);
    if (result) {
      setFormData({ name: '', email: '' });
      setShowForm(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(id);
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Users</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="user-form card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-success">
            Create User
          </button>
        </form>
      )}

      <div className="users-list">
        {users.length === 0 ? (
          <p className="empty-state">No users found. Create one to get started!</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="user-card card">
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <span className="user-tasks">
                  {user.tasks?.length || 0} tasks assigned
                </span>
              </div>
              <div className="user-actions">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
