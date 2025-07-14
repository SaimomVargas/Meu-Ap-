import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatCurrency, getStatusLabel, getStatusVariant } from '../../utils/formatters';
import { ITEM_STATUS, USER_ROLES } from '../../utils/constants';
import type { Database } from '../../lib/database.types';

type Item = Database['public']['Tables']['items']['Row'] & {
  groups: { name: string };
};

interface ItemCardProps {
  item: Item;
  userRole: 'morador' | 'visitante';
  onEdit?: (item: Item) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: 'pendente' | 'comprado' | 'presenteado') => void;
}

export default function ItemCard({ 
  item, 
  userRole, 
  onEdit, 
  onDelete, 
  onStatusChange 
}: ItemCardProps) {
  const handleStatusChange = (status: 'pendente' | 'comprado' | 'presenteado') => {
    onStatusChange?.(item.id, status);
  };

  return (
    <Card padding="sm" className="hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-gray-900 flex-1 pr-2">
            {item.name}
          </h3>
          <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
            {formatCurrency(item.price)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {item.groups.name}
          </span>
          <Badge variant={getStatusVariant(item.status)}>
            {getStatusLabel(item.status)}
          </Badge>
        </div>

        {userRole === USER_ROLES.MORADOR && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                icon={Edit2}
                onClick={() => onEdit?.(item)}
                className="p-1"
              >
                <span className="sr-only">Editar</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                onClick={() => onDelete?.(item.id)}
                className="p-1 text-red-600 hover:text-red-700"
              >
                <span className="sr-only">Excluir</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-1">
              {Object.values(ITEM_STATUS).map((status) => (
                <Button
                  key={status}
                  variant={item.status === status ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleStatusChange(status)}
                  className="text-xs py-1"
                >
                  {getStatusLabel(status)}
                </Button>
              ))}
            </div>
          </div>
        )}

        {userRole === USER_ROLES.VISITANTE && item.status === ITEM_STATUS.PENDENTE && (
          <div className="pt-2 border-t border-gray-100">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusChange(ITEM_STATUS.PRESENTEADO)}
              className="w-full"
            >
              Presentear
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}