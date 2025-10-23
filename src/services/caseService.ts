// services/caseService.ts
import axios, { AxiosError } from 'axios';
import { Case, CaseFormData, ApiResponse, PaginatedResponse } from '../components/cases/types';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

// Create axios instance with defaults
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for authentication
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<any>>) => {
    if (error.response) {
      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          if (typeof window !== 'undefined') {
         
            Cookies.remove('token');
            window.location.href = '/auth';
          }
          break;
        case 403:
          console.error('Access forbidden:', error.response.data.message);
          break;
        case 404:
          console.error('Resource not found:', error.response.data.message);
          break;
        case 500:
          console.error('Server error:', error.response.data.message);
          break;
      }
    }
    return Promise.reject(error);
  }
);

// Case Service
export const caseService = {
  // Create new case
  async createCase(caseData: CaseFormData): Promise<ApiResponse<Case>> {
    try {
      const response = await apiClient.post<ApiResponse<Case>>('/cases/create', caseData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Get all cases for logged-in user
  async getMyCases(params?: {
    status?: string;
    priority?: string;
    serviceType?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Case>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Case>>('/cases/my-cases', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Get single case by ID
  async getCaseById(caseId: string): Promise<ApiResponse<Case>> {
    try {
      const response = await apiClient.get<ApiResponse<Case>>(`/cases/${caseId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Update case status
  async updateCaseStatus(
    caseId: string, 
    status: string, 
    declineReason?: string
  ): Promise<ApiResponse<Case>> {
    try {
      const response = await apiClient.put<ApiResponse<Case>>(
        `/cases/${caseId}/status`,
        { status, declineReason }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Update case details (Attorney only)
  async updateCase(caseId: string, updates: Partial<CaseFormData>): Promise<ApiResponse<Case>> {
    try {
      const response = await apiClient.put<ApiResponse<Case>>(
        `/cases/${caseId}/update`,
        updates
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Update case hours (Paralegal only)
  async updateCaseHours(caseId: string, hoursSpent: number): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.put<ApiResponse<any>>(
        `/cases/${caseId}/hours`,
        { hoursSpent }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Archive case (Attorney only)
  async archiveCase(caseId: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.put<ApiResponse<any>>(`/cases/${caseId}/archive`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Delete case (Attorney only)
  async deleteCase(caseId: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.delete<ApiResponse<any>>(`/cases/${caseId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Get case statistics
  async getCaseStats(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/cases/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Error handler
  handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse<any>>;
      const message = axiosError.response?.data?.message || axiosError.message || 'An error occurred';
      return new Error(message);
    }
    return error as Error;
  }
};
