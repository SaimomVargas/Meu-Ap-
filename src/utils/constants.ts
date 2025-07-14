export const CHART_COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#06B6D4', // cyan-500
  '#84CC16', // lime-500
];

export const USER_ROLES = {
  MORADOR: 'morador' as const,
  VISITANTE: 'visitante' as const,
};

export const ITEM_STATUS = {
  PENDENTE: 'pendente' as const,
  COMPRADO: 'comprado' as const,
  PRESENTEADO: 'presenteado' as const,
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  ITEMS: '/items',
};