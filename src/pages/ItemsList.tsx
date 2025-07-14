import React, { useState, useMemo } from 'react';
import { useItems } from '../hooks/useItems';
import { useGroups } from '../hooks/useGroups';
import { useAuthStore } from '../store/authStore';
import ItemForm from '../components/items/ItemForm';
import ItemFilters from '../components/items/ItemFilters';
import ItemsList from '../components/items/ItemsList';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { USER_ROLES } from '../utils/constants';
import type { Database } from '../lib/database.types';

type Item = Database['public']['Tables']['items']['Row'];

export default function ItemsListPage() {
  const { user } = useAuthStore();
  const { items, loading: itemsLoading, createItem, updateItem, deleteItem, updateItemStatus } = useItems();
  const { groups, loading: groupsLoading } = useGroups();
  
  const [filters, setFilters] = useState({
    group: '',
    status: '',
    priceMin: '',
    priceMax: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleFormSubmit = async (itemData: { name: string; price: string; group_id: string }) => {
    setFormLoading(true);
    try {
      const data = {
        name: itemData.name,
        price: parseFloat(itemData.price),
        group_id: itemData.group_id,
      };
      
      if (isEditing && editingId) {
        await updateItem(editingId, data);
      } else {
        await createItem(data);
      }
      
      setIsEditing(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (item: Item) => {
    setIsEditing(true);
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      await deleteItem(id);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      group: '',
      status: '',
      priceMin: '',
      priceMax: '',
      search: '',
    });
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesGroup = filters.group ? item.group_id === filters.group : true;
      const matchesStatus = filters.status ? item.status === filters.status : true;
      const matchesPriceRange =
        (!filters.priceMin || item.price >= parseFloat(filters.priceMin)) &&
        (!filters.priceMax || item.price <= parseFloat(filters.priceMax));
      const matchesSearch = filters.search
        ? item.name.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      return matchesGroup && matchesStatus && matchesPriceRange && matchesSearch;
    });
  }, [items, filters]);

  const editingItem = useMemo(() => {
    if (!isEditing || !editingId) return undefined;
    const item = items.find(i => i.id === editingId);
    if (!item) return undefined;
    return {
      name: item.name,
      price: item.price.toString(),
      group_id: item.group_id,
    };
  }, [isEditing, editingId, items]);

  if (itemsLoading || groupsLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {user?.role === USER_ROLES.MORADOR && (
        <ItemForm
          groups={groups}
          onSubmit={handleFormSubmit}
          initialData={editingItem}
          isEditing={isEditing}
          loading={formLoading}
        />
      )}

      <ItemFilters
        groups={groups}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
        isVisible={showFilters}
        onToggleVisibility={() => setShowFilters(!showFilters)}
      />

      <ItemsList
        items={filteredItems}
        loading={itemsLoading}
        userRole={user?.role || USER_ROLES.VISITANTE}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={updateItemStatus}
      />
    </div>
  );
}