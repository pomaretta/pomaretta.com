/**
 * Game Engine
 * Core game loop and state management for Code Runner
 */

import { GAME_CONSTANTS, DifficultyLevel, DIFFICULTY_CONFIGS, GameMode } from '@/data/game-config'
import {
  Player,
  createPlayer,
  updatePlayerPhysics,
  initiateJump,
  releaseJump,
  checkCollision,
  getGroundY,
  applyMagnetism,
} from './physics'
import {
  PowerUpState,
  initializePowerUpState,
  updatePowerUpSpawning,
  updatePowerUpPositions,
  collectPowerUp,
  updateActivePowerUps,
  calculatePowerUpEffects,
  consumeShield,
  spawnTimeFreezeIfNeeded,
  spawnChaosModePowerUps,
} from './power-ups'
import {
  ObstacleState,
  initializeObstacleState,
  updateObstacleSpawning,
  updateCoffeeSpawning,
  updateObstaclePositions,
  updateCoffeePositions,
  spawnBugStorm,
  spawnCoffeeRain,
  getObstaclePoints,
} from './obstacles'
import {
  ScoreState,
  ScoreEvent,
  initializeScoreState,
  addPassiveScore,
  addCoffeeScore,
  addObstacleScore,
  addNearMissScore,
  updateComboTimer,
  resetCombo,
  checkAndUpdateHighScore,
  calculateStatistics,
  GameStatistics,
} from './scoring'
import {
  GameModeState,
  initializeClassicMode,
  updateClassicMode,
  getClassicSpeedMultiplier,
  initializeSprintMode,
  updateSprintMode,
  activateTimeFreeze,
  isSprintTimeUp,
  initializeDebugMode,
  updateDebugMission,
  advanceToNextMission,
  isAllMissionsCompleted,
  initializeChaosMode,
  updateChaosMode,
  getChaosEventEffects,
  isGameModeComplete,
} from './game-modes'

// ============================================================================
// GAME STATE
// ============================================================================

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver' | 'complete'

export interface GameState {
  status: GameStatus
  gameMode: GameMode
  difficulty: DifficultyLevel
  frameCount: number
  gameSpeed: number
  baseSpeed: number
  maxSpeed: number

  // Entity states
  player: Player
  obstacles: ObstacleState
  powerUps: PowerUpState
  score: ScoreState
  modeState: GameModeState

  // Game events
  recentEvents: ScoreEvent[]
  maxComboReached: number

  // Canvas context
  canvasWidth: number
  canvasHeight: number
  groundY: number
}

// ============================================================================
// INITIALIZATION
// ============================================================================

export function createGameState(
  gameMode: GameMode,
  difficulty: DifficultyLevel,
  canvasWidth = GAME_CONSTANTS.CANVAS_WIDTH,
  canvasHeight = GAME_CONSTANTS.CANVAS_HEIGHT
): GameState {
  const config = DIFFICULTY_CONFIGS[difficulty]
  const groundY = getGroundY(canvasHeight)

  // Initialize mode-specific state
  let modeState: GameModeState
  switch (gameMode) {
    case 'classic':
      modeState = initializeClassicMode()
      break
    case 'sprint':
      modeState = initializeSprintMode()
      break
    case 'debug':
      modeState = initializeDebugMode()
      break
    case 'chaos':
      modeState = initializeChaosMode()
      break
    default:
      modeState = initializeClassicMode()
  }

  return {
    status: 'idle',
    gameMode,
    difficulty,
    frameCount: 0,
    gameSpeed: config.baseSpeed,
    baseSpeed: config.baseSpeed,
    maxSpeed: config.maxSpeed,

    player: createPlayer(canvasHeight),
    obstacles: initializeObstacleState(),
    powerUps: initializePowerUpState(),
    score: initializeScoreState(gameMode),
    modeState,

    recentEvents: [],
    maxComboReached: 0,

    canvasWidth,
    canvasHeight,
    groundY,
  }
}

// ============================================================================
// CORE UPDATE LOOP
// ============================================================================

