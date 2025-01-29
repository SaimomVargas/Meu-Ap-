export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: 'morador' | 'visitante'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role: 'morador' | 'visitante'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'morador' | 'visitante'
          created_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          created_by: string | null
          is_custom: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_by?: string | null
          is_custom?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_by?: string | null
          is_custom?: boolean
          created_at?: string
        }
      }
      items: {
        Row: {
          id: string
          name: string
          price: number
          group_id: string
          status: 'pendente' | 'comprado' | 'presenteado'
          created_by: string
          gifted_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          group_id: string
          status: 'pendente' | 'comprado' | 'presenteado'
          created_by: string
          gifted_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          group_id?: string
          status?: 'pendente' | 'comprado' | 'presenteado'
          created_by?: string
          gifted_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}