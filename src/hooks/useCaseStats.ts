// src/hooks/useCaseStats.ts
import { useState, useEffect } from 'react';
import { caseService } from '@/lib/api/caseService';
import { CaseStats } from '@/types/case.types';
import { toast } from 'sonner';

export const useCaseStats = () => {
  const [stats, setStats] = useState<CaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await caseService.getCaseStats();
      setStats(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch statistics';
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
