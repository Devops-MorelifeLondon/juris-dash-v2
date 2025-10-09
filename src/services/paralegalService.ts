// services/paralegalService.ts
import { apiClient } from './caseService';
import { Paralegal, ApiResponse } from '@/components/cases/types';

export const paralegalService = {
  // Get all active paralegals
  async getActiveParalegals(): Promise<ApiResponse<Paralegal[]>> {
    try {
      const response = await apiClient.get<ApiResponse<Paralegal[]>>('/paralegals/active');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
