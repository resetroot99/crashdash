export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string
          user_id: string
          job_number: string
          customer_name: string
          vehicle_info: string
          raw_data: Json
          parsed_data: Json
          profit_analysis: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_number: string
          customer_name: string
          vehicle_info: string
          raw_data: Json
          parsed_data: Json
          profit_analysis: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_number?: string
          customer_name?: string
          vehicle_info?: string
          raw_data?: Json
          parsed_data?: Json
          profit_analysis?: Json
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          shop_name: string | null
          subscription_status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          shop_name?: string | null
          subscription_status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          shop_name?: string | null
          subscription_status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 