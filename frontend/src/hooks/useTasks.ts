import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import type { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '../types';

export function useTasks(initialStatus?: TaskStatus) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (status?: TaskStatus) => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getAll(status);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(initialStatus);
  }, [fetchTasks, initialStatus]);

  const createTask = async (data: CreateTaskDto): Promise<Task | null> => {
    try {
      const newTask = await taskService.create(data);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      return null;
    }
  };

  const updateTask = async (id: number, data: UpdateTaskDto): Promise<Task | null> => {
    try {
      const updatedTask = await taskService.update(id, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      return null;
    }
  };

  const completeTask = async (id: number): Promise<Task | null> => {
    try {
      const completedTask = await taskService.complete(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? completedTask : t)));
      return completedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete task');
      return null;
    }
  };

  const deleteTask = async (id: number): Promise<boolean> => {
    try {
      await taskService.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      return false;
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
  };
}
