'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'
import { DailyChallenge } from '@/types/game'
import { Calendar, Target, Trophy, Flame, Star, Award } from 'lucide-react'
import { FadeInUp } from '@/components/animations/FadeInUp'

interface DailyChallengeCardProps {
  challenge: DailyChallenge
  onStart?: () => void
  isActive?: boolean
  currentProgress?: number
}

export function DailyChallengeCard({ challenge, onStart, isActive = false, currentProgress }: DailyChallengeCardProps) {
  const { t, locale } = useLanguage()

  const progressPercentage = currentProgress !== undefined ? currentProgress : (challenge.progress || 0)
  const isCompleted = challenge.completed || false

  // Get difficulty color
  const getDifficultyColor = () => {
    switch (challenge.templateDifficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'hard':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'expert':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
  }

  // Get challenge type icon
  const getChallengeIcon = () => {
    switch (challenge.type) {
      case 'score':
        return <Trophy className="h-5 w-5" />
      case 'collect':
        return '☕'
      case 'survive':
        return '⏱️'
      case 'avoid':
        return '🐛'
      default:
        return <Target className="h-5 w-5" />
    }
  }

  return (
    <FadeInUp>
      <div className="relative h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg shadow-black/10 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_50%)] pointer-events-none" />

        {/* Status badges */}
        {isActive && !isCompleted && (
          <div className="absolute top-4 right-4 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-blue-500/30 animate-pulse">
            <Target className="h-3 w-3" />
            {locale === 'en' ? 'On Progress' : 'En Progreso'}
          </div>
        )}
        {isCompleted && (
          <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-green-500/30">
            <Trophy className="h-3 w-3" />
            {locale === 'en' ? 'Completed' : 'Completado'}
          </div>
        )}

        <div className="relative">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-2xl border border-blue-500/30">
              {typeof getChallengeIcon() === 'string' ? (
                <span>{getChallengeIcon()}</span>
              ) : (
                getChallengeIcon()
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Daily Challenge' : 'Desafío Diario'}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-1">
                {locale === 'en' ? challenge.name.en : challenge.name.es}
              </h3>
              <p className="text-sm text-muted-foreground">
                {locale === 'en' ? challenge.description.en : challenge.description.es}
              </p>
            </div>
          </div>

          {/* Difficulty badge */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor()}`}
            >
              {challenge.templateDifficulty.toUpperCase()}
            </span>
            {challenge.attempts && challenge.attempts > 0 && (
              <span className="text-xs text-muted-foreground">
                {challenge.attempts} {locale === 'en' ? 'attempts' : 'intentos'}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                {locale === 'en' ? 'Progress' : 'Progreso'}
              </span>
              <span className="text-sm font-bold text-blue-400">
                {progressPercentage.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, progressPercentage)}%` }}
              />
            </div>
          </div>

          {/* Rewards */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium">
                  +{challenge.reward.points} {locale === 'en' ? 'points' : 'puntos'}
                </span>
              </div>
              {challenge.reward.badge && (
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-muted-foreground">
                    {locale === 'en' ? 'Badge' : 'Insignia'}
                  </span>
                </div>
              )}
              {challenge.reward.unlock && (
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-orange-400" />
                  <span className="text-sm text-muted-foreground">
                    {locale === 'en' ? 'Unlock' : 'Desbloqueo'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action button */}
          {!isCompleted && onStart && (
            <button
              onClick={onStart}
              className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Target className="h-5 w-5" />
              {locale === 'en' ? 'Start Challenge' : 'Comenzar Desafío'}
            </button>
          )}

          {isCompleted && (
            <div className="w-full px-4 py-3 bg-green-500/10 text-green-400 font-semibold rounded-lg flex items-center justify-center gap-2 border border-green-500/30">
              <Trophy className="h-5 w-5" />
              {locale === 'en'
                ? `Completed on ${new Date(challenge.completedAt!).toLocaleDateString()}`
                : `Completado el ${new Date(challenge.completedAt!).toLocaleDateString()}`}
            </div>
          )}
        </div>
      </div>
    </FadeInUp>
  )
}

interface ChallengeStreakCardProps {
  currentStreak: number
  longestStreak: number
}

export function ChallengeStreakCard({ currentStreak, longestStreak }: ChallengeStreakCardProps) {
  const { locale } = useLanguage()

  return (
    <div className="h-full bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-md border border-orange-500/20 rounded-xl p-6 shadow-lg flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Flame className="h-6 w-6 text-orange-400" />
        <h3 className="text-lg font-bold">{locale === 'en' ? 'Streak' : 'Racha'}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1 items-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-400 mb-1">{currentStreak}</div>
          <div className="text-xs text-muted-foreground">
            {locale === 'en' ? 'Current' : 'Actual'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-1">{longestStreak}</div>
          <div className="text-xs text-muted-foreground">
            {locale === 'en' ? 'Longest' : 'Más larga'}
          </div>
        </div>
      </div>

      {currentStreak >= 3 && (
        <div className="mt-auto pt-4 text-center text-sm text-orange-400 font-medium">
          {currentStreak >= 7
            ? locale === 'en'
              ? '🔥 On fire!'
              : '🔥 ¡Imparable!'
            : locale === 'en'
              ? '⭐ Keep it up!'
              : '⭐ ¡Sigue así!'}
        </div>
      )}
    </div>
  )
}
