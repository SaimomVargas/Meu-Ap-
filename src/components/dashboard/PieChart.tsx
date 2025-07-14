import React from 'react';

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  colors: string[];
}

export default function PieChart({ data, colors }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Nenhum dado disponível
      </div>
    );
  }

  let cumulativePercentage = 0;

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${percentage} ${100 - percentage}`;
            const strokeDashoffset = -cumulativePercentage;
            
            cumulativePercentage += percentage;
            
            return (
              <circle
                key={item.name}
                cx="100"
                cy="100"
                r="80"
                fill="transparent"
                stroke={colors[index % colors.length]}
                strokeWidth="20"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 100 100)"
                className="transition-all duration-300"
              />
            );
          })}
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
        </div>
      </div>
      
      <div className="ml-8 space-y-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-sm text-gray-700">{item.name}</span>
            <span className="text-sm font-medium text-gray-900">
              {item.value} ({((item.value / total) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}