import React from 'react';
import Card from '../ui/Card';

interface PieChartData {
  group_name: string;
  total_value: number;
  percentage: number;
  startAngle: number;
  endAngle: number;
}

interface PieChartProps {
  data: PieChartData[];
  colors: string[];
}

export default function PieChart({ data, colors }: PieChartProps) {
  const getArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const start = polarToCartesian(radius, startAngle);
    const end = polarToCartesian(radius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} L 100 100 Z`;
  };

  const polarToCartesian = (radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: 100 + radius * Math.cos(angleInRadians),
      y: 100 + radius * Math.sin(angleInRadians),
    };
  };

  return (
    <Card>
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        Distribuição por Ambiente
      </h3>
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="w-64 h-64 relative">
          <svg viewBox="0 0 200 200" className="transform -rotate-90">
            {data.map((segment, index) => (
              <path
                key={segment.group_name}
                d={getArcPath(segment.startAngle, segment.endAngle, 90)}
                fill={colors[index % colors.length]}
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
          </svg>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-6 grid gap-2">
          {data.map((segment, index) => (
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
    </Card>
  );
}