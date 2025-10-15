// src/hooks/useCases.ts
import { useState, useEffect } from 'react';
import { caseService } from '@/lib/api/caseService';
import { Case } from '@/types/case.types';
import { toast } from 'sonner';

export const useCases = (filters?: {
  status?: string;
  priority?: string;
  serviceType?: string;
  search?: string;
}) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchCases = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await caseService.getMyCases({
        ...filters,
        page,
        limit: 10,
      });
      setCases(response.data);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch cases';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [filters?.status, filters?.priority, filters?.serviceType, filters?.search]);

  const refetch = () => fetchCases(pagination.currentPage);

  return {
    cases,
    loading,
    error,
    pagination,
    refetch,
    fetchCases,
  };
};
