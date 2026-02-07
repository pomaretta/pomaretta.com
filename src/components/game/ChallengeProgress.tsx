'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'
import { ChallengeProgress as Progress } from '@/types/game'
import { Target, TrendingUp, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ChallengeProgressProps {
  progress: Progress
  challengeName: string
  motivationalMessage?: string
  nearCompletionMessage?: string
}

export function ChallengeProgress({
  progress,
  challengeName,
  motivationalMessage,
  nearCompletionMessage,
}: ChallengeProgressProps) {
  const { locale } = useLanguage()
  const [showMotivation, setShowMotivation] = useState(false)
  const [previousPercentage, setPreviousPercentage] = useState(0)

  // Show motivational message when progress increases significantly
  useEffect(() => {
    if (progress.percentage > previousPercentage + 10) {
      setShowMotivation(true)
      const timer = setTimeout(() => setShowMotivation(false), 2000)
      setPreviousPercentage(progress.percentage)
      return () => clearTimeout(timer)
    }
  }, [progress.percentage, previousPercentage])

  // Calculate if close to completion
  const isNearCompletion = progress.percentage >= 80 && progress.percentage < 100

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {/* Main progress card */}
      <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <Target className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Daily Challenge' : 'Desafío Diario'}
            </div>
            <div className="text-sm font-bold">{challengeName}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">
              {progress.current} / {progress.target}
            </span>
            <span className="text-xs font-bold text-blue-400">{progress.percentage.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out relative"
              style={{ width: `${Math.min(100, progress.percentage)}%` }}
            >
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Near completion indicator */}
        {isNearCompletion && nearCompletionMessage && (
          <div className="text-xs text-orange-400 font-medium flex items-center gap-1 mt-2">
            <Zap className="h-3 w-3" />
            {nearCompletionMessage}
          </div>
        )}
      </div>

      {/* Motivational popup */}
      {showMotivation && motivationalMessage && (
        <div className="mt-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md border border-green-500/30 rounded-lg p-3 shadow-xl animate-bounce">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">{motivationalMessage}</span>
          </div>
        </div>
      )}

      {/* Milestone indicators */}
      {progress.percentage >= 25 && progress.percentage < 26 && (
        <MilestoneNotification milestone={25} locale={locale} />
      )}
      {progress.percentage >= 50 && progress.percentage < 51 && (
        <MilestoneNotification milestone={50} locale={locale} />
      )}
      {progress.percentage >= 75 && progress.percentage < 76 && (
        <MilestoneNotification milestone={75} locale={locale} />
      )}
    </div>
  )
}

interface MilestoneNotificationProps {
  milestone: number
  locale: 'en' | 'es'
}

function MilestoneNotification({ milestone, locale }: MilestoneNotificationProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  const messages = {
    en: {
      25: '🎯 25% Complete!',
      50: '⭐ Halfway There!',
      75: '🔥 Almost Done!',
    },
    es: {
      25: '🎯 ¡25% Completado!',
      50: '⭐ ¡A Mitad de Camino!',
      75: '🔥 ¡Casi Terminado!',
    },
  }

  return (
    <div className="mt-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-yellow-500/30 rounded-lg p-3 shadow-xl animate-pulse">
      <div className="text-center text-sm font-bold text-yellow-400">
        {messages[locale][milestone as keyof typeof messages.en]}
      </div>
    </div>
  )
}

/**
 * Compact progress indicator for minimal UI
 */
interface CompactProgressProps {
  progress: Progress
  challengeType: 'score' | 'collect' | 'survive' | 'avoid' | 'complete'
}

export function CompactChallengeProgress({ progress, challengeType }: CompactProgressProps) {
  const getIcon = () => {
    switch (challengeType) {
      case 'score':
        return '🏆'
      case 'collect':
        return '☕'
      case 'survive':
        return '⏱️'
      case 'avoid':
        return '🐛'
      default:
        return '🎯'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/70 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
      <span className="text-lg">{getIcon()}</span>
      <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${Math.min(100, progress.percentage)}%` }}
        />
      </div>
      <span className="text-xs font-mono font-bold text-blue-400">
        {progress.percentage.toFixed(0)}%
      </span>
    </div>
  )
}
