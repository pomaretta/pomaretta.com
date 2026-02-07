'use client'

import { motion } from 'framer-motion'
import { Trophy, Coffee, Shield, Clock, RotateCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { GameStats } from './types'

interface GameOverModalProps {
  score: number
  stats: GameStats
  isNewHighScore: boolean
  onPlayAgain: () => void
  onChangeMode: () => void
}

export function GameOverModal({
  score,
  stats,
  isNewHighScore,
  onPlayAgain,
  onChangeMode,
}: GameOverModalProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-white/20 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-4"
          >
            {isNewHighScore ? (
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4">
                <Trophy className="h-12 w-12 text-white" />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-4">
                <Trophy className="h-12 w-12 text-white" />
              </div>
            )}
          </motion.div>

          <h3 className="text-3xl font-bold mb-2">
            {isNewHighScore ? 'New High Score!' : 'Game Over!'}
          </h3>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold font-mono bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          >
            {score.toString().padStart(6, '0')}
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 rounded-lg p-4 text-center border border-white/10"
          >
            <Coffee className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.coffeeCollected}</div>
            <div className="text-xs text-muted-foreground">Coffee Collected</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 rounded-lg p-4 text-center border border-white/10"
          >
            <Shield className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.obstaclesAvoided}</div>
            <div className="text-xs text-muted-foreground">Obstacles Avoided</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 rounded-lg p-4 text-center border border-white/10"
          >
            <Clock className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.timeSurvived}s</div>
            <div className="text-xs text-muted-foreground">Time Survived</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 rounded-lg p-4 text-center border border-white/10"
          >
            <div className="text-2xl mb-2">🔥</div>
            <div className="text-2xl font-bold">x{stats.maxCombo}</div>
            <div className="text-xs text-muted-foreground">Max Combo</div>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-3"
        >
          <Button
            onClick={onPlayAgain}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            size="lg"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Play Again
          </Button>
          <Button
            onClick={onChangeMode}
            variant="outline"
            size="lg"
          >
            <Home className="h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
