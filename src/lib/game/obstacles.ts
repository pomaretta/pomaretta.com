/**
 * Obstacle System
 * Manages obstacle and collectible spawning, movement, and types
 */

import { OBSTACLE_CONFIGS, ObstacleType, GAME_CONSTANTS } from '@/data/game-config'
import { PhysicsObject } from './physics'

// ============================================================================
// TYPES
// ============================================================================

export interface Obstacle extends PhysicsObject {
  type: ObstacleType
  passed: boolean // true when player has passed this obstacle
  nearMissAwarded: boolean // true if near-miss points were already given
}

export interface Coffee extends PhysicsObject {
  collected: boolean
}

export interface ObstacleState {
  obstacles: Obstacle[]
  coffees: Coffee[]
  obstacleTimer: number
  coffeeTimer: number
}

// ============================================================================
// OBSTACLE CREATION
// ============================================================================

export function createObstacle(
  canvasWidth: number,
  groundY: number,
  type?: ObstacleType
): Obstacle {
  // Random type if not specified
  const obstacleType =
    type ||
    (Object.keys(OBSTACLE_CONFIGS)[
      Math.floor(Math.random() * Object.keys(OBSTACLE_CONFIGS).length)
    ] as ObstacleType)

  return {
    x: canvasWidth,
    y: groundY - GAME_CONSTANTS.OBSTACLE_Y_OFFSET,
    width: GAME_CONSTANTS.OBSTACLE_WIDTH,
    height: GAME_CONSTANTS.OBSTACLE_HEIGHT,
    type: obstacleType,
    passed: false,
    nearMissAwarded: false,
  }
}

export function createCoffee(canvasWidth: number, groundY: number): Coffee {
  const { min, max } = GAME_CONSTANTS.COFFEE_Y_RANGE
  const y = groundY - min - Math.random() * (max - min)

  return {
    x: canvasWidth,
    y,
    width: GAME_CONSTANTS.COFFEE_WIDTH,
    height: GAME_CONSTANTS.COFFEE_HEIGHT,
    collected: false,
  }
}

export function initializeObstacleState(): ObstacleState {
  return {
    obstacles: [],
    coffees: [],
    obstacleTimer: 0,
    coffeeTimer: 0,
  }
}

// ============================================================================
// SPAWNING LOGIC
// ============================================================================

export function updateObstacleSpawning(
  state: ObstacleState,
  canvasWidth: number,
  groundY: number,
  obstacleFrequency: number,
  currentScore: number
): ObstacleState {
  const newState = { ...state }
  newState.obstacleTimer++

  // Dynamic frequency based on score (gets harder over time)
  const adjustedFrequency = Math.max(
    obstacleFrequency - Math.floor(currentScore / 100) * 5,
    30 // minimum frequency
  )

  // Spawn new obstacle
  if (newState.obstacleTimer >= adjustedFrequency) {
    const obstacle = createObstacle(canvasWidth, groundY)
    newState.obstacles.push(obstacle)
    newState.obstacleTimer = 0
  }

  return newState
}

export function updateCoffeeSpawning(
  state: ObstacleState,
  canvasWidth: number,
  groundY: number,
  coffeeFrequency: number
): ObstacleState {
  const newState = { ...state }
  newState.coffeeTimer++

  // Spawn new coffee
  if (newState.coffeeTimer >= coffeeFrequency) {
    const coffee = createCoffee(canvasWidth, groundY)
    newState.coffees.push(coffee)
    newState.coffeeTimer = 0
  }

  return newState
}

// ============================================================================
// MOVEMENT
// ============================================================================

export function updateObstaclePositions(
  obstacles: Obstacle[],
  gameSpeed: number,
  playerX: number
): Obstacle[] {
  return obstacles
    .map((obstacle) => {
      const updated = {
        ...obstacle,
        x: obstacle.x - gameSpeed,
      }

      // Mark as passed if player has gone past it
      if (!updated.passed && updated.x + updated.width < playerX) {
        updated.passed = true
      }

      return updated
    })
    .filter((obstacle) => obstacle.x + obstacle.width > -50) // Remove off-screen
}

export function updateCoffeePositions(
  coffees: Coffee[],
  gameSpeed: number
): Coffee[] {
  return coffees
    .map((coffee) => ({
      ...coffee,
      x: coffee.x - gameSpeed,
    }))
    .filter((coffee) => coffee.x + coffee.width > -50) // Remove off-screen
}

// ============================================================================
// SPECIAL SPAWNING PATTERNS
// ============================================================================

// Bug Storm (Chaos Mode) - spawn multiple obstacles rapidly
export function spawnBugStorm(
  state: ObstacleState,
  canvasWidth: number,
  groundY: number
): ObstacleState {
  const newState = { ...state }

  // Spawn 5-8 obstacles in quick succession
  const count = 5 + Math.floor(Math.random() * 4)
  for (let i = 0; i < count; i++) {
    const obstacle = createObstacle(canvasWidth + i * 80, groundY, 'bug')
    newState.obstacles.push(obstacle)
  }

  return newState
}

