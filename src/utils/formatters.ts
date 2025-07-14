export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getStatusLabel = (status: 'pendente' | 'comprado' | 'presenteado'): string => {
  const labels = {
    pendente: 'Pendente',
    comprado: 'Pago',
    presenteado: 'Presente',
  };
  return labels[status];
};

export const getStatusVariant = (status: 'pendente' | 'comprado' | 'presenteado') => {
  const variants = {
    pendente: 'warning' as const,
    comprado: 'success' as const,
    presenteado: 'default' as const,
  };
  return variants[status];
};