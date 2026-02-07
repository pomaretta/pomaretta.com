'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, ArrowLeft, Settings } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { Button } from '@/components/ui/Button'
import { GameModeSelector } from '@/components/game/GameModeSelector'
import { DifficultySelector } from '@/components/game/DifficultySelector'
import { GameCanvas } from '@/components/game/GameCanvas'
import { GameHUD } from '@/components/game/GameHUD'
import { GameOverModal } from '@/components/game/GameOverModal'
import { Leaderboard } from '@/components/game/Leaderboard'
import { StatsCard } from '@/components/game/StatsCard'
import { PersonalBestCard } from '@/components/game/PersonalBestCard'
import type { GameMode, Difficulty, GameStats } from '@/components/game/types'

type GameState = 'menu' | 'playing' | 'gameOver'

export default function GamePage() {
  const { t } = useLanguage()

  // Game configuration
  const [gameState, setGameState] = useState<GameState>('menu')
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal')

  // Game data
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(1)
  const [finalScore, setFinalScore] = useState(0)
  const [finalStats, setFinalStats] = useState<GameStats>({
    coffeeCollected: 0,
    obstaclesAvoided: 0,
    timeSurvived: 0,
    maxCombo: 0,
  })

  // Player stats (from localStorage)
  const [highScore, setHighScore] = useState(0)
  const [gamesPlayed, setGamesPlayed] = useState(0)
  const [totalScore, setTotalScore] = useState(0)

  // Load saved stats
  useEffect(() => {
    const savedHighScore = localStorage.getItem('codeRunnerHighScore')
    const savedGamesPlayed = localStorage.getItem('codeRunnerGamesPlayed')
    const savedTotalScore = localStorage.getItem('codeRunnerTotalScore')

    if (savedHighScore) setHighScore(parseInt(savedHighScore))
    if (savedGamesPlayed) setGamesPlayed(parseInt(savedGamesPlayed))
    if (savedTotalScore) setTotalScore(parseInt(savedTotalScore))
  }, [])

  const handleStartGame = () => {
    setScore(0)
    setCombo(1)
    setGameState('playing')
  }

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore)
    // Update combo based on score changes
    if (newScore > score) {
      const diff = newScore - score
      if (diff >= 10) {
        setCombo(Math.floor(diff / 10))
      }
    }
  }

  const handleGameOver = (finalScore: number, stats: GameStats) => {
    setFinalScore(finalScore)
    setFinalStats(stats)
    setGameState('gameOver')

    // Update stats
    const newGamesPlayed = gamesPlayed + 1
    const newTotalScore = totalScore + finalScore
    const newHighScore = Math.max(highScore, finalScore)

    setGamesPlayed(newGamesPlayed)
    setTotalScore(newTotalScore)
    setHighScore(newHighScore)

    // Save to localStorage
    localStorage.setItem('codeRunnerHighScore', newHighScore.toString())
    localStorage.setItem('codeRunnerGamesPlayed', newGamesPlayed.toString())
    localStorage.setItem('codeRunnerTotalScore', newTotalScore.toString())
  }

  const handlePlayAgain = () => {
    setGameState('playing')
    setScore(0)
    setCombo(1)
  }

  const handleBackToMenu = () => {
    setGameState('menu')
    setScore(0)
    setCombo(1)
  }

  const isNewHighScore = finalScore > highScore - finalScore && finalScore > 0
  const averageScore = gamesPlayed > 0 ? totalScore / gamesPlayed : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 pt-4 pb-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
              className="bg-background/60 backdrop-blur-xl border border-white/10 hover:bg-background/80"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Button>

            {gameState === 'playing' && (
              <Button
                variant="ghost"
                onClick={handleBackToMenu}
                className="bg-background/60 backdrop-blur-xl border border-white/10 hover:bg-background/80"
              >
                <Settings className="h-4 w-4 mr-2" />
                Menu
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {/* MENU STATE */}
            {gameState === 'menu' && (
              <motion.div
                key="menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Header */}
                <div className="text-center">
                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                  >
                    Code Runner Arena
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-muted-foreground"
                  >
                    Jump over bugs, collect coffee, and climb the leaderboard
                  </motion.p>
                </div>

                {/* Mode Selection */}
                <div>
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold mb-4 text-center"
                  >
                    Choose Your Mode
                  </motion.h2>
                  <GameModeSelector
                    selectedMode={selectedMode}
                    onSelectMode={setSelectedMode}
                  />
                </div>

                {/* Difficulty Selection */}
                <div>
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold mb-4 text-center"
                  >
                    Select Difficulty
                  </motion.h2>
                  <DifficultySelector
                    selectedDifficulty={selectedDifficulty}
                    onSelectDifficulty={setSelectedDifficulty}
                  />
                </div>

                {/* Personal Best & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <PersonalBestCard
                    mode={selectedMode}
                    difficulty={selectedDifficulty}
                    score={highScore}
                  />
                  <StatsCard
                    gamesPlayed={gamesPlayed}
                    totalScore={totalScore}
                    highScore={highScore}
                    averageScore={averageScore}
                  />
                </div>

                {/* Start Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center"
                >
                  <Button
                    onClick={handleStartGame}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-lg px-12 py-6 text-white font-bold shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all"
                  >
                    <Play className="h-6 w-6 mr-2" />
                    Start Game
                  </Button>
                </motion.div>

                {/* Leaderboard */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="max-w-4xl mx-auto"
                >
                  <Leaderboard mode={selectedMode} difficulty={selectedDifficulty} />
                </motion.div>
              </motion.div>
            )}

            {/* PLAYING STATE */}
            {gameState === 'playing' && (
              <motion.div
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-5xl mx-auto"
              >
                <div className="relative">
                  {/* Game Canvas */}
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 shadow-2xl">
                    <GameCanvas
                      gameState="playing"
                      mode={selectedMode}
                      difficulty={selectedDifficulty}
                      onScoreUpdate={handleScoreUpdate}
                      onGameOver={handleGameOver}
                    />

                    {/* In-game HUD Overlay */}
                    <div className="mt-4">
                      <GameHUD
                        score={score}
                        combo={combo}
                        gameState="playing"
                      />
                    </div>

                    {/* Controls Hint */}
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                      <p>Press <kbd className="bg-white/10 px-2 py-1 rounded border border-white/20">SPACE</kbd> to jump</p>
                    </div>
                  </div>

                  {/* Side Stats (Desktop) */}
                  <div className="hidden xl:block absolute top-0 -right-80 w-72 space-y-4">
                    <StatsCard
                      gamesPlayed={gamesPlayed}
                      totalScore={totalScore}
                      highScore={highScore}
                      averageScore={averageScore}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* GAME OVER STATE */}
            {gameState === 'gameOver' && (
              <motion.div
                key="gameOver"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-5xl mx-auto"
              >
                <div className="relative">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 shadow-2xl">
                    <GameCanvas
                      gameState="idle"
                      mode={selectedMode}
                      difficulty={selectedDifficulty}
                      onScoreUpdate={handleScoreUpdate}
                      onGameOver={handleGameOver}
                    />

                    {/* Game Over Modal */}
                    <GameOverModal
                      score={finalScore}
                      stats={finalStats}
                      isNewHighScore={isNewHighScore}
                      onPlayAgain={handlePlayAgain}
                      onChangeMode={handleBackToMenu}
                    />
                  </div>

                  {/* Updated Stats (Desktop) */}
                  <div className="hidden xl:block absolute top-0 -right-80 w-72 space-y-4">
                    <StatsCard
                      gamesPlayed={gamesPlayed}
                      totalScore={totalScore}
                      highScore={highScore}
                      averageScore={averageScore}
                    />
                    <Leaderboard mode={selectedMode} difficulty={selectedDifficulty} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
