'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Award, Crown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import type { LeaderboardEntry, GameMode, Difficulty } from './types'

interface LeaderboardProps {
  mode: GameMode
  difficulty: Difficulty
}

// Mock data for demonstration
const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    username: 'CodeMaster',
    score: 15420,
    mode: 'classic',
    difficulty: 'expert',
    duration: 240,
    timestamp: Date.now() - 3600000,
    isGuest: false,
  },
  {
    id: '2',
    username: 'BugHunter',
    score: 12350,
    mode: 'classic',
    difficulty: 'expert',
    duration: 198,
    timestamp: Date.now() - 7200000,
    isGuest: false,
  },
  {
    id: '3',
    username: 'CoffeeAddict',
    score: 10890,
    mode: 'classic',
    difficulty: 'expert',
    duration: 156,
    timestamp: Date.now() - 10800000,
    isGuest: false,
  },
  {
    id: '4',
    username: 'DebugPro',
    score: 9450,
    mode: 'classic',
    difficulty: 'expert',
    duration: 132,
    timestamp: Date.now() - 14400000,
    isGuest: false,
  },
  {
    id: '5',
    username: 'SpeedRunner',
    score: 8720,
    mode: 'classic',
    difficulty: 'expert',
    duration: 120,
    timestamp: Date.now() - 18000000,
    isGuest: false,
  },
]

export function Leaderboard({ mode, difficulty }: LeaderboardProps) {
  const [entries] = useState<LeaderboardEntry[]>(mockLeaderboard)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-400" />
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-orange-600" />
      default:
        return <Award className="h-5 w-5 text-blue-400" />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30'
      case 3:
        return 'bg-gradient-to-r from-orange-600/20 to-orange-700/20 border-orange-600/30'
      default:
        return 'bg-white/5 border-white/10'
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Leaderboard
        </CardTitle>
        <CardDescription>
          Top players for {mode} mode on {difficulty} difficulty
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.map((entry, index) => {
            const rank = index + 1

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:bg-white/5 ${getRankColor(rank)}`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-10 h-10">
                  {rank <= 3 ? (
                    getRankIcon(rank)
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">
                      #{rank}
                    </span>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold truncate">{entry.username}</div>
                    {entry.isGuest && (
                      <span className="text-xs bg-white/10 px-2 py-0.5 rounded">
                        Guest
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTimestamp(entry.timestamp)}
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right">
                  <div className="font-bold font-mono text-lg">
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDuration(entry.duration)}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Your Rank (if not in top 10) */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-sm text-center text-muted-foreground">
            Your best: <span className="font-bold text-foreground">#23</span> with{' '}
            <span className="font-bold text-foreground">5,240</span> points
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
