'use client'

import { motion } from 'framer-motion'
import { Gamepad2, Zap, Bug, Tornado } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import type { GameMode } from './types'

interface GameModeSelectorProps {
  selectedMode: GameMode
  onSelectMode: (mode: GameMode) => void
}

const modes = [
  {
    id: 'classic' as GameMode,
    icon: Gamepad2,
    title: 'Classic Mode',
    description: 'Endless runner with progressive difficulty. Survive as long as you can!',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    hoverColor: 'hover:bg-blue-500/20',
  },
  {
    id: 'sprint' as GameMode,
    icon: Zap,
    title: 'Sprint Mode',
    description: '60-second time trial. Score as much as possible!',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    hoverColor: 'hover:bg-yellow-500/20',
  },
  {
    id: 'debug' as GameMode,
    icon: Bug,
    title: 'Debug Challenge',
    description: 'Mission-based gameplay with specific goals to complete.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    hoverColor: 'hover:bg-green-500/20',
  },
  {
    id: 'chaos' as GameMode,
    icon: Tornado,
    title: 'Chaos Mode',
    description: 'Random events and unpredictable challenges. Expect the unexpected!',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    hoverColor: 'hover:bg-purple-500/20',
  },
]

export function GameModeSelector({ selectedMode, onSelectMode }: GameModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {modes.map((mode, index) => {
        const Icon = mode.icon
        const isSelected = selectedMode === mode.id

        return (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-300 ${
                isSelected
                  ? `${mode.bgColor} border-2 border-white/30 shadow-lg`
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              } ${mode.hoverColor}`}
              onClick={() => onSelectMode(mode.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${mode.bgColor}`}>
                    <Icon className={`h-6 w-6 ${mode.color}`} />
                  </div>
                  <CardTitle className="text-lg">{mode.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {mode.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
