// src/hooks/useTaskStats.ts
import { useState, useEffect } from 'react';
import { taskService } from '@/lib/api/taskService';
import { toast } from 'sonner';

export interface TaskStats {
  byStatus: Array<{
    _id: string;
    count: number;
    totalHours: number;
  }>;
  overdue: number;
}

export const useTaskStats = () => {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getTaskStats();
      setStats(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch task statistics';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};
