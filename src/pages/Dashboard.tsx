import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type GroupSummary = {
  group_name: string;
  total_items: number;
  pending_items: number;
  total_value: number;
};

export default function Dashboard() {
  const [summary, setSummary] = useState<GroupSummary[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      const { data: groupSummary } = await supabase
        .from('items')
        .select(`
          group_id,
          groups (name),
          price,
          status
        `);

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

        setSummary(Object.values(summaryByGroup));

        const spent = groupSummary
          .filter(item => item.status !== 'pendente')
          .reduce((total, item) => total + item.price, 0);
        
        const pending = groupSummary
          .filter(item => item.status === 'pendente')
          .reduce((total, item) => total + item.price, 0);

        setTotalSpent(spent);
        setTotalPending(pending);
      }
    };

    fetchSummary();
  }, []);

  // Calculate pie chart segments
  const totalValue = totalSpent + totalPending;
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

  // Function to calculate SVG arc path
  const getArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const start = polarToCartesian(radius, startAngle);
    const end = polarToCartesian(radius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} L 100 100 Z`;
  };

  // Helper function to convert polar coordinates to cartesian
  const polarToCartesian = (radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: 100 + radius * Math.cos(angleInRadians),
      y: 100 + radius * Math.sin(angleInRadians),
    };
  };

  // Colors for the pie chart segments
  const colors = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Gasto
            </dt>
            <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">
              R$ {totalSpent.toFixed(2)}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Pendente
            </dt>
            <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">
              R$ {totalPending.toFixed(2)}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Estimado
            </dt>
            <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">
              R$ {(totalSpent + totalPending).toFixed(2)}
            </dd>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Distribuição por Ambiente
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="w-64 h-64 relative">
              <svg viewBox="0 0 200 200" className="transform -rotate-90">
                {pieChartData.map((segment, index) => (
                  <path
                    key={segment.group_name}
                    d={getArcPath(segment.startAngle, segment.endAngle, 90)}
                    fill={colors[index % colors.length]}
                    className="transition-all duration-300"
                  />
                ))}
              </svg>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-6 grid gap-2">
              {pieChartData.map((segment, index) => (
                <div key={segment.group_name} className="flex items-center">
                  <div
                    className="w-4 h-4 rounded mr-2"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-sm text-gray-600">
                    {segment.group_name} ({segment.percentage.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Resumo por Ambiente
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="min-w-full divide-y divide-gray-200">
              <div className="bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider grid grid-cols-4">
                <div>Ambiente</div>
                <div className="text-right">Total Itens</div>
                <div className="text-right">Pendentes</div>
                <div className="text-right">Valor Total</div>
              </div>
              <div className="divide-y divide-gray-200 bg-white">
                {summary.map((group) => (
                  <div
                    key={group.group_name}
                    className="px-4 py-3 text-sm grid grid-cols-4 hover:bg-gray-50"
                  >
                    <div className="font-medium text-gray-900">
                      {group.group_name}
                    </div>
                    <div className="text-right text-gray-500">
                      {group.total_items}
                    </div>
                    <div className="text-right text-gray-500">
                      {group.pending_items}
                    </div>
                    <div className="text-right font-medium text-gray-900">
                      R$ {group.total_value.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}