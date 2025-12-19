export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string | null;
  tasks?: Task[];
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  completedAt: string | null;
  assignee: User;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

export interface CreateTaskDto {
  title: string;
  assignee_id: number;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  count?: number;
}

export interface ApiError {
  error: string;
}
