'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react'
import { v4 as uuidv4 } from 'uuid'

export interface User {
  id: string
  name: string
  email?: string
  image?: string
  isGuest: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: () => void
  signOut: (clearData?: boolean) => Promise<void>
  updateGuestName: (name: string) => void
  migrateGuestData: (newUserId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Generate guest username from UUID
  const generateGuestName = (uuid: string): string => {
    const shortId = uuid.split('-')[0].toUpperCase().slice(0, 6)
    return `Guest_${shortId}`
  }

  // Migrate guest data to authenticated user
  const migrateGuestData = (newUserId: string) => {
    try {
      const storedUser = localStorage.getItem('guestUser')
      if (!storedUser) return

      const guestUser = JSON.parse(storedUser)
      if (!guestUser.isGuest) return

      // Get all localStorage keys that might contain user data
      const keysToMigrate = [
        'gameScores',
        'userProgress',
        'userSettings',
        'achievements',
      ]

      // Migrate data with new user ID prefix
      keysToMigrate.forEach((key) => {
        const guestKey = `${key}_${guestUser.id}`
        const newKey = `${key}_${newUserId}`
        const data = localStorage.getItem(guestKey)

        if (data) {
          localStorage.setItem(newKey, data)
          localStorage.removeItem(guestKey) // Clean up guest data
        }
      })

      // Clear guest user
      localStorage.removeItem('guestUser')

      console.log('Guest data migrated successfully to authenticated user')
    } catch (error) {
      console.error('Error migrating guest data:', error)
    }
  }

  // Initialize guest user or handle NextAuth session
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // If NextAuth session exists, use authenticated user
        if (status === 'authenticated' && session?.user) {
          const authenticatedUser: User = {
            id: session.user.id,
            name: session.user.name || 'User',
            email: session.user.email || undefined,
            image: session.user.image || undefined,
            isGuest: false,
          }

          // Check if there's guest data to migrate
          const storedGuestUser = localStorage.getItem('guestUser')
          if (storedGuestUser) {
            const guestUser = JSON.parse(storedGuestUser)
            if (guestUser.isGuest) {
              migrateGuestData(session.user.id)
            }
          }

          setUser(authenticatedUser)
          setIsLoading(false)
          return
        }

        // If not authenticated and not loading, use guest user
        if (status === 'unauthenticated') {
          const storedUser = localStorage.getItem('guestUser')

          if (storedUser) {
            // Restore existing guest user
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
          } else {
            // Create new guest user
            const guestId = uuidv4()
            const guestUser: User = {
              id: guestId,
              name: generateGuestName(guestId),
              isGuest: true,
            }

            localStorage.setItem('guestUser', JSON.stringify(guestUser))
            setUser(guestUser)
          }
          setIsLoading(false)
        }

        // Still loading NextAuth session
        if (status === 'loading') {
          setIsLoading(true)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        // Fallback: create new guest user
        const guestId = uuidv4()
        const guestUser: User = {
          id: guestId,
          name: generateGuestName(guestId),
          isGuest: true,
        }
        localStorage.setItem('guestUser', JSON.stringify(guestUser))
        setUser(guestUser)
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [session, status])

  const signIn = () => {
    // This will be handled by LoginModal triggering NextAuth
    console.log('Sign in triggered - will open LoginModal')
  }

  const signOut = async (clearData = false) => {
    try {
      // If authenticated user, sign out from NextAuth
      if (user && !user.isGuest) {
        await nextAuthSignOut({ redirect: false })
      }

      if (clearData) {
        // Clear all user data (scores, progress, etc.)
        const userId = user?.id
        if (userId) {
          const keysToRemove = [
            'gameScores',
            'userProgress',
            'userSettings',
            'achievements',
          ]
          keysToRemove.forEach((key) => {
            localStorage.removeItem(`${key}_${userId}`)
          })
        }
        localStorage.removeItem('guestUser')
      }

      // Create new guest user
      const guestId = uuidv4()
      const guestUser: User = {
        id: guestId,
        name: generateGuestName(guestId),
        isGuest: true,
      }

      localStorage.setItem('guestUser', JSON.stringify(guestUser))
      setUser(guestUser)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const updateGuestName = (name: string) => {
    if (!user || !user.isGuest) return

    const updatedUser: User = {
      ...user,
      name,
    }

    localStorage.setItem('guestUser', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signOut,
    updateGuestName,
    migrateGuestData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
