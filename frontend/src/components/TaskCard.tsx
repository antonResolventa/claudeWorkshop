import type { Task } from '../types';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onComplete?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <div className={`task-card ${isOverdue() ? 'overdue' : ''}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`task-priority priority-${task.priority}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <span className={`task-status status-${task.status}`}>
          {task.status.replace('_', ' ')}
        </span>
        {task.dueDate && (
          <span className={`task-due ${isOverdue() ? 'overdue' : ''}`}>
            Due: {formatDate(task.dueDate)}
          </span>
        )}
        <span className="task-assignee">
          Assignee: {task.assignee?.name || 'Unassigned'}
        </span>
      </div>

      <div className="task-actions">
        {task.status !== 'completed' && onComplete && (
          <button
            className="btn btn-success"
            onClick={() => onComplete(task.id)}
          >
            Complete
          </button>
        )}
        {onDelete && (
          <button className="btn btn-danger" onClick={() => onDelete(task.id)}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
