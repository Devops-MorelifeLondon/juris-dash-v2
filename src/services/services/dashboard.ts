// src/services/dashboard.ts
import { apiClient } from './config';
import { DashboardStats, Task } from '@/types';

/**
 * Dashboard API Service - Task Model Only
 * Complete functionality for listing and accepting tasks
 */

// Get real-time dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get('/api/dashboard/stats');
  return response.data;
};

// Get assigned tasks (tasks paralegal is working on)
export const getAssignedTasks = async (params: {
  limit?: number;
  status?: string[];
  priority?: string;
}): Promise<{ 
  data: Task[]; 
  type: string; 
  count: number; 
}> => {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.status && params.status.length > 0) {
    params.status.forEach(status => queryParams.append('status', status));
  }
  if (params.priority) queryParams.append('priority', params.priority);
  
  const response = await apiClient.get(`/api/dashboard/tasks?${queryParams.toString()}`);
  return response.data;
};

// Get available tasks (Pending Assignment tasks in domains)
export const getAvailableTasks = async (params: {
  limit?: number;
  priority?: string;
  type?: string;
}): Promise<{
  data: Task[];
  type: string;
  count: number;
  capacity: {
    current: number;
    max: number;
    availableSlots: number;
  };
  matchingDomains: string[];
  filters: {
    priority?: string;
    type?: string;
    limit: number;
  };
  message?: string;
}> => {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.priority) queryParams.append('priority', params.priority);
  if (params.type) queryParams.append('type', params.type);
  
  const response = await apiClient.get(`/api/dashboard/available-tasks?${queryParams.toString()}`);
  return response.data;
};

// Accept an available task
export const acceptTask = async (taskId: string): Promise<{
  message: string;
  taskId: string;
  success: boolean;
  data: Task;
  updatedCapacity: {
    current: number;
    max: number;
    availableSlots: number;
  };
  action: string;
}> => {
  const response = await apiClient.post(`/api/dashboard/tasks/${taskId}/accept`);
  return response.data;
};

// Decline an available task
export const declineTask = async (taskId: string, reason?: string): Promise<{
  message: string;
  taskId: string;
  success: boolean;
  action: string;
  reason: string | null;
  data: {
    task: Task;
    paralegalName: string;
    domain: string;
  };
}> => {
  const response = await apiClient.post(`/api/dashboard/tasks/${taskId}/decline`, { 
    reason 
  });
  return response.data;
};

// Get task history (all interactions)
export const getTaskHistory = async (params: {
  limit?: number;
  status?: string;
  type?: string;
}): Promise<{ 
  data: Task[]; 
  type: string; 
  count: number; 
}> => {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.status) queryParams.append('status', params.status);
  if (params.type) queryParams.append('type', params.type);
  
  const response = await apiClient.get(`/api/dashboard/history?${queryParams.toString()}`);
  return response.data;
};

// Refresh all dashboard data
export const refreshDashboardData = async (): Promise<{
  stats: DashboardStats;
  assignedTasks: { data: Task[]; type: string; count: number };
  availableTasks: { 
    data: Task[]; 
    type: string; 
    count: number; 
    capacity: any; 
    matchingDomains: string[]; 
  };
}> => {
  const [stats, assignedTasks, availableTasks] = await Promise.all([
    getDashboardStats(),
    getAssignedTasks({ limit: 5, status: ['not-started', 'in-progress'] }),
    getAvailableTasks({ limit: 10 })
  ]);
  return { stats, assignedTasks, availableTasks };
};
