/**
 * Game Configuration
 * Central configuration for Code Runner game modes, difficulty levels, and constants
 */

// ============================================================================
// GAME MODES
// ============================================================================

export type GameMode = 'classic' | 'sprint' | 'debug' | 'chaos'

export interface GameModeConfig {
  id: GameMode
  name: string
  description: string
  icon: string
  unlocked: boolean
}

export const GAME_MODES: Record<GameMode, GameModeConfig> = {
  classic: {
    id: 'classic',
    name: 'Classic Mode',
    description: 'Endless runner with progressive difficulty',
    icon: '🎮',
    unlocked: true,
  },
  sprint: {
    id: 'sprint',
    name: 'Sprint Mode',
    description: '60-second time trial with time-freeze power-ups',
    icon: '⚡',
    unlocked: true,
  },
  debug: {
    id: 'debug',
    name: 'Debug Challenge',
    description: 'Mission-based gameplay with specific goals',
    icon: '🐛',
    unlocked: true,
  },
  chaos: {
    id: 'chaos',
    name: 'Chaos Mode',
    description: 'Random events and unpredictable challenges',
    icon: '🌪️',
    unlocked: true,
  },
}

// ============================================================================
// DIFFICULTY LEVELS
// ============================================================================

export type DifficultyLevel = 'easy' | 'normal' | 'hard' | 'expert'

export interface DifficultyConfig {
  level: DifficultyLevel
  name: string
  baseSpeed: number
  maxSpeed: number
  obstacleFrequency: number // frames between obstacles
  gravity: number
  jumpForce: number
  coffeeFrequency: number // frames between coffee spawns
  powerUpFrequency: number // frames between power-up spawns
  scoreMultiplier: number
}

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    level: 'easy',
    name: 'Easy',
    baseSpeed: 5,
    maxSpeed: 8,
    obstacleFrequency: 100,
    gravity: 0.7,
    jumpForce: -14,
    coffeeFrequency: 180,
    powerUpFrequency: 400,
    scoreMultiplier: 1.0,
  },
  normal: {
    level: 'normal',
    name: 'Normal',
    baseSpeed: 6,
    maxSpeed: 10,
    obstacleFrequency: 80,
    gravity: 0.8,
    jumpForce: -15,
    coffeeFrequency: 200,
    powerUpFrequency: 450,
    scoreMultiplier: 1.5,
  },
  hard: {
    level: 'hard',
    name: 'Hard',
    baseSpeed: 7,
    maxSpeed: 12,
    obstacleFrequency: 65,
    gravity: 0.9,
    jumpForce: -16,
    coffeeFrequency: 220,
    powerUpFrequency: 500,
    scoreMultiplier: 2.0,
  },
  expert: {
    level: 'expert',
    name: 'Expert',
    baseSpeed: 8,
    maxSpeed: 15,
    obstacleFrequency: 50,
    gravity: 1.0,
    jumpForce: -17,
    coffeeFrequency: 250,
    powerUpFrequency: 550,
    scoreMultiplier: 3.0,
  },
}

// ============================================================================
// GAME CONSTANTS
// ============================================================================

export const GAME_CONSTANTS = {
  // Canvas dimensions
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 400,

  // Frame rate
  TARGET_FPS: 60,

  // Player dimensions
  PLAYER_WIDTH: 40,
  PLAYER_HEIGHT: 50,
  PLAYER_X: 50,

  // Ground position
  GROUND_Y_OFFSET: 80, // from bottom of canvas

  // Coyote time (grace period after leaving ground)
  COYOTE_TIME_FRAMES: 6,

  // Jump mechanics
  VARIABLE_JUMP_MIN_HEIGHT: 0.4, // minimum jump height if released early
  DOUBLE_JUMP_ENABLED: false, // can be unlocked

  // Obstacle dimensions
  OBSTACLE_WIDTH: 35,
  OBSTACLE_HEIGHT: 35,
  OBSTACLE_Y_OFFSET: 30, // from ground

  // Coffee dimensions
  COFFEE_WIDTH: 30,
  COFFEE_HEIGHT: 30,
  COFFEE_Y_RANGE: { min: 80, max: 130 }, // above ground

  // Power-up dimensions
  POWERUP_WIDTH: 35,
  POWERUP_HEIGHT: 35,
  POWERUP_Y_RANGE: { min: 60, max: 100 }, // above ground

  // Scoring
  POINTS_PER_FRAME: 0.1, // passive points while playing
  COFFEE_POINTS: 10,
  OBSTACLE_DODGE_POINTS: 1, // points for passing an obstacle
  NEAR_MISS_DISTANCE: 20, // pixels for near-miss bonus
  NEAR_MISS_POINTS: 5,

  // Combo system
  COMBO_TIMEOUT: 120, // frames (2 seconds at 60fps)
  COMBO_THRESHOLD: 3, // coffees needed for combo
  COMBO_MULTIPLIER: 2,

  // Sprint mode
  SPRINT_DURATION: 60, // seconds
  TIME_FREEZE_DURATION: 180, // frames (3 seconds)

  // Debug Challenge missions
  DEBUG_MISSIONS: [
    { id: 'coffee-collector', goal: 'Collect 15 coffees', target: 15 },
    { id: 'survivor', goal: 'Survive 60 seconds', target: 60 },
    { id: 'speedster', goal: 'Reach speed level 10', target: 10 },
    { id: 'combo-master', goal: 'Achieve 3x combo', target: 3 },
    { id: 'near-miss-expert', goal: 'Get 10 near-misses', target: 10 },
  ],

  // Chaos mode events
  CHAOS_EVENT_INTERVAL: { min: 300, max: 600 }, // frames between events

  // Speed progression
  SPEED_INCREASE_INTERVAL: 100, // frames
  SPEED_INCREASE_AMOUNT: 0.5,

  // Colors (matching site theme)
  COLORS: {
    player: '#60a5fa', // blue
    bug: '#ef4444', // red
    error: '#f59e0b', // orange
    breaking: '#8b5cf6', // purple
    coffee: '#10b981', // green
    ground: '#4b5563', // gray
    text: '#f3f4f6', // light gray
    background: '#1f2937', // dark gray
    shield: '#3b82f6', // blue
    magnet: '#ec4899', // pink
    speedBoost: '#eab308', // yellow
    slowMo: '#06b6d4', // cyan
    ghost: '#a78bfa', // light purple
  },
}

