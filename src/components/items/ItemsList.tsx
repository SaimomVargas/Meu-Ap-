import React from 'react';
import ItemCard from './ItemCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import type { Database } from '../../lib/database.types';

type Item = Database['public']['Tables']['items']['Row'] & {
  groups: { name: string };
};

interface ItemsListProps {
  items: Item[];
  loading: boolean;
  userRole: 'morador' | 'visitante';
  onEdit?: (item: Item) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: 'pendente' | 'comprado' | 'presenteado') => void;
}

export default function ItemsList({
  items,
  loading,
  userRole,
  onEdit,
  onDelete,
  onStatusChange,
}: ItemsListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum item encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          userRole={userRole}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}