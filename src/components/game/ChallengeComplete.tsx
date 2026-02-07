'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'
import { DailyChallenge } from '@/types/game'
import { Trophy, Star, Award, X, Flame, Gift, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

interface ChallengeCompleteProps {
  challenge: DailyChallenge
  streak?: number
  onClose: () => void
  onPlayAgain?: () => void
}

export function ChallengeComplete({
  challenge,
  streak = 0,
  onClose,
  onPlayAgain,
}: ChallengeCompleteProps) {
  const { locale } = useLanguage()
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    setShow(true)

    // Fire confetti
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  const handleClose = () => {
    setShow(false)
    setTimeout(onClose, 300)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          show ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none transition-all duration-500 ${
          show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        <div
          className="relative bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-pink-900/90 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl pointer-events-auto overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_70%)] animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-full">
            <Sparkles className="absolute top-10 left-10 h-6 w-6 text-yellow-400 animate-pulse" />
            <Sparkles className="absolute top-20 right-16 h-4 w-4 text-blue-400 animate-pulse delay-75" />
            <Sparkles className="absolute bottom-16 left-16 h-5 w-5 text-purple-400 animate-pulse delay-150" />
            <Sparkles className="absolute bottom-24 right-10 h-4 w-4 text-pink-400 animate-pulse delay-100" />
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative text-center">
            {/* Trophy icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-full">
                  <Trophy className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              {locale === 'en' ? 'Challenge Complete!' : '¡Desafío Completado!'}
            </h2>

            {/* Challenge name */}
            <p className="text-lg font-medium mb-6 text-white/90">
              {locale === 'en' ? challenge.name.en : challenge.name.es}
            </p>

            {/* Rewards section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Gift className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-400">
                  {locale === 'en' ? 'REWARDS EARNED' : 'RECOMPENSAS OBTENIDAS'}
                </span>
              </div>

              <div className="space-y-3">
                {/* Points reward */}
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {locale === 'en' ? 'Career Points' : 'Puntos de Carrera'}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-yellow-400">
                    +{challenge.reward.points}
                  </span>
                </div>

                {/* Badge reward */}
                {challenge.reward.badge && (
                  <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-purple-400" />
                      <span className="text-sm font-medium">
                        {locale === 'en' ? 'Achievement Badge' : 'Insignia de Logro'}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-purple-400">
                      {challenge.reward.badge}
                    </span>
                  </div>
                )}

                {/* Unlock reward */}
                {challenge.reward.unlock && (
                  <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-orange-400" />
                      <span className="text-sm font-medium">
                        {locale === 'en' ? 'Unlock' : 'Desbloqueo'}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-orange-400">
                      {challenge.reward.unlock}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Streak display */}
            {streak > 1 && (
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="h-6 w-6 text-orange-400" />
                  <span className="text-2xl font-bold text-orange-400">{streak}</span>
                  <span className="text-sm font-medium text-orange-400">
                    {locale === 'en' ? 'DAY STREAK!' : 'DÍAS SEGUIDOS!'}
                  </span>
                </div>
                <p className="text-xs text-orange-300">
                  {streak >= 7
                    ? locale === 'en'
                      ? 'You\'re on fire! 🔥'
                      : '¡Estás imparable! 🔥'
                    : locale === 'en'
                      ? 'Keep the momentum going!'
                      : '¡Mantén el impulso!'}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              {onPlayAgain && (
                <button
                  onClick={onPlayAgain}
                  className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                >
                  {locale === 'en' ? 'Play Again' : 'Jugar de Nuevo'}
                </button>
              )}
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors"
              >
                {locale === 'en' ? 'Close' : 'Cerrar'}
              </button>
            </div>

            {/* Encouraging message */}
            <p className="mt-4 text-sm text-white/70">
              {locale === 'en'
                ? 'Come back tomorrow for a new challenge!'
                : '¡Vuelve mañana para un nuevo desafío!'}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
