// src/hooks/useTasks.ts
import { useState, useEffect } from 'react';
import { taskService } from '@/lib/api/taskService';
import { Task } from '@/types/task.types';
import { toast } from 'sonner';

export const useTasks = (filters?: {
  caseId?: string;
  status?: string;
  priority?: string;
  type?: string;
  search?: string;
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getTasks(filters);
      setTasks(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch tasks';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters?.caseId, filters?.status, filters?.priority, filters?.type, filters?.search]);

  return { tasks, loading, error, refetch: fetchTasks };
};
