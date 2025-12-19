import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useUsers } from '../hooks/useUsers';
import { TaskCard } from '../components/TaskCard';
import type { CreateTaskDto, TaskStatus, TaskPriority } from '../types';
import './TasksPage.css';

export function TasksPage() {
  const { tasks, loading, error, createTask, completeTask, deleteTask, fetchTasks } = useTasks();
  const { users } = useUsers();
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: '',
    assignee_id: 0,
    description: '',
    priority: 'medium',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.assignee_id === 0) {
      alert('Please select an assignee');
      return;
    }
    const result = await createTask(formData);
    if (result) {
      setFormData({
        title: '',
        assignee_id: 0,
        description: '',
        priority: 'medium',
      });
      setShowForm(false);
    }
  };

  const handleStatusFilter = (status: TaskStatus | '') => {
    setStatusFilter(status);
    fetchTasks(status || undefined);
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1>Tasks</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters">
        <button
          className={`filter-btn ${statusFilter === '' ? 'active' : ''}`}
          onClick={() => handleStatusFilter('')}
        >
          All
        </button>
        <button
          className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
          onClick={() => handleStatusFilter('pending')}
        >
          Pending
        </button>
        <button
          className={`filter-btn ${statusFilter === 'in_progress' ? 'active' : ''}`}
          onClick={() => handleStatusFilter('in_progress')}
        >
          In Progress
        </button>
        <button
          className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
          onClick={() => handleStatusFilter('completed')}
        >
          Completed
        </button>
      </div>

      {showForm && (
        <form className="task-form card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assignee">Assignee</label>
              <select
                id="assignee"
                value={formData.assignee_id}
                onChange={(e) => setFormData({ ...formData, assignee_id: Number(e.target.value) })}
                required
              >
                <option value={0}>Select assignee...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate"
              type="date"
              value={formData.due_date || ''}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-success">
            Create Task
          </button>
        </form>
      )}

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p className="empty-state">No tasks found. Create one to get started!</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={completeTask}
              onDelete={deleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
