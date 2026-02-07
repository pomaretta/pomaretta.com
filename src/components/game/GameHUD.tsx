'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, Flame } from 'lucide-react'

interface GameHUDProps {
  score: number
  timer?: number
  combo: number
  gameState: 'idle' | 'playing' | 'paused' | 'gameOver'
}

export function GameHUD({ score, timer, combo, gameState }: GameHUDProps) {
  if (gameState !== 'playing') return null

  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
      {/* Left: Score and Timer */}
      <div className="bg-black/60 backdrop-blur-md rounded-lg px-4 py-3 border border-white/20">
        <div className="space-y-1">
          <div className="text-2xl font-bold font-mono tabular-nums">
            {score.toString().padStart(6, '0')}
          </div>
          {timer !== undefined && (
            <div className="text-sm text-muted-foreground font-mono">
              {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
      </div>

      {/* Right: Combo Multiplier */}
      <AnimatePresence>
        {combo > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="bg-gradient-to-r from-orange-500/80 to-red-500/80 backdrop-blur-md rounded-lg px-4 py-3 border border-white/30"
          >
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-white" />
              <div className="font-bold text-white">
                x{combo} COMBO!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
