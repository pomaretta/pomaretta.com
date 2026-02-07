'use client'

import { FadeInUp } from '@/components/animations/FadeInUp'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { QuickPlayGame, QuickPlayGameHandle } from '@/components/game/QuickPlayGame'
import { DailyChallengeCard, ChallengeStreakCard } from '@/components/game/DailyChallengeCard'
import { getTodayChallenge, getStreak } from '@/lib/game/daily-challenges'
import { useState, useEffect, useRef } from 'react'
import type { DailyChallenge } from '@/types/game'

export function CodeRunnerGame() {
  const { t } = useLanguage()
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null)
  const [streak, setStreak] = useState({ current: 0, longest: 0 })
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null)
  const [challengeProgress, setChallengeProgress] = useState(0)
  const gameControlRef = useRef<QuickPlayGameHandle>(null)

  useEffect(() => {
    // Load today's challenge and streak
    const challenge = getTodayChallenge()
    const streakData = getStreak()
    setDailyChallenge(challenge)
    setStreak(streakData)
  }, [])

  const handleChallengeStart = () => {
    if (!dailyChallenge) return

    // Activate the challenge
    setActiveChallengeId(dailyChallenge.id)
    setChallengeProgress(dailyChallenge.progress || 0)

    // Scroll to game
    const gameElement = document.querySelector('.quick-play-container')
    if (gameElement) {
      gameElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      gameElement.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2', 'ring-offset-gray-900')
      setTimeout(() => {
        gameElement.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2', 'ring-offset-gray-900')
      }, 2000)

      // Start the game after scrolling
      setTimeout(() => {
        gameControlRef.current?.startGame()
      }, 500)
    }
  }

  const handleChallengeProgress = (progress: number, completed: boolean) => {
    setChallengeProgress(progress)

    if (completed && dailyChallenge) {
      // Reload challenge to get updated completion status
      const updatedChallenge = getTodayChallenge()
      setDailyChallenge(updatedChallenge)

      // Reload streak in case it updated
      const updatedStreak = getStreak()
      setStreak(updatedStreak)

      // Clear active challenge
      setActiveChallengeId(null)
    }
  }

  const activeChallenge = activeChallengeId === dailyChallenge?.id ? dailyChallenge : null

  return (
    <section className="py-24 px-4 bg-white/[0.02]">
      <div className="max-w-6xl mx-auto">
        <FadeInUp delay={0.2}>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.game?.title || 'Code Runner: Debug Edition'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t.game?.description || 'Jump over bugs and errors, collect coffee for bonus points!'}
            </p>
          </div>
        </FadeInUp>

        {/* Daily Challenge Section */}
        {dailyChallenge && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 flex">
              <FadeInUp delay={0.25} className="flex-1">
                <DailyChallengeCard
                  challenge={dailyChallenge}
                  onStart={handleChallengeStart}
                  isActive={activeChallengeId === dailyChallenge.id}
                  currentProgress={challengeProgress}
                />
              </FadeInUp>
            </div>
            <div className="flex">
              <FadeInUp delay={0.3} className="flex-1">
                <ChallengeStreakCard
                  currentStreak={streak.current}
                  longestStreak={streak.longest}
                />
              </FadeInUp>
            </div>
          </div>
        )}

        <FadeInUp delay={0.3}>
          <div className="quick-play-container bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 shadow-lg shadow-black/10 transition-all duration-300">
            <QuickPlayGame
              ref={gameControlRef}
              activeChallenge={activeChallenge}
              onChallengeProgress={handleChallengeProgress}
            />

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">🐛⚠️💥</div>
                <p className="text-muted-foreground">
                  {t.game?.quickPlay?.avoidObstacles || 'Avoid bugs & errors'}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">☕</div>
                <p className="text-muted-foreground">
                  {t.game?.quickPlay?.collectCoffee || 'Collect coffee +10pts'}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">⌨️</div>
                <p className="text-muted-foreground">
                  {t.game?.quickPlay?.controls || 'Press SPACE to jump'}
                </p>
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>{t.game?.quickPlay?.hint || 'Desktop only • Use spacebar to jump • Have fun debugging!'}</p>
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}
