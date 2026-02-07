/**
 * Scoring System
 * Unified scoring logic with combos, multipliers, and high score tracking
 */

import { GAME_CONSTANTS, DifficultyLevel, GameMode, STORAGE_KEYS } from '@/data/game-config'

// ============================================================================
// TYPES
// ============================================================================

export interface ScoreState {
  current: number
  baseScore: number // score before multipliers
  multiplier: number
  combo: number // current coffee combo count
  comboTimer: number // frames remaining until combo resets
  nearMisses: number
  coffeesCollected: number
  obstaclesDodged: number
  highScore: number
}

export interface ScoreEvent {
  type: 'coffee' | 'obstacle' | 'nearMiss' | 'combo' | 'mission' | 'time'
  points: number
  multiplier: number
  message?: string
}

// ============================================================================
// INITIALIZATION
// ============================================================================

export function initializeScoreState(gameMode: GameMode): ScoreState {
  return {
    current: 0,
    baseScore: 0,
    multiplier: 1.0,
    combo: 0,
    comboTimer: 0,
    nearMisses: 0,
    coffeesCollected: 0,
    obstaclesDodged: 0,
    highScore: loadHighScore(gameMode),
  }
}

// ============================================================================
// SCORE UPDATES
// ============================================================================

export function addPassiveScore(
  state: ScoreState,
  difficulty: DifficultyLevel,
  difficultyConfig: { scoreMultiplier: number }
): ScoreState {
  const points = GAME_CONSTANTS.POINTS_PER_FRAME * difficultyConfig.scoreMultiplier
  const newState = { ...state }

  newState.baseScore += points
  newState.current = Math.floor(newState.baseScore * newState.multiplier)

  return newState
}

export function addCoffeeScore(
  state: ScoreState,
  difficulty: DifficultyLevel,
  difficultyConfig: { scoreMultiplier: number }
): { state: ScoreState; event: ScoreEvent } {
  const newState = { ...state }

  // Increment combo
  newState.combo++
  newState.comboTimer = GAME_CONSTANTS.COMBO_TIMEOUT
  newState.coffeesCollected++

  // Calculate points
  let points = GAME_CONSTANTS.COFFEE_POINTS * difficultyConfig.scoreMultiplier

  // Apply combo multiplier if threshold reached
  if (newState.combo >= GAME_CONSTANTS.COMBO_THRESHOLD) {
    newState.multiplier = GAME_CONSTANTS.COMBO_MULTIPLIER
    points *= GAME_CONSTANTS.COMBO_MULTIPLIER
  }

  newState.baseScore += points
  newState.current = Math.floor(newState.baseScore * newState.multiplier)

  const event: ScoreEvent = {
    type: newState.combo >= GAME_CONSTANTS.COMBO_THRESHOLD ? 'combo' : 'coffee',
    points: Math.floor(points),
    multiplier: newState.multiplier,
    message:
      newState.combo >= GAME_CONSTANTS.COMBO_THRESHOLD
        ? `${newState.combo}x COMBO!`
        : undefined,
  }

  return { state: newState, event }
}

export function addObstacleScore(
  state: ScoreState,
  obstaclePoints: number,
  difficultyConfig: { scoreMultiplier: number }
): { state: ScoreState; event: ScoreEvent } {
  const newState = { ...state }

  newState.obstaclesDodged++

  const points = obstaclePoints * difficultyConfig.scoreMultiplier * newState.multiplier

  newState.baseScore += points
  newState.current = Math.floor(newState.baseScore * newState.multiplier)

  const event: ScoreEvent = {
    type: 'obstacle',
    points: Math.floor(points),
    multiplier: newState.multiplier,
  }

  return { state: newState, event }
}

export function addNearMissScore(
  state: ScoreState,
  difficultyConfig: { scoreMultiplier: number }
): { state: ScoreState; event: ScoreEvent } {
  const newState = { ...state }

  newState.nearMisses++

  const points =
    GAME_CONSTANTS.NEAR_MISS_POINTS * difficultyConfig.scoreMultiplier * newState.multiplier

  newState.baseScore += points
  newState.current = Math.floor(newState.baseScore * newState.multiplier)

  const event: ScoreEvent = {
    type: 'nearMiss',
    points: Math.floor(points),
    multiplier: newState.multiplier,
    message: 'CLOSE CALL!',
  }

  return { state: newState, event }
}

export function addMissionScore(
  state: ScoreState,
  missionPoints: number
): { state: ScoreState; event: ScoreEvent } {
  const newState = { ...state }

  newState.baseScore += missionPoints
  newState.current = Math.floor(newState.baseScore * newState.multiplier)

  const event: ScoreEvent = {
    type: 'mission',
    points: missionPoints,
    multiplier: newState.multiplier,
    message: 'MISSION COMPLETE!',
  }

  return { state: newState, event }
}

export function addTimeBonus(
  state: ScoreState,
  secondsRemaining: number
): { state: ScoreState; event: ScoreEvent } {
  const newState = { ...state }

  const points = secondsRemaining * 100

  newState.baseScore += points
  newState.current = Math.floor(newState.baseScore * newState.multiplier)

  const event: ScoreEvent = {
    type: 'time',
    points,
    multiplier: newState.multiplier,
    message: `TIME BONUS: ${secondsRemaining}s`,
  }

  return { state: newState, event }
}

