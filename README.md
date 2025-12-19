# Task Manager - Demo Project

Demo project for Claude Code + Serena Workshop.

## Stack

- **Backend**: Symfony 7 + PHP 8.2
- **Frontend**: React 18 + TypeScript + Vite
- **Database**: MySQL 8
- **Infrastructure**: Docker Compose

## Quick Start

```bash
./setup.sh
```

Or manually:

```bash
docker compose up -d
docker compose exec backend composer install
docker compose exec frontend npm install
```

## Access

- Frontend: http://localhost:4173
- Backend API: http://localhost:9080/api
- Database: localhost:33060

## API Endpoints

### Users
- `GET /api/users` - List all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Tasks
- `GET /api/tasks` - List all tasks
- `GET /api/tasks?status=pending` - Filter by status
- `GET /api/tasks/overdue` - Get overdue tasks
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `POST /api/tasks/{id}/complete` - Mark as completed
- `DELETE /api/tasks/{id}` - Delete task

