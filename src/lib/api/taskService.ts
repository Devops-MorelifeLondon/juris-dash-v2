// src/lib/api/taskService.ts
import { apiClient } from './config';
import { Task } from '@/types/task.types';

export const taskService = {
  // Get all tasks
  getTasks: async (params?: {
    caseId?: string;
    status?: string;
    priority?: string;
    assignedTo?: string;
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get<{
      success: boolean;
      data: Task[];
      count: number;
      total: number;
      page: number;
      pages: number;
    }>('/api/tasks', { params });
    return response.data;
  },

  // Get single task
  getTask: async (taskId: string) => {
    const response = await apiClient.get<{
      success: boolean;
      data: Task;
    }>(`/api/tasks/${taskId}`);
    return response.data;
  },

  // Create task
  createTask: async (data: any) => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: Task;
    }>('/api/tasks', data);
    return response.data;
  },

  // Update task
  updateTask: async (taskId: string, data: any) => {
    const response = await apiClient.put<{
      success: boolean;
      message: string;
      data: Task;
    }>(`/api/tasks/${taskId}`, data);
    return response.data;
  },

  // Delete task
  deleteTask: async (taskId: string) => {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/api/tasks/${taskId}`);
    return response.data;
  },



  getTaskStats: async () => {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        byStatus: Array<{
          _id: string;
          count: number;
          totalHours: number;
        }>;
        overdue: number;
      };
    }>('/api/tasks/stats');
    return response.data;
  },
};
