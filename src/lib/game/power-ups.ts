/**
 * Power-Up System
 * Manages power-up spawning, collection, and active effects
 */

import { POWERUP_CONFIGS, PowerUpType, GAME_CONSTANTS } from '@/data/game-config'
import { PhysicsObject } from './physics'

// ============================================================================
// TYPES
// ============================================================================

export interface PowerUp extends PhysicsObject {
  type: PowerUpType
  collected: boolean
}

export interface ActivePowerUp {
  type: PowerUpType
  remainingFrames: number
  active: boolean
}

export interface PowerUpState {
  spawned: PowerUp[]
  active: ActivePowerUp[]
  spawnTimer: number
}

// ============================================================================
// POWER-UP CREATION
// ============================================================================

export function createPowerUp(
  canvasWidth: number,
  groundY: number,
  type?: PowerUpType
): PowerUp {
  // Random type if not specified
  const powerUpType =
    type || (Object.keys(POWERUP_CONFIGS)[
      Math.floor(Math.random() * Object.keys(POWERUP_CONFIGS).length)
    ] as PowerUpType)

  const { min, max } = GAME_CONSTANTS.POWERUP_Y_RANGE
  const y = groundY - min - Math.random() * (max - min)

  return {
    x: canvasWidth,
    y,
    width: GAME_CONSTANTS.POWERUP_WIDTH,
    height: GAME_CONSTANTS.POWERUP_HEIGHT,
    type: powerUpType,
    collected: false,
  }
}

export function initializePowerUpState(): PowerUpState {
  return {
    spawned: [],
    active: [],
    spawnTimer: 0,
  }
}

// ============================================================================
// POWER-UP SPAWNING
// ============================================================================

export function updatePowerUpSpawning(
  state: PowerUpState,
  canvasWidth: number,
  groundY: number,
  spawnFrequency: number
): PowerUpState {
  const newState = { ...state }
  newState.spawnTimer++

  // Spawn new power-up
  if (newState.spawnTimer >= spawnFrequency) {
    const powerUp = createPowerUp(canvasWidth, groundY)
    newState.spawned.push(powerUp)
    newState.spawnTimer = 0
  }

  return newState
}

// ============================================================================
// POWER-UP MOVEMENT
// ============================================================================

export function updatePowerUpPositions(
  powerUps: PowerUp[],
  gameSpeed: number,
  canvasWidth: number
): PowerUp[] {
  return powerUps
    .map((powerUp) => ({
      ...powerUp,
      x: powerUp.x - gameSpeed,
    }))
    .filter((powerUp) => powerUp.x + powerUp.width > 0) // Remove off-screen
}

// ============================================================================
// POWER-UP COLLECTION
// ============================================================================

export function collectPowerUp(
  powerUp: PowerUp,
  activeState: ActivePowerUp[]
): { powerUp: PowerUp; activeState: ActivePowerUp[] } {
  const config = POWERUP_CONFIGS[powerUp.type]

  // Mark as collected
  const updatedPowerUp = { ...powerUp, collected: true }

  // Check if this power-up is already active
  const existingIndex = activeState.findIndex((p) => p.type === powerUp.type)

  let updatedActiveState: ActivePowerUp[]

  if (existingIndex >= 0) {
    // Reset duration if already active
    updatedActiveState = activeState.map((p, i) =>
      i === existingIndex
        ? { ...p, remainingFrames: config.duration }
        : p
    )
  } else {
    // Add new active power-up
    updatedActiveState = [
      ...activeState,
      {
        type: powerUp.type,
        remainingFrames: config.duration,
        active: true,
      },
    ]
  }

  return { powerUp: updatedPowerUp, activeState: updatedActiveState }
}

// ============================================================================
// ACTIVE POWER-UP MANAGEMENT
// ============================================================================

export function updateActivePowerUps(
  activePowerUps: ActivePowerUp[]
): ActivePowerUp[] {
  return activePowerUps
    .map((powerUp) => ({
      ...powerUp,
      remainingFrames: powerUp.remainingFrames - 1,
    }))
    .filter((powerUp) => powerUp.remainingFrames > 0) // Remove expired
}

export function hasPowerUp(
  activePowerUps: ActivePowerUp[],
  type: PowerUpType
): boolean {
  return activePowerUps.some((p) => p.type === type && p.active)
}

