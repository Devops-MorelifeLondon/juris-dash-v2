// src/services/api/tasks.ts
import { apiClient } from './config';
import { Task } from '@/types';

export const getTasks = async (params: {
  limit?: number;
  status?: string[];
  assignedTo?: string;
}): Promise<{ data: Task[] }> => {
  const response = await apiClient.get('/api/tasks', { params });
  return response.data;
};
