import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type { User } from '@supabase/supabase-js'

import { supabase } from '../../lib/supabase/client'
import { AuthContext } from './AuthContext'
import type { AuthContextValue } from '../../types/auth'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (mounted) {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    }

    void initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      },
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp: AuthContextValue['signUp'] = async (
    email,
    password,
  ) => {
    const { error } =
      await supabase.auth.signUp({
        email,
        password,
      })

    return {
      error: error
        ? new Error(error.message)
        : null,
    }
  }

  const signIn: AuthContextValue['signIn'] = async (
    email,
    password,
  ) => {
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    return {
      error: error
        ? new Error(error.message)
        : null,
    }
  }

  const signInWithGoogle: AuthContextValue[
    'signInWithGoogle'
  ] = async () => {
    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      })

    return {
      error: error
        ? new Error(error.message)
        : null,
    }
  }

  const signOut: AuthContextValue['signOut'] =
    async () => {
      const { error } =
        await supabase.auth.signOut()

      return {
        error: error
          ? new Error(error.message)
          : null,
      }
    }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}