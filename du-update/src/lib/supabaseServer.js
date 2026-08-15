import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  const cookieStore = cookies()
  return createServerClient(url, key, {
    cookies: {
      get(name)             { return cookieStore.get(name)?.value },
      set(name, value, opt) { try { cookieStore.set({ name, value, ...opt }) } catch {} },
      remove(name, opt)     { try { cookieStore.set({ name, value: '', ...opt }) } catch {} },
    },
  })
}