export function updateGameState(state: GameState): GameState {
  if (state.status !== 'playing') {
    return state
  }

  let newState = { ...state }

  // Increment frame count
  newState.frameCount++

  // Get difficulty config
  const difficultyConfig = DIFFICULTY_CONFIGS[newState.difficulty]

  // Update mode-specific state
  newState = updateModeState(newState)

  // Check if mode objectives are complete
  if (isGameModeComplete(newState.modeState, newState.frameCount)) {
    newState.status = 'complete'
    return finalizeGame(newState)
  }

  // Calculate effective game speed
  const effectiveGameSpeed = calculateEffectiveSpeed(newState)
  newState.gameSpeed = effectiveGameSpeed

  // Update power-ups
  newState.powerUps.active = updateActivePowerUps(newState.powerUps.active)
  const powerUpEffects = calculatePowerUpEffects(newState.powerUps.active)

  // Apply speed multiplier from power-ups
  newState.gameSpeed *= powerUpEffects.speedMultiplier

  // Get chaos mode effects
  const chaosEffects =
    newState.gameMode === 'chaos' && newState.modeState.mode === 'chaos'
      ? getChaosEventEffects(newState.modeState)
      : null

  // Apply chaos mode speed multiplier
  if (chaosEffects?.doubleSpeed) {
    newState.gameSpeed *= chaosEffects.speedMultiplier
  }

  // Update player physics
  const reverseGravity = chaosEffects?.reverseGravity || false
  newState.player = updatePlayerPhysics(
    newState.player,
    difficultyConfig.gravity,
    newState.groundY,
    reverseGravity
  )

  // Update obstacles
  newState.obstacles = updateObstacleSpawning(
    newState.obstacles,
    newState.canvasWidth,
    newState.groundY,
    difficultyConfig.obstacleFrequency,
    newState.score.current
  )

  newState.obstacles.obstacles = updateObstaclePositions(
    newState.obstacles.obstacles,
    newState.gameSpeed,
    newState.player.x
  )

  // Update coffees
  newState.obstacles = updateCoffeeSpawning(
    newState.obstacles,
    newState.canvasWidth,
    newState.groundY,
    difficultyConfig.coffeeFrequency
  )

  newState.obstacles.coffees = updateCoffeePositions(
    newState.obstacles.coffees,
    newState.gameSpeed
  )

  // Apply magnetism to coffees if magnet power-up is active
  if (powerUpEffects.hasMagnet) {
    newState.obstacles.coffees = newState.obstacles.coffees.map((coffee) => {
      if (!coffee.collected) {
        return applyMagnetism(
          coffee,
          newState.player,
          powerUpEffects.magnetRange,
          powerUpEffects.magnetStrength
        ) as typeof coffee
      }
      return coffee
    })
  }

  // Update power-up spawning
  newState.powerUps = updatePowerUpSpawning(
    newState.powerUps,
    newState.canvasWidth,
    newState.groundY,
    difficultyConfig.powerUpFrequency
  )

  // Sprint mode: spawn time freeze power-ups
  if (newState.gameMode === 'sprint') {
    newState.powerUps = spawnTimeFreezeIfNeeded(
      newState.powerUps,
      newState.canvasWidth,
      newState.groundY,
      true
    )
  }

  // Chaos mode: handle special events
  if (chaosEffects) {
    if (chaosEffects.bugStorm) {
      // Spawn obstacles more frequently
      if (newState.frameCount % 20 === 0) {
        newState.obstacles = spawnBugStorm(
          newState.obstacles,
          newState.canvasWidth,
          newState.groundY
        )
      }
    }

    if (chaosEffects.coffeeRain) {
      // Spawn coffees more frequently
      if (newState.frameCount % 30 === 0) {
        newState.obstacles = spawnCoffeeRain(
          newState.obstacles,
          newState.canvasWidth,
          newState.groundY
        )
      }
    }
  }

  newState.powerUps.spawned = updatePowerUpPositions(
    newState.powerUps.spawned,
    newState.gameSpeed,
    newState.canvasWidth
  )

  // Collision detection
  newState = checkCollisions(newState, powerUpEffects, difficultyConfig)

  // Update score
  newState.score = addPassiveScore(newState.score, newState.difficulty, difficultyConfig)
  newState.score = updateComboTimer(newState.score)

  // Track max combo
  if (newState.score.combo > newState.maxComboReached) {
    newState.maxComboReached = newState.score.combo
  }

  // Progressive difficulty (for Classic mode)
  if (
    newState.gameMode === 'classic' &&
    newState.frameCount % GAME_CONSTANTS.SPEED_INCREASE_INTERVAL === 0
  ) {
    newState.baseSpeed = Math.min(
      newState.baseSpeed + GAME_CONSTANTS.SPEED_INCREASE_AMOUNT,
      newState.maxSpeed
    )
  }

  // Remove old events (keep only last 5 seconds)
  const maxEventAge = GAME_CONSTANTS.TARGET_FPS * 5
  newState.recentEvents = newState.recentEvents.filter(
    (_, index) => index < maxEventAge
  )

  return newState
}