export function getRemainingFrames(
  activePowerUps: ActivePowerUp[],
  type: PowerUpType
): number {
  const powerUp = activePowerUps.find((p) => p.type === type)
  return powerUp ? powerUp.remainingFrames : 0
}

// ============================================================================
// POWER-UP EFFECTS
// ============================================================================

export interface PowerUpEffects {
  hasShield: boolean
  hasMagnet: boolean
  hasSpeedBoost: boolean
  hasSlowMo: boolean
  hasGhost: boolean
  speedMultiplier: number
  magnetRange: number
  magnetStrength: number
}

export function calculatePowerUpEffects(
  activePowerUps: ActivePowerUp[]
): PowerUpEffects {
  const effects: PowerUpEffects = {
    hasShield: hasPowerUp(activePowerUps, 'shield'),
    hasMagnet: hasPowerUp(activePowerUps, 'magnet'),
    hasSpeedBoost: hasPowerUp(activePowerUps, 'speedBoost'),
    hasSlowMo: hasPowerUp(activePowerUps, 'slowMo'),
    hasGhost: hasPowerUp(activePowerUps, 'ghost'),
    speedMultiplier: 1.0,
    magnetRange: 0,
    magnetStrength: 0,
  }

  // Speed modifications
  if (effects.hasSpeedBoost) {
    effects.speedMultiplier = 1.5
  }
  if (effects.hasSlowMo) {
    effects.speedMultiplier = 0.5
  }

  // Magnet properties
  if (effects.hasMagnet) {
    effects.magnetRange = 150
    effects.magnetStrength = 8
  }

  return effects
}

// ============================================================================
// SHIELD HANDLING
// ============================================================================

export function consumeShield(activePowerUps: ActivePowerUp[]): ActivePowerUp[] {
  // Remove shield after it absorbs a hit
  return activePowerUps.filter((p) => p.type !== 'shield')
}

// ============================================================================
// POWER-UP RENDERING DATA
// ============================================================================

export interface PowerUpRenderData {
  x: number
  y: number
  width: number
  height: number
  icon: string
  color: string
  type: PowerUpType
}

export function getPowerUpRenderData(powerUp: PowerUp): PowerUpRenderData {
  const config = POWERUP_CONFIGS[powerUp.type]

  return {
    x: powerUp.x,
    y: powerUp.y,
    width: powerUp.width,
    height: powerUp.height,
    icon: config.icon,
    color: config.color,
    type: powerUp.type,
  }
}

// ============================================================================
// ACTIVE POWER-UP UI DATA
// ============================================================================

export interface ActivePowerUpUIData {
  type: PowerUpType
  name: string
  icon: string
  color: string
  remainingFrames: number
  percentRemaining: number
}

export function getActivePowerUpUIData(
  activePowerUps: ActivePowerUp[]
): ActivePowerUpUIData[] {
  return activePowerUps.map((powerUp) => {
    const config = POWERUP_CONFIGS[powerUp.type]
    return {
      type: powerUp.type,
      name: config.name,
      icon: config.icon,
      color: config.color,
      remainingFrames: powerUp.remainingFrames,
      percentRemaining: (powerUp.remainingFrames / config.duration) * 100,
    }
  })
}

// ============================================================================
// SPECIAL POWER-UP SPAWNING
// ============================================================================

// For sprint mode - spawn time freeze power-ups
export function spawnTimeFreezeIfNeeded(
  state: PowerUpState,
  canvasWidth: number,
  groundY: number,
  sprintModeActive: boolean
): PowerUpState {
  if (!sprintModeActive) return state

  const newState = { ...state }

  // In sprint mode, occasionally spawn time-freeze (as slowMo power-up)
  if (Math.random() < 0.02) {
    // 2% chance per frame
    const timeFreezeAsSlowMo = createPowerUp(canvasWidth, groundY, 'slowMo')
    newState.spawned.push(timeFreezeAsSlowMo)
  }

  return newState
}

// For chaos mode - random power-up bursts
export function spawnChaosModePowerUps(
  state: PowerUpState,
  canvasWidth: number,
  groundY: number
): PowerUpState {
  const newState = { ...state }

  // Spawn 3-5 random power-ups at once
  const count = 3 + Math.floor(Math.random() * 3)
  for (let i = 0; i < count; i++) {
    const powerUp = createPowerUp(canvasWidth + i * 100, groundY)
    newState.spawned.push(powerUp)
  }

  return newState
}
