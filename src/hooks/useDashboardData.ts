import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type GroupSummary = {
  group_name: string;
  total_items: number;
  pending_items: number;
  total_value: number;
};

type DashboardStats = {
  totalSpent: number;
  totalPending: number;
  totalEstimated: number;
};

export function useDashboardData() {
  const [summary, setSummary] = useState<GroupSummary[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalSpent: 0,
    totalPending: 0,
    totalEstimated: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: groupSummary, error: fetchError } = await supabase
        .from('items')
        .select(`
          group_id,
          groups (name),
          price,
          status
        `);

      if (fetchError) throw fetchError;

      if (groupSummary) {
        const summaryByGroup = groupSummary.reduce((acc: { [key: string]: GroupSummary }, item) => {
          const groupName = (item.groups as Database['public']['Tables']['groups']['Row']).name;
          
          if (!acc[groupName]) {
            acc[groupName] = {
              group_name: groupName,
              total_items: 0,
              pending_items: 0,
              total_value: 0,
            };
          }

          acc[groupName].total_items += 1;
          acc[groupName].total_value += item.price;
          if (item.status === 'pendente') {
            acc[groupName].pending_items += 1;
          }

          return acc;
        }, {});

        const summaryArray = Object.values(summaryByGroup);
        setSummary(summaryArray);

        const spent = groupSummary
          .filter(item => item.status !== 'pendente')
          .reduce((total, item) => total + item.price, 0);
        
        const pending = groupSummary
          .filter(item => item.status === 'pendente')
          .reduce((total, item) => total + item.price, 0);

        setStats({
          totalSpent: spent,
          totalPending: pending,
          totalEstimated: spent + pending,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    summary,
    stats,
    loading,
    error,
    refetch: fetchDashboardData,
  };
}