// ============================================================================
// MODE STATE UPDATES
// ============================================================================

function updateModeState(state: GameState): GameState {
  const newState = { ...state }

  switch (newState.modeState.mode) {
    case 'classic':
      newState.modeState = updateClassicMode(newState.modeState, newState.frameCount)
      break

    case 'sprint':
      newState.modeState = updateSprintMode(newState.modeState)
      break

    case 'debug':
      // Mission progress is updated in collision detection
      break

    case 'chaos':
      newState.modeState = updateChaosMode(newState.modeState)
      break
  }

  return newState
}

// ============================================================================
// SPEED CALCULATION
// ============================================================================

function calculateEffectiveSpeed(state: GameState): number {
  let speed = state.baseSpeed

  // Classic mode speed multiplier
  if (state.modeState.mode === 'classic') {
    speed *= getClassicSpeedMultiplier(state.modeState)
  }

  // Cap at max speed
  return Math.min(speed, state.maxSpeed)
}

// ============================================================================
// COLLISION DETECTION
// ============================================================================

function checkCollisions(
  state: GameState,
  powerUpEffects: ReturnType<typeof calculatePowerUpEffects>,
  difficultyConfig: typeof DIFFICULTY_CONFIGS[DifficultyLevel]
): GameState {
  let newState = { ...state }

  // Check obstacle collisions
  for (const obstacle of newState.obstacles.obstacles) {
    const result = checkCollision(newState.player, obstacle)

    // Near miss
    if (result.nearMiss && !obstacle.nearMissAwarded && obstacle.passed) {
      obstacle.nearMissAwarded = true
      const { state: scoreState, event } = addNearMissScore(
        newState.score,
        difficultyConfig
      )
      newState.score = scoreState
      newState.recentEvents.unshift(event)

      // Debug mode: track near misses
      if (newState.modeState.mode === 'debug') {
        newState.modeState = updateDebugMission(
          newState.modeState,
          'nearMiss',
          newState.score.nearMisses
        )
      }
    }

    // Obstacle passed
    if (!obstacle.passed && obstacle.x + obstacle.width < newState.player.x) {
      obstacle.passed = true
      const points = getObstaclePoints(obstacle.type)
      const { state: scoreState, event } = addObstacleScore(
        newState.score,
        points,
        difficultyConfig
      )
      newState.score = scoreState
      newState.recentEvents.unshift(event)
    }

    // Collision
    if (result.collided) {
      // Check if protected by ghost mode
      if (powerUpEffects.hasGhost) {
        // Pass through obstacle
        continue
      }

      // Check if protected by shield
      if (powerUpEffects.hasShield) {
        // Consume shield and continue
        newState.powerUps.active = consumeShield(newState.powerUps.active)
        newState.score = resetCombo(newState.score)
        continue
      }

      // Game over
      newState.status = 'gameOver'
      return finalizeGame(newState)
    }
  }

  // Check coffee collection
  for (const coffee of newState.obstacles.coffees) {
    if (coffee.collected) continue

    const result = checkCollision(newState.player, coffee)

    if (result.collided) {
      coffee.collected = true
      const { state: scoreState, event } = addCoffeeScore(
        newState.score,
        newState.difficulty,
        difficultyConfig
      )
      newState.score = scoreState
      newState.recentEvents.unshift(event)

      // Debug mode: track coffee collection
      if (newState.modeState.mode === 'debug') {
        newState.modeState = updateDebugMission(
          newState.modeState,
          'coffee',
          newState.score.coffeesCollected
        )

        // Check if mission completed and advance
        if (
          newState.modeState.currentMission.completed &&
          !isAllMissionsCompleted(newState.modeState)
        ) {
          newState.modeState = advanceToNextMission(newState.modeState)
        }
      }
    }
  }

  // Check power-up collection
  for (const powerUp of newState.powerUps.spawned) {
    if (powerUp.collected) continue

    const result = checkCollision(newState.player, powerUp)

    if (result.collided) {
      const { powerUp: updatedPowerUp, activeState } = collectPowerUp(
        powerUp,
        newState.powerUps.active
      )

      // Update power-up
      Object.assign(powerUp, updatedPowerUp)
      newState.powerUps.active = activeState

      // Sprint mode: activate time freeze if slow-mo collected
      if (
        newState.gameMode === 'sprint' &&
        newState.modeState.mode === 'sprint' &&
        powerUp.type === 'slowMo'
      ) {
        newState.modeState = activateTimeFreeze(newState.modeState)
      }
    }
  }

  return newState
}

