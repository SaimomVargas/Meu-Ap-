# Meu Apê 🏠 | Lista de Presentes Inteligente

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2-%2361DAFB?logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3.0-%2344CC47?logo=supabase)](https://supabase.com)

Um sistema web moderno para gerenciamento colaborativo de móveis e utensílios domésticos, funcionando como uma lista de presentes inteligente para novos apartamentos.

## ✨ Destaques
- 🎁 Lista de presentes interativa para convidados
- 🏡 Controle completo de ambientes e itens para moradores
- 📱 Design responsivo otimizado para mobile
- 🔄 Atualizações em tempo real com Supabase Realtime

## 🚀 Funcionalidades

### 👤 Sistema de Autenticação
- 🔒 Login com e-mail/senha e autenticação via magic link
- 👥 Dois perfis de usuário:
  - **Morador:** Controle total dos itens
  - **Visitante:** Visualização e marcação de presentes
- 🛡️ Proteção de rotas com RBAC (Role-Based Access Control)

### 🖥️ Dashboard Inteligente
- 📊 Gráfico de distribuição por ambientes
- 💰 Painel financeiro com:
  - Total gasto
  - Valor pendente
  - Projeção de custos
- 🔍 Filtros avançados:
  - Por ambiente (sala, cozinha, quarto)
  - Status (pendente/comprado/presenteado)
  - Faixa de preço
  - Pesquisa textual

### 📦 Gerenciamento de Itens
- ➕ Cadastro com:
  - Nome/Descrição detalhada
  - Categoria e ambiente
  - Preço estimado/real
  - Links de referência
- ✏️ Edição em tempo real
- 🗑️ Exclusão segura com confirmação
- 🏷️ Sistema de tags para organização

## 🛠️ Tecnologias

### Frontend
| Tecnologia | Descrição |
|------------|-----------|
| [![React][React-icon]][React-url] | Biblioteca principal para construção de UI |
| [![TypeScript][TypeScript-icon]][TypeScript-url] | Tipagem estática |
| [![Vite][Vite-icon]][Vite-url] | Bundler e dev server |
| [![Tailwind][Tailwind-icon]][Tailwind-url] | Estilização utilitária |
| [![Zustand][Zustand-icon]][Zustand-url] | Gerenciamento de estado |

### Backend
| Tecnologia | Descrição |
|------------|-----------|
| [![Supabase][Supabase-icon]][Supabase-url] | Banco de dados e autenticação |
| [![PostgreSQL][PostgreSQL-icon]][PostgreSQL-url] | Banco de dados relacional |
| [![RLS][RLS-icon]](#) | Row Level Security |

[React-icon]: https://img.shields.io/badge/React-20232A?logo=react
[React-url]: https://reactjs.org/
[TypeScript-icon]: https://img.shields.io/badge/TypeScript-3178C6?logo=typescript
[TypeScript-url]: https://www.typescriptlang.org/
[Vite-icon]: https://img.shields.io/badge/Vite-646CFF?logo=vite
[Vite-url]: https://vitejs.dev/
[Tailwind-icon]: https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss
[Tailwind-url]: https://tailwindcss.com/
[Zustand-icon]: https://img.shields.io/badge/Zustand-1C1C1E?logo=zustand
[Zustand-url]: https://zustand-demo.pmnd.rs/
[Supabase-icon]: https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase
[Supabase-url]: https://supabase.com/
[PostgreSQL-icon]: https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql
[PostgreSQL-url]: https://www.postgresql.org/
[RLS-icon]: https://img.shields.io/badge/RLS-FF6B6B
