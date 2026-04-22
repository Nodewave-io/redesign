import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export function getSupabase() {
  if (supabaseInstance) return supabaseInstance
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key are required')
  }
  
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}

// For client components - lazy initialization
export const supabase = typeof window !== 'undefined' 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  : null as any

// Admin client - only use on server side
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL and Service Role Key are required')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey)
}

export type Lead = {
  id: string
  email: string
  name: string | null
  company: string | null
  phone: string | null
  lead_source: string
  lead_actions: string[]
  status: 'active' | 'discovery_scheduled' | 'lost' | 'unsubscribed' | 'diy'
  lost_reason: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type LeadSubmission = {
  id: string
  email: string
  created_at: string
  sequence_step: number
  sequence_status: string
  last_step_at: string | null
}

export type ROISubmission = LeadSubmission & {
  task_type: string
  hours_per_week: string
  hourly_rate: string
  people_count: string
  judgment_level: string
  process_description: string
  time_before: number | null
  time_after: number | null
  monthly_savings_low: number | null
  monthly_savings_high: number | null
  yearly_savings_low: number | null
  yearly_savings_high: number | null
  automation_explanation: string | null
}

export type ContactSubmission = LeadSubmission & {
  name: string | null
  company: string | null
  phone: string | null
  message: string | null
}

export type LeadMagnetSubmission = LeadSubmission

export type FreeAutomationSubmission = {
  id: string
  email: string
  role: string | null
  task_type: string | null
  task_description: string | null
  tools: string | null
  linkedin_url: string | null
  created_at: string
  updated_at: string
}

export type LeadWithSubmissions = Lead & {
  roi_submissions: ROISubmission[]
  contact_submissions: ContactSubmission[]
  lead_magnet_submissions: LeadMagnetSubmission[]
  free_automation_submissions: FreeAutomationSubmission[]
}

export type Deal = {
  id: string
  email: string
  name: string | null
  company: string | null
  status: 'discovery_scheduled' | 'discovery_completed' | 'diagram_sent' | 'diagram_approved' | 'proposal_sent' | 'negotiating' | 'won' | 'lost' | 'responded'
  deal_value: number | null
  lost_reason: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type Post = {
  id: string
  slug: string
  title: string
  description: string | null
  content: string
  author: string
  reading_time: number | null
  tags: string[]
  draft: boolean
  created_at: string
  updated_at: string
  published_at: string | null
  meta_title: string | null
  focus_keyword: string | null
  charts: unknown[] | null
  pending_changes: Record<string, { before: any; after: any }> | null
}
