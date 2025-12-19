import { apiClient } from './api';
import type { User, CreateUserDto, UpdateUserDto, ApiResponse } from '../types';

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>('/users');
    return response.data.data;
  },

  async getById(id: number): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  async create(data: CreateUserDto): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>('/users', data);
    return response.data.data;
  },

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