// ============================================================================
// COMBO SYSTEM
// ============================================================================

export function updateComboTimer(state: ScoreState): ScoreState {
  const newState = { ...state }

  if (newState.comboTimer > 0) {
    newState.comboTimer--

    // Reset combo if timer expires
    if (newState.comboTimer === 0) {
      newState.combo = 0
      newState.multiplier = 1.0
    }
  }

  return newState
}

export function resetCombo(state: ScoreState): ScoreState {
  return {
    ...state,
    combo: 0,
    comboTimer: 0,
    multiplier: 1.0,
  }
}

export function getComboProgress(state: ScoreState): number {
  // Return progress as percentage (0-100)
  if (state.comboTimer === 0) return 0
  return (state.comboTimer / GAME_CONSTANTS.COMBO_TIMEOUT) * 100
}

// ============================================================================
// HIGH SCORE MANAGEMENT
// ============================================================================

export function loadHighScore(gameMode: GameMode): number {
  if (typeof window === 'undefined') return 0

  const key = getStorageKey(gameMode)
  const saved = localStorage.getItem(key)
  return saved ? parseInt(saved, 10) : 0
}

export function saveHighScore(gameMode: GameMode, score: number): void {
  if (typeof window === 'undefined') return

  const key = getStorageKey(gameMode)
  const currentHighScore = loadHighScore(gameMode)

  if (score > currentHighScore) {
    localStorage.setItem(key, score.toString())
  }
}

export function checkAndUpdateHighScore(
  state: ScoreState,
  gameMode: GameMode
): { state: ScoreState; isNewHighScore: boolean } {
  const newState = { ...state }
  const isNewHighScore = newState.current > newState.highScore

  if (isNewHighScore) {
    newState.highScore = newState.current
    saveHighScore(gameMode, newState.current)
  }

  return { state: newState, isNewHighScore }
}

function getStorageKey(gameMode: GameMode): string {
  switch (gameMode) {
    case 'classic':
      return STORAGE_KEYS.HIGH_SCORE_CLASSIC
    case 'sprint':
      return STORAGE_KEYS.HIGH_SCORE_SPRINT
    case 'debug':
      return STORAGE_KEYS.HIGH_SCORE_DEBUG
    case 'chaos':
      return STORAGE_KEYS.HIGH_SCORE_CHAOS
    default:
      return STORAGE_KEYS.HIGH_SCORE_CLASSIC
  }
}

// ============================================================================
// STATISTICS
// ============================================================================

export interface GameStatistics {
  finalScore: number
  coffeesCollected: number
  obstaclesDodged: number
  nearMisses: number
  maxCombo: number
  accuracy: number // percentage
  survivalTime: number // seconds
}

export function calculateStatistics(
  state: ScoreState,
  frameCount: number,
  maxCombo: number
): GameStatistics {
  const survivalTime = Math.floor(frameCount / GAME_CONSTANTS.TARGET_FPS)

  // Calculate accuracy (coffees vs opportunities)
  const totalInteractions = state.coffeesCollected + state.obstaclesDodged
  const accuracy = totalInteractions > 0 ? (state.coffeesCollected / totalInteractions) * 100 : 0

  return {
    finalScore: state.current,
    coffeesCollected: state.coffeesCollected,
    obstaclesDodged: state.obstaclesDodged,
    nearMisses: state.nearMisses,
    maxCombo,
    accuracy: Math.round(accuracy * 10) / 10,
    survivalTime,
  }
}

// ============================================================================
// LEADERBOARD DATA
// ============================================================================

export interface LeaderboardEntry {
  gameMode: GameMode
  difficulty: DifficultyLevel
  score: number
  statistics: GameStatistics
  timestamp: number
}

export function saveLeaderboardEntry(entry: LeaderboardEntry): void {
  if (typeof window === 'undefined') return

  const key = 'codeRunner_leaderboard'
  const stored = localStorage.getItem(key)
  const leaderboard: LeaderboardEntry[] = stored ? JSON.parse(stored) : []

  leaderboard.push(entry)

  // Keep only top 100 entries
  leaderboard.sort((a, b) => b.score - a.score)
  const trimmed = leaderboard.slice(0, 100)

  localStorage.setItem(key, JSON.stringify(trimmed))
}

export function loadLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return []

  const key = 'codeRunner_leaderboard'
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : []
}

export function getTopScores(gameMode: GameMode, limit = 10): LeaderboardEntry[] {
  const leaderboard = loadLeaderboard()
  return leaderboard.filter((entry) => entry.gameMode === gameMode).slice(0, limit)
}

// ============================================================================
// SCORE FORMATTING
// ============================================================================

export function formatScore(score: number): string {
  return score.toLocaleString('en-US')
}

export function formatMultiplier(multiplier: number): string {
  return `${multiplier.toFixed(1)}x`
}

export function getScoreGrade(score: number): { grade: string; color: string } {
  if (score >= 10000) return { grade: 'S', color: '#fbbf24' } // gold
  if (score >= 5000) return { grade: 'A', color: '#60a5fa' } // blue
  if (score >= 2500) return { grade: 'B', color: '#10b981' } // green
  if (score >= 1000) return { grade: 'C', color: '#f59e0b' } // orange
  if (score >= 500) return { grade: 'D', color: '#6b7280' } // gray
  return { grade: 'F', color: '#ef4444' } // red
}
