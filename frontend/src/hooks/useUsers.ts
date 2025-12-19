import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import type { User, CreateUserDto, UpdateUserDto } from '../types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (data: CreateUserDto): Promise<User | null> => {
    try {
      const newUser = await userService.create(data);
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      return null;
    }
  };

  const updateUser = async (id: number, data: UpdateUserDto): Promise<User | null> => {
    try {
      const updatedUser = await userService.update(id, data);
      setUsers((prev) => prev.map((u) => (u.id === id ? updatedUser : u)));
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      return null;
    }
  };

  const deleteUser = async (id: number): Promise<boolean> => {
    try {
      await userService.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      return false;
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
