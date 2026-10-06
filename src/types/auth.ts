import type { User } from '@supabase/supabase-js'

export interface AuthContextValue {
  user: User | null
  loading: boolean

  signUp: (
    email: string,
    password: string,
  ) => Promise<{
    error: Error | null
  }>

  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: Error | null
  }>

  signInWithGoogle: () => Promise<{
    error: Error | null
  }>

  signOut: () => Promise<{
    error: Error | null
  }>
}