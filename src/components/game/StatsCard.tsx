'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Award, Zap, Target } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

interface StatsCardProps {
  gamesPlayed: number
  totalScore: number
  highScore: number
  averageScore: number
}

export function StatsCard({ gamesPlayed, totalScore, highScore, averageScore }: StatsCardProps) {
  const stats = [
    {
      label: 'Games Played',
      value: gamesPlayed,
      icon: Target,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Total Score',
      value: totalScore.toLocaleString(),
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'High Score',
      value: highScore.toLocaleString(),
      icon: Award,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Average',
      value: Math.round(averageScore).toLocaleString(),
      icon: Zap,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ]

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
        <CardDescription>Personal performance overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.bgColor} rounded-lg p-4 border border-white/10`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
                <div className={`text-2xl font-bold font-mono ${stat.color}`}>
                  {stat.value}
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
