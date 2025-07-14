import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import StatsCard from '../components/dashboard/StatsCard';
import PieChart from '../components/dashboard/PieChart';
import SummaryTable from '../components/dashboard/SummaryTable';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';
import { CHART_COLORS } from '../utils/constants';

export default function Dashboard() {
  const { summary, stats, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erro ao carregar dados: {error}</p>
      </div>
    );
  }

  // Calculate pie chart segments
  const totalValue = stats.totalEstimated;
  const pieChartData = summary.map((group, index) => {
    const percentage = (group.total_value / totalValue) * 100;
    const previousEndAngle = summary
      .slice(0, index)
      .reduce((acc, curr) => acc + (curr.total_value / totalValue) * 360, 0);
    const endAngle = previousEndAngle + (group.total_value / totalValue) * 360;

    return {
      ...group,
      percentage,
      startAngle: previousEndAngle,
      endAngle,
    };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Gasto"
          value={formatCurrency(stats.totalSpent)}
        />
        <StatsCard
          title="Total Pendente"
          value={formatCurrency(stats.totalPending)}
        />
        <StatsCard
          title="Total Estimado"
          value={formatCurrency(stats.totalEstimated)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart data={pieChartData} colors={CHART_COLORS} />
        <SummaryTable data={summary} />
      </div>
    </div>
  );
}