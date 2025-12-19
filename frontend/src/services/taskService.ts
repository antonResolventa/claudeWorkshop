import { apiClient } from './api';
import type { Task, CreateTaskDto, UpdateTaskDto, ApiResponse, TaskStatus } from '../types';

export const taskService = {
  async getAll(status?: TaskStatus): Promise<Task[]> {
    const params = status ? { status } : {};
    const response = await apiClient.get<ApiResponse<Task[]>>('/tasks', { params });
    return response.data.data;
  },

  async getById(id: number): Promise<Task> {
    const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data;
  },

  async getOverdue(): Promise<Task[]> {
    const response = await apiClient.get<ApiResponse<Task[]>>('/tasks/overdue');
    return response.data.data;
  },

  async create(data: CreateTaskDto): Promise<Task> {
    const response = await apiClient.post<ApiResponse<Task>>('/tasks', data);
    return response.data.data;
  },

  async update(id: number, data: UpdateTaskDto): Promise<Task> {
    const response = await apiClient.put<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data.data;
  },

  async complete(id: number): Promise<Task> {
    const response = await apiClient.post<ApiResponse<Task>>(`/tasks/${id}/complete`);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },
};
