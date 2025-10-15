// src/lib/api/caseService.ts
import { apiClient } from './config';
import { Case, CaseStats, CreateCaseInput } from '@/types/case.types';

export const caseService = {
  // Get all cases with filters
  getMyCases: async (params?: {
    status?: string;
    priority?: string;
    serviceType?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get<{
      success: boolean;
      data: Case[];
      count: number;
      total: number;
      totalPages: number;
      currentPage: number;
    }>('/api/cases/my-cases', { params });
    return response.data;
  },

  // Get single case
  getCaseById: async (caseId: string) => {
    const response = await apiClient.get<{
      success: boolean;
      data: Case;
    }>(`/api/cases/${caseId}`);
    return response.data;
  },

  // Create new case
  createCase: async (data: CreateCaseInput) => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: Case;
    }>('/api/cases', data);
    return response.data;
  },

  // Update case
  updateCase: async (caseId: string, data: Partial<CreateCaseInput>) => {
    const response = await apiClient.put<{
      success: boolean;
      message: string;
      data: Case;
    }>(`/api/cases/${caseId}`, data);
    return response.data;
  },

  // Update case status
  updateCaseStatus: async (caseId: string, status: string, declineReason?: string) => {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
      data: Case;
    }>(`/api/cases/${caseId}/status`, { status, declineReason });
    return response.data;
  },

  // Update case hours (Paralegal)
  updateCaseHours: async (caseId: string, hoursSpent: number) => {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
      data: any;
    }>(`/api/cases/${caseId}/hours`, { hoursSpent });
    return response.data;
  },

  // Archive case
  archiveCase: async (caseId: string) => {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/api/cases/${caseId}/archive`);
    return response.data;
  },

  // Delete case
  deleteCase: async (caseId: string) => {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/api/cases/${caseId}`);
    return response.data;
  },

  // Get case statistics
  getCaseStats: async () => {
    const response = await apiClient.get<{
      success: boolean;
      data: CaseStats;
    }>('/api/cases/stats');
    return response.data;
  },
};
