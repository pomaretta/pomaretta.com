'use client'

import { Play, RotateCcw, Trophy, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import Link from 'next/link'

interface QuickPlayControlsProps {
  gameState: 'idle' | 'playing' | 'gameOver'
  score: number
  highScore: number
  onStart: () => void
  onReset: () => void
}

export function QuickPlayControls({
  gameState,
  score,
  highScore,
  onStart,
  onReset,
}: QuickPlayControlsProps) {
  const { t } = useLanguage()
  const isNewHighScore = gameState === 'gameOver' && score > 0 && score >= highScore

  return (
    <>
      {/* In-game HUD - minimal overlay */}
      {gameState === 'playing' && (
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
            <div className="text-lg font-bold font-mono">{score}</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
            <div className="text-lg font-bold font-mono text-yellow-400">{highScore}</div>
            <div className="text-xs text-muted-foreground">Best</div>
          </div>
        </div>
      )}

      {/* Pre-game state */}
      {gameState === 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg">
          <div className="text-center space-y-6 p-8">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                {t.game?.quickPlay?.title || 'Quick Play'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t.game?.quickPlay?.subtitle || 'Classic Mode - Normal Difficulty'}
              </p>
              {highScore > 0 && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-sm">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  <span>
                    {t.game?.quickPlay?.personalBest || 'Personal Best'}: <strong>{highScore}</strong>
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
            >
              <Play className="h-6 w-6" />
              {t.game?.quickPlay?.playButton || 'Play'}
            </button>

            <Link
              href="/game"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              {t.game?.quickPlay?.fullGameLink || 'More modes & options'}
              <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      )}

      {/* Post-game state */}
      {gameState === 'gameOver' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg">
          <div className="text-center space-y-6 p-8">
            {isNewHighScore ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-yellow-400 mb-4">
                  <Trophy className="h-8 w-8" />
                  <h3 className="text-3xl font-bold">
                    {t.game?.quickPlay?.newHighScore || 'New High Score!'}
                  </h3>
                </div>
                <p className="text-5xl font-bold font-mono">{score}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-3xl font-bold">
                  {t.game?.quickPlay?.gameOver || 'Game Over!'}
                </h3>
                <p className="text-4xl font-bold font-mono">{score}</p>
                <p className="text-sm text-muted-foreground">
                  {t.game?.quickPlay?.best || 'Best'}: {highScore}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={onReset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors font-semibold shadow-lg"
              >
                <RotateCcw className="h-5 w-5" />
                {t.game?.quickPlay?.playAgain || 'Play Again'}
              </button>
              <Link
                href="/game"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors font-semibold border border-white/20"
              >
                {t.game?.quickPlay?.viewFullGame || 'View Full Game'}
                <ExternalLink className="h-5 w-5" />
              </Link>
            </div>

            <p className="text-xs text-muted-foreground">
              {t.game?.quickPlay?.signInToSave || 'Sign in to save your progress'}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
