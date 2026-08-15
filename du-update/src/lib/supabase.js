import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return {
      auth: {
        getUser:               () => Promise.resolve({ data: { user: null }, error: null }),
        onAuthStateChange:     () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut:               () => Promise.resolve({}),
        signInWithPassword:    () => Promise.resolve({ data: {}, error: { message: 'Not configured' } }),
        signUp:                () => Promise.resolve({ data: {}, error: { message: 'Not configured' } }),
        resetPasswordForEmail: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
        insert: () => Promise.resolve({ error: null }),
        update: () => ({ eq: () => Promise.resolve({ error: null }) }),
      }),
    }
  }

  // createBrowserClient stores session in COOKIES not localStorage
  // This makes it readable by server components
  return createBrowserClient(url, key)
}
