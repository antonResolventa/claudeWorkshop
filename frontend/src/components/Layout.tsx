import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <nav className="nav">
            <Link to="/" className="logo">
              Task Manager
            </Link>
            <ul className="nav-links">
              <li>
                <Link
                  to="/"
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/users"
                  className={`nav-link ${isActive('/users') ? 'active' : ''}`}
                >
                  Users
                </Link>
              </li>
              <li>
                <Link
                  to="/tasks"
                  className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}
                >
                  Tasks
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="container">{children}</div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>Demo Workshop - Claude Code + Serena</p>
        </div>
      </footer>
    </div>
  );
}
