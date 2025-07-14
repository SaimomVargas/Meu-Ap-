import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import type { Database } from '../../lib/database.types';

type Group = Database['public']['Tables']['groups']['Row'];

interface ItemFormProps {
  groups: Group[];
  onSubmit: (item: { name: string; price: string; group_id: string }) => Promise<void>;
  initialData?: { name: string; price: string; group_id: string };
  isEditing?: boolean;
  loading?: boolean;
}

export default function ItemForm({ 
  groups, 
  onSubmit, 
  initialData, 
  isEditing = false,
  loading = false 
}: ItemFormProps) {
  const [formData, setFormData] = useState(
    initialData || { name: '', price: '', group_id: '' }
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }
    
    if (!formData.group_id) {
      newErrors.group_id = 'Grupo é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
      if (!isEditing) {
        setFormData({ name: '', price: '', group_id: '' });
      }
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const groupOptions = [
    { value: '', label: 'Selecione um grupo' },
    ...groups.map(group => ({ value: group.id, label: group.name }))
  ];

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome do Item"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          disabled={loading}
        />
        
        <Input
          label="Preço"
          type="number"
          step="0.01"
          required
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          error={errors.price}
          disabled={loading}
        />
        
        <Select
          label="Grupo"
          required
          value={formData.group_id}
          onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
          options={groupOptions}
          error={errors.group_id}
          disabled={loading}
        />
        
        <Button
          type="submit"
          icon={isEditing ? undefined : Plus}
          loading={loading}
          className="w-full"
        >
          {isEditing ? 'Atualizar Item' : 'Novo Item'}
        </Button>
      </form>
    </Card>
  );
}