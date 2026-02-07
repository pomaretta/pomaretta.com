'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { LoginModal } from './LoginModal'

export function UserMenu() {
  const { user, signOut } = useAuth()
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  if (!user) return null

  const handleSignOut = (clearData: boolean) => {
    signOut(clearData)
    setIsMenuOpen(false)
    setShowSignOutConfirm(false)
  }

  const getInitials = (name: string): string => {
    if (name.startsWith('Guest_')) {
      return 'G'
    }
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* User Avatar Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          aria-label="User menu"
          aria-expanded={isMenuOpen}
        >
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold">{getInitials(user.name)}</span>
          )}
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
            {/* User Info */}
            <div className="border-b border-zinc-200 p-4 dark:border-zinc-700">
              <p className="font-medium text-zinc-900 dark:text-white">
                {user.name}
              </p>
              {user.email && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {user.email}
                </p>
              )}
              {user.isGuest && (
                <p className="mt-2 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  {t.auth?.guestAccount || 'Guest Account'}
                </p>
              )}
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {user.isGuest && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    setIsLoginModalOpen(true)
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  {t.auth?.upgradeAccount || 'Sign In to Save Data'}
                </button>
              )}

              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  setShowSignOutConfirm(true)
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-900/20"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                {user.isGuest
                  ? t.auth?.resetSession || 'Reset Session'
                  : t.auth?.signOut || 'Sign Out'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSignOutConfirm(false)}
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              {user.isGuest
                ? t.auth?.confirmResetTitle || 'Reset Session?'
                : t.auth?.confirmSignOutTitle || 'Sign Out?'}
            </h3>

            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              {user.isGuest
                ? t.auth?.confirmResetMessage ||
                  'Do you want to keep your current data or start fresh?'
                : t.auth?.confirmSignOutMessage ||
                  'Are you sure you want to sign out?'}
            </p>

            <div className="mt-6 flex gap-3">
              {user.isGuest ? (
                <>
                  <button
                    onClick={() => handleSignOut(false)}
                    className="flex-1 rounded-lg border-2 border-zinc-200 bg-white px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    {t.auth?.keepData || 'Keep Data'}
                  </button>
                  <button
                    onClick={() => handleSignOut(true)}
                    className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
                  >
                    {t.auth?.clearData || 'Clear Data'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowSignOutConfirm(false)}
                    className="flex-1 rounded-lg border-2 border-zinc-200 bg-white px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    {t.auth?.cancel || 'Cancel'}
                  </button>
                  <button
                    onClick={() => handleSignOut(false)}
                    className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
                  >
                    {t.auth?.signOut || 'Sign Out'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}
