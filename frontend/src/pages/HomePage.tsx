import { Link } from 'react-router-dom';
import './HomePage.css';

export function HomePage() {
  return (
    <div className="home-page">
      <h1>Welcome to Task Manager</h1>
      <p className="subtitle">
        A demo project for Claude Code + Serena Workshop
      </p>

      <div className="features">
        <div className="feature-card">
          <h3>Users Management</h3>
          <p>Create, update, and manage users in the system.</p>
          <Link to="/users" className="btn btn-primary">
            Manage Users
          </Link>
        </div>

        <div className="feature-card">
          <h3>Task Tracking</h3>
          <p>Create tasks, assign to users, and track progress.</p>
          <Link to="/tasks" className="btn btn-primary">
            View Tasks
          </Link>
        </div>

        <div className="feature-card">
          <h3>Priority System</h3>
          <p>Organize tasks by priority: Low, Medium, High.</p>
        </div>

        <div className="feature-card">
          <h3>Status Workflow</h3>
          <p>Track task status: Pending → In Progress → Completed.</p>
        </div>
      </div>

      <div className="tech-stack">
        <h2>Tech Stack</h2>
        <div className="stack-items">
          <div className="stack-item">
            <strong>Backend:</strong> Symfony 7 + PHP 8.2
          </div>
          <div className="stack-item">
            <strong>Frontend:</strong> React 18 + TypeScript
          </div>
          <div className="stack-item">
            <strong>Database:</strong> MySQL 8
          </div>
          <div className="stack-item">
            <strong>Infrastructure:</strong> Docker Compose
          </div>
        </div>
      </div>
    </div>
  );
}
