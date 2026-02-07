'use client'

import { motion } from 'framer-motion'
import { Trophy, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import type { GameMode, Difficulty } from './types'

interface PersonalBestCardProps {
  mode: GameMode
  difficulty: Difficulty
  score: number
  previousBest?: number
}

export function PersonalBestCard({ mode, difficulty, score, previousBest }: PersonalBestCardProps) {
  const improvement = previousBest ? ((score - previousBest) / previousBest * 100) : 0
  const hasImproved = improvement > 0

  const getModeLabel = (mode: GameMode) => {
    const labels: Record<GameMode, string> = {
      classic: 'Classic Mode',
      sprint: 'Sprint Mode',
      debug: 'Debug Challenge',
      chaos: 'Chaos Mode',
    }
    return labels[mode]
  }

  const getDifficultyColor = (difficulty: Difficulty) => {
    const colors = {
      easy: 'text-green-400',
      normal: 'text-yellow-400',
      hard: 'text-orange-400',
      expert: 'text-red-400',
    }
    return colors[difficulty]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Your Best</CardTitle>
              <CardDescription>
                {getModeLabel(mode)} • <span className={getDifficultyColor(difficulty)}>{difficulty.toUpperCase()}</span>
              </CardDescription>
            </div>
            <div className="bg-yellow-500/20 rounded-full p-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold font-mono">
                {score.toLocaleString()}
              </div>
              {hasImproved && previousBest && (
                <div className="flex items-center gap-1 text-sm text-green-400 mt-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>+{improvement.toFixed(1)}% from last</span>
                </div>
              )}
            </div>
            {previousBest && (
              <div className="text-right text-sm text-muted-foreground">
                Previous<br />
                <span className="font-mono">{previousBest.toLocaleString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
