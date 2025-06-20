import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

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
          raw_data: any
          parsed_data: any
          profit_analysis: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_number: string
          customer_name: string
          vehicle_info: string
          raw_data: any
          parsed_data: any
          profit_analysis: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_number?: string
          customer_name?: string
          vehicle_info?: string
          raw_data?: any
          parsed_data?: any
          profit_analysis?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 