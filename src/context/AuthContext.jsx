import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession]   = useState(null)   // supabase session object
  const [loading, setLoading]   = useState(true)   // checking existing session
  const [error, setError]       = useState('')

  // ── On mount: restore existing session ──
  useEffect(() => {
    // Get current session from Supabase (reads from its own secure storage)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for login / logout / token refresh events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── Login ──
  const login = useCallback(async (email, password) => {
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Incorrect email or password. Please try again.')
      return false
    }
    return true
  }, [])

  // ── Logout ──
  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setSession(null)
  }, [])

  const loggedIn = !!session

  return (
    <AuthContext.Provider value={{ loggedIn, loading, login, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
