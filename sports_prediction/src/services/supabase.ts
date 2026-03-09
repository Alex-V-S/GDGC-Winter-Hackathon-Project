import { createClient, SupabaseClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

const supabaseUrl = 'https://nfyzurstfscspxnbowii.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5meXp1cnN0ZnNjc3B4bmJvd2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODA1NjIsImV4cCI6MjA4ODY1NjU2Mn0.ZVxIdgW87_PEIpFOcGe5ME4nw2Ju5U7hRVQ7qTmIaeU'

const isConfigured = supabaseUrl !== 'https://nfyzurstfscspxnbowii.supabase.co' && supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5meXp1cnN0ZnNjc3B4bmJvd2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODA1NjIsImV4cCI6MjA4ODY1NjU2Mn0.ZVxIdgW87_PEIpFOcGe5ME4nw2Ju5U7hRVQ7qTmIaeU'

const SecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}

export const supabase: SupabaseClient = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: SecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : (null as unknown as SupabaseClient)

export { isConfigured }
