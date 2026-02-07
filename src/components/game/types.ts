// Import and re-export from main types to ensure consistency
import type { GameMode as MainGameMode, GameDifficulty } from '@/types/game'

export type GameMode = MainGameMode
export type Difficulty = GameDifficulty

export interface GameStats {
  coffeeCollected: number
  obstaclesAvoided: number
  timeSurvived: number
  maxCombo: number
}

export interface LeaderboardEntry {
  id: string
  username: string
  avatar?: string
  score: number
  mode: GameMode
  difficulty: Difficulty
  duration: number
  timestamp: number
  isGuest: boolean
}

export interface PersonalBest {
  mode: GameMode
  difficulty: Difficulty
  score: number
  date: number
}
