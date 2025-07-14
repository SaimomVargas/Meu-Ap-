import React from 'react';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';

interface GroupSummary {
  group_name: string;
  total_items: number;
  pending_items: number;
  total_value: number;
}

interface SummaryTableProps {
  data: GroupSummary[];
}

export default function SummaryTable({ data }: SummaryTableProps) {
  return (
    <Card padding="none" className="overflow-hidden">
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
            {data.map((group) => (
              <div
                key={group.group_name}
                className="px-4 py-3 text-sm grid grid-cols-4 hover:bg-gray-50 transition-colors"
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
                  {formatCurrency(group.total_value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}