import React from 'react';
import { Filter, X } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { getStatusLabel } from '../../utils/formatters';
import { ITEM_STATUS } from '../../utils/constants';
import type { Database } from '../../lib/database.types';

type Group = Database['public']['Tables']['groups']['Row'];

interface ItemFiltersProps {
  groups: Group[];
  filters: {
    group: string;
    status: string;
    priceMin: string;
    priceMax: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export default function ItemFilters({
  groups,
  filters,
  onFiltersChange,
  onClearFilters,
  isVisible,
  onToggleVisibility,
}: ItemFiltersProps) {
  const groupOptions = [
    { value: '', label: 'Todos os grupos' },
    ...groups.map(group => ({ value: group.id, label: group.name }))
  ];

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    ...Object.values(ITEM_STATUS).map(status => ({
      value: status,
      label: getStatusLabel(status)
    }))
  ];

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Lista de Itens</h2>
        <Button
          variant="secondary"
          icon={isVisible ? X : Filter}
          onClick={onToggleVisibility}
        >
          {isVisible ? 'Ocultar Filtros' : 'Filtros'}
          {hasActiveFilters && !isVisible && (
            <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">
              {Object.values(filters).filter(v => v !== '').length}
            </span>
          )}
        </Button>
      </div>

      {isVisible && (
        <Card>
          <div className="space-y-4">
            <Input
              label="Buscar itens"
              type="text"
              placeholder="Digite o nome do item..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Grupo"
                value={filters.group}
                onChange={(e) => handleFilterChange('group', e.target.value)}
                options={groupOptions}
              />
              
              <Select
                label="Status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                options={statusOptions}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Preço mínimo"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              />
              
              <Input
                label="Preço máximo"
                type="number"
                step="0.01"
                placeholder="999,99"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              />
            </div>
            
            {hasActiveFilters && (
              <Button
                variant="secondary"
                onClick={onClearFilters}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}