// Coffee Rain (Chaos Mode) - spawn many coffees
export function spawnCoffeeRain(
  state: ObstacleState,
  canvasWidth: number,
  groundY: number
): ObstacleState {
  const newState = { ...state }

  // Spawn 8-12 coffees at various heights
  const count = 8 + Math.floor(Math.random() * 5)
  for (let i = 0; i < count; i++) {
    const coffee = createCoffee(canvasWidth + i * 60, groundY)
    newState.coffees.push(coffee)
  }

  return newState
}

// Obstacle pattern for Debug Challenge missions
export function spawnObstaclePattern(
  state: ObstacleState,
  canvasWidth: number,
  groundY: number,
  pattern: 'single' | 'double' | 'triple' | 'wave'
): ObstacleState {
  const newState = { ...state }

  switch (pattern) {
    case 'single':
      newState.obstacles.push(createObstacle(canvasWidth, groundY))
      break

    case 'double':
      newState.obstacles.push(createObstacle(canvasWidth, groundY))
      newState.obstacles.push(createObstacle(canvasWidth + 150, groundY))
      break

    case 'triple':
      newState.obstacles.push(createObstacle(canvasWidth, groundY))
      newState.obstacles.push(createObstacle(canvasWidth + 100, groundY))
      newState.obstacles.push(createObstacle(canvasWidth + 200, groundY))
      break

    case 'wave':
      // Alternating high and low obstacles
      for (let i = 0; i < 4; i++) {
        const obstacle = createObstacle(canvasWidth + i * 120, groundY)
        // Vary height slightly
        obstacle.y = groundY - GAME_CONSTANTS.OBSTACLE_Y_OFFSET - (i % 2) * 20
        newState.obstacles.push(obstacle)
      }
      break
  }

  return newState
}

// ============================================================================
// OBSTACLE RENDERING DATA
// ============================================================================

export interface ObstacleRenderData {
  x: number
  y: number
  width: number
  height: number
  icon: string
  color: string
  type: ObstacleType
  opacity?: number // for invisible obstacles in chaos mode
}

export function getObstacleRenderData(
  obstacle: Obstacle,
  invisibleMode = false,
  frameCount = 0
): ObstacleRenderData {
  const config = OBSTACLE_CONFIGS[obstacle.type]

  let opacity = 1.0
  if (invisibleMode) {
    // Fade in and out
    opacity = 0.3 + 0.7 * Math.abs(Math.sin(frameCount * 0.05))
  }

  return {
    x: obstacle.x,
    y: obstacle.y,
    width: obstacle.width,
    height: obstacle.height,
    icon: config.icon,
    color: config.color,
    type: obstacle.type,
    opacity,
  }
}

export interface CoffeeRenderData {
  x: number
  y: number
  width: number
  height: number
  icon: string
  color: string
  bobOffset?: number // for floating animation
}

export function getCoffeeRenderData(
  coffee: Coffee,
  frameCount = 0
): CoffeeRenderData {
  // Floating animation
  const bobOffset = Math.sin(frameCount * 0.1 + coffee.x * 0.01) * 3

  return {
    x: coffee.x,
    y: coffee.y,
    width: coffee.width,
    height: coffee.height,
    icon: '☕',
    color: GAME_CONSTANTS.COLORS.coffee,
    bobOffset,
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getObstaclePoints(obstacleType: ObstacleType): number {
  return OBSTACLE_CONFIGS[obstacleType].points
}

export function countPassedObstacles(obstacles: Obstacle[]): number {
  return obstacles.filter((o) => o.passed).length
}

export function countCollectedCoffees(coffees: Coffee[]): number {
  return coffees.filter((c) => c.collected).length
}

// Get the closest obstacle to the player (for AI or difficulty adjustment)
export function getClosestObstacle(
  obstacles: Obstacle[],
  playerX: number
): Obstacle | null {
  const upcomingObstacles = obstacles.filter((o) => o.x > playerX - 50)

  if (upcomingObstacles.length === 0) return null

  return upcomingObstacles.reduce((closest, current) =>
    current.x < closest.x ? current : closest
  )
}

// Check if player should jump based on obstacle proximity (for tutorial hints)
export function shouldShowJumpHint(
  obstacles: Obstacle[],
  playerX: number,
  hintDistance = 150
): boolean {
  const closest = getClosestObstacle(obstacles, playerX)
  if (!closest) return false

  const distance = closest.x - playerX
  return distance > 0 && distance < hintDistance
}

// ============================================================================
// CHAOS MODE HELPERS
// ============================================================================

export function applyReverseGravityToObstacles(
  obstacles: Obstacle[],
  groundY: number,
  canvasHeight: number
): Obstacle[] {
  // Flip obstacles to ceiling
  return obstacles.map((obstacle) => ({
    ...obstacle,
    y: canvasHeight - groundY + GAME_CONSTANTS.OBSTACLE_Y_OFFSET,
  }))
}

export function randomizeObstacleHeights(
  obstacles: Obstacle[],
  groundY: number
): Obstacle[] {
  return obstacles.map((obstacle) => ({
    ...obstacle,
    y: groundY - GAME_CONSTANTS.OBSTACLE_Y_OFFSET - Math.random() * 40,
  }))
}