// ============================================================================
// POWER-UP TYPES
// ============================================================================

export type PowerUpType = 'shield' | 'magnet' | 'speedBoost' | 'slowMo' | 'ghost'

export interface PowerUpConfig {
  type: PowerUpType
  name: string
  icon: string
  duration: number // frames
  color: string
  description: string
}

export const POWERUP_CONFIGS: Record<PowerUpType, PowerUpConfig> = {
  shield: {
    type: 'shield',
    name: 'Shield',
    icon: '🛡️',
    duration: 300, // 5 seconds
    color: GAME_CONSTANTS.COLORS.shield,
    description: 'Protects from one collision',
  },
  magnet: {
    type: 'magnet',
    name: 'Magnet',
    icon: '🧲',
    duration: 360, // 6 seconds
    color: GAME_CONSTANTS.COLORS.magnet,
    description: 'Attracts nearby coffees',
  },
  speedBoost: {
    type: 'speedBoost',
    name: 'Speed Boost',
    icon: '⚡',
    duration: 240, // 4 seconds
    color: GAME_CONSTANTS.COLORS.speedBoost,
    description: 'Increases game speed',
  },
  slowMo: {
    type: 'slowMo',
    name: 'Slow-Mo',
    icon: '⏱️',
    duration: 240, // 4 seconds
    color: GAME_CONSTANTS.COLORS.slowMo,
    description: 'Slows down time',
  },
  ghost: {
    type: 'ghost',
    name: 'Ghost Mode',
    icon: '👻',
    duration: 180, // 3 seconds
    color: GAME_CONSTANTS.COLORS.ghost,
    description: 'Pass through obstacles',
  },
}

// ============================================================================
// OBSTACLE TYPES
// ============================================================================

export type ObstacleType = 'bug' | 'error' | 'breaking'

export interface ObstacleConfig {
  type: ObstacleType
  name: string
  icon: string
  color: string
  points: number // points for dodging
}

export const OBSTACLE_CONFIGS: Record<ObstacleType, ObstacleConfig> = {
  bug: {
    type: 'bug',
    name: 'Bug',
    icon: '🐛',
    color: GAME_CONSTANTS.COLORS.bug,
    points: 1,
  },
  error: {
    type: 'error',
    name: 'Error',
    icon: '⚠️',
    color: GAME_CONSTANTS.COLORS.error,
    points: 2,
  },
  breaking: {
    type: 'breaking',
    name: 'Breaking Change',
    icon: '💥',
    color: GAME_CONSTANTS.COLORS.breaking,
    points: 3,
  },
}

// ============================================================================
// CHAOS MODE EVENTS
// ============================================================================

export type ChaosEventType =
  | 'bugStorm'
  | 'coffeeRain'
  | 'reverseGravity'
  | 'speedWarp'
  | 'invisibleObstacles'
  | 'doubleSpeed'

export interface ChaosEventConfig {
  type: ChaosEventType
  name: string
  description: string
  duration: number // frames
  icon: string
}

export const CHAOS_EVENTS: Record<ChaosEventType, ChaosEventConfig> = {
  bugStorm: {
    type: 'bugStorm',
    name: 'Bug Storm',
    description: 'Obstacles spawn rapidly',
    duration: 300, // 5 seconds
    icon: '🌪️',
  },
  coffeeRain: {
    type: 'coffeeRain',
    name: 'Coffee Rain',
    description: 'Collect falling coffees',
    duration: 360, // 6 seconds
    icon: '☕',
  },
  reverseGravity: {
    type: 'reverseGravity',
    name: 'Reverse Gravity',
    description: 'Gravity is inverted',
    duration: 240, // 4 seconds
    icon: '🔄',
  },
  speedWarp: {
    type: 'speedWarp',
    name: 'Speed Warp',
    description: 'Speed randomly changes',
    duration: 300, // 5 seconds
    icon: '💫',
  },
  invisibleObstacles: {
    type: 'invisibleObstacles',
    name: 'Invisible Obstacles',
    description: 'Obstacles fade in and out',
    duration: 240, // 4 seconds
    icon: '👁️',
  },
  doubleSpeed: {
    type: 'doubleSpeed',
    name: 'Double Speed',
    description: 'Everything moves twice as fast',
    duration: 180, // 3 seconds
    icon: '⚡',
  },
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  HIGH_SCORE_CLASSIC: 'codeRunner_highScore_classic',
  HIGH_SCORE_SPRINT: 'codeRunner_highScore_sprint',
  HIGH_SCORE_DEBUG: 'codeRunner_highScore_debug',
  HIGH_SCORE_CHAOS: 'codeRunner_highScore_chaos',
  SETTINGS: 'codeRunner_settings',
  UNLOCKS: 'codeRunner_unlocks',
}
