'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { LogIn, LogOut, User as UserIcon } from 'lucide-react'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) console.error('Error signing in:', error)
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error signing out:', error)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <UserIcon className="w-4 h-4" />
          <span className="hidden sm:inline">{user.email}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      className="btn-primary flex items-center gap-2"
    >
      <LogIn className="w-4 h-4" />
      Sign In with Google
    </button>
  )
} 