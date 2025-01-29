import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Plus, Edit2, Trash2, Filter } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Item = Database['public']['Tables']['items']['Row'];
type Group = Database['public']['Tables']['groups']['Row'];

export default function ItemsList() {
  const { user } = useAuthStore();
  const [items, setItems] = useState<Item[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
    min: '',
    max: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    group_id: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
    fetchGroups();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase
      .from('items')
      .select('*, groups(name)')
      .order('created_at', { ascending: false });
    if (data) setItems(data);
  };

  const fetchGroups = async () => {
    const { data } = await supabase
      .from('groups')
      .select('*')
      .order('name');
    if (data) setGroups(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingId) {
      await supabase
        .from('items')
        .update({
          name: newItem.name,
          price: parseFloat(newItem.price),
          group_id: newItem.group_id,
        })
        .eq('id', editingId);
    } else {
      await supabase.from('items').insert([
        {
          name: newItem.name,
          price: parseFloat(newItem.price),
          group_id: newItem.group_id,
          status: 'pendente',
          created_by: user!.id,
        },
      ]);
    }

    setNewItem({ name: '', price: '', group_id: '' });
    setIsEditing(false);
    setEditingId(null);
    fetchItems();
  };

  const handleEdit = (item: Item) => {
    setNewItem({
      name: item.name,
      price: item.price.toString(),
      group_id: item.group_id,
    });
    setIsEditing(true);
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('items').delete().eq('id', id);
    fetchItems();
  };

  const handleStatusChange = async (id: string, status: 'pendente' | 'comprado' | 'presenteado') => {
    const updates: any = {
      status,
    };

    if (status === 'presenteado') {
      updates.gifted_by = user!.id;
    }

    await supabase
      .from('items')
      .update(updates)
      .eq('id', id);
    fetchItems();
  };

  const clearFilters = () => {
    setSelectedGroup('');
    setSelectedStatus('');
    setPriceRange({ min: '', max: '' });
  };

  const filteredItems = items.filter((item) => {
    const matchesGroup = selectedGroup ? item.group_id === selectedGroup : true;
    const matchesStatus = selectedStatus ? item.status === selectedStatus : true;
    const matchesPriceRange =
      (!priceRange.min || item.price >= parseFloat(priceRange.min)) &&
      (!priceRange.max || item.price <= parseFloat(priceRange.max));

    return matchesGroup && matchesStatus && matchesPriceRange;
  });

  return (
    <div className="space-y-6">
      {user?.role === 'morador' && (
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome do Item
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preço
              </label>
              <input
                type="number"
                step="0.01"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Grupo
              </label>
              <select
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={newItem.group_id}
                onChange={(e) =>
                  setNewItem({ ...newItem, group_id: e.target.value })
                }
              >
                <option value="">Selecione um grupo</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isEditing ? (
                  'Atualizar Item'
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Novo Item
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">
                Lista de Itens
              </h1>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Grupo
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                  >
                    <option value="">Todos os grupos</option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">Todos os status</option>
                    <option value="pendente">Pendente</option>
                    <option value="comprado">Pago</option>
                    <option value="presenteado">Presente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Faixa de Preço
                  </label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Min"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Max"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <button
                    onClick={clearFilters}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <span className="text-sm text-gray-500">
                        R$ {item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {(item.groups as any).name}
                      </span>
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-2 text-xs font-semibold leading-5 ${
                          item.status === 'pendente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : item.status === 'comprado'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.status === 'pendente'
                          ? 'Pendente'
                          : item.status === 'comprado'
                          ? 'Pago'
                          : 'Presente'}
                      </span>
                    </div>
                    {user?.role === 'morador' && (
                      <div className="flex flex-col space-y-2 pt-2 border-t">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => handleStatusChange(item.id, 'pendente')}
                            className={`flex items-center justify-center px-3 py-1 rounded-md text-xs font-medium ${
                              item.status === 'pendente'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700'
                            }`}
                          >
                            Pendente
                          </button>
                          <button
                            onClick={() => handleStatusChange(item.id, 'comprado')}
                            className={`flex items-center justify-center px-3 py-1 rounded-md text-xs font-medium ${
                              item.status === 'comprado'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
                            }`}
                          >
                            Pago
                          </button>
                          <button
                            onClick={() => handleStatusChange(item.id, 'presenteado')}
                            className={`flex items-center justify-center px-3 py-1 rounded-md text-xs font-medium ${
                              item.status === 'presenteado'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                            }`}
                          >
                            Presente
                          </button>
                        </div>
                      </div>
                    )}
                    {user?.role === 'visitante' && item.status === 'pendente' && (
                      <div className="flex justify-end pt-2 border-t">
                        <button
                          onClick={() => handleStatusChange(item.id, 'presenteado')}
                          className="w-full sm:w-auto flex items-center justify-center px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                        >
                          Presentear
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}