// ============================================================================
// PLAYER ACTIONS
// ============================================================================

export function handleJump(state: GameState): GameState {
  if (state.status !== 'playing') {
    return state
  }

  const difficultyConfig = DIFFICULTY_CONFIGS[state.difficulty]
  const chaosEffects =
    state.gameMode === 'chaos' && state.modeState.mode === 'chaos'
      ? getChaosEventEffects(state.modeState)
      : null

  const reverseGravity = chaosEffects?.reverseGravity || false

  return {
    ...state,
    player: initiateJump(state.player, difficultyConfig.jumpForce, reverseGravity),
  }
}

export function handleJumpRelease(state: GameState): GameState {
  if (state.status !== 'playing') {
    return state
  }

  return {
    ...state,
    player: releaseJump(state.player),
  }
}

// ============================================================================
// GAME LIFECYCLE
// ============================================================================

export function startGame(state: GameState): GameState {
  return {
    ...state,
    status: 'playing',
  }
}

export function pauseGame(state: GameState): GameState {
  if (state.status !== 'playing') {
    return state
  }

  return {
    ...state,
    status: 'paused',
  }
}

export function resumeGame(state: GameState): GameState {
  if (state.status !== 'paused') {
    return state
  }

  return {
    ...state,
    status: 'playing',
  }
}

export function resetGame(state: GameState): GameState {
  return createGameState(
    state.gameMode,
    state.difficulty,
    state.canvasWidth,
    state.canvasHeight
  )
}

function finalizeGame(state: GameState): GameState {
  const newState = { ...state }

  // Check and update high score
  const { state: scoreState, isNewHighScore } = checkAndUpdateHighScore(
    newState.score,
    newState.gameMode
  )
  newState.score = scoreState

  return newState
}

// ============================================================================
// GAME DATA EXPORTS
// ============================================================================

export function getGameStatistics(state: GameState): GameStatistics {
  return calculateStatistics(state.score, state.frameCount, state.maxComboReached)
}

export function isNewHighScore(state: GameState): boolean {
  return state.score.current === state.score.highScore && state.score.current > 0
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getFramesPerSecond(): number {
  return GAME_CONSTANTS.TARGET_FPS
}

export function framesToSeconds(frames: number): number {
  return frames / GAME_CONSTANTS.TARGET_FPS
}

export function secondsToFrames(seconds: number): number {
  return seconds * GAME_CONSTANTS.TARGET_FPS
}
