import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { Database } from '../lib/database.types';

type Item = Database['public']['Tables']['items']['Row'] & {
  groups: { name: string };
};

export function useItems() {
  const { user } = useAuthStore();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('items')
        .select('*, groups(name)')
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      setItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar itens');
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData: {
    name: string;
    price: number;
    group_id: string;
  }) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    const { error } = await supabase.from('items').insert([
      {
        ...itemData,
        status: 'pendente' as const,
        created_by: user.id,
      },
    ]);
    
    if (error) throw error;
    await fetchItems();
  };

  const updateItem = async (id: string, updates: Partial<Item>) => {
    const { error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    await fetchItems();
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    await fetchItems();
  };

  const updateItemStatus = async (
    id: string, 
    status: 'pendente' | 'comprado' | 'presenteado'
  ) => {
    const updates: any = { status };
    
    if (status === 'presenteado' && user) {
      updates.gifted_by = user.id;
    }
    
    await updateItem(id, updates);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    updateItemStatus,
    refetch: fetchItems,
  };
}