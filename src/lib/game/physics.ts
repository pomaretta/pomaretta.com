/**
 * Physics Engine
 * Handles player movement, collision detection, and physics calculations
 */

import { GAME_CONSTANTS } from '@/data/game-config'

// ============================================================================
// TYPES
// ============================================================================

export interface Player {
  x: number
  y: number
  width: number
  height: number
  velocityY: number
  velocityX: number
  grounded: boolean
  jumping: boolean
  jumpKeyHeld: boolean // for variable jump height
  coyoteTimer: number // frames remaining for coyote time
  canDoubleJump: boolean
  hasDoubleJumped: boolean
}

export interface PhysicsObject {
  x: number
  y: number
  width: number
  height: number
}

export interface CollisionResult {
  collided: boolean
  nearMiss: boolean // true if within NEAR_MISS_DISTANCE
}

// ============================================================================
// PLAYER INITIALIZATION
// ============================================================================

export function createPlayer(canvasHeight: number): Player {
  const groundY = canvasHeight - GAME_CONSTANTS.GROUND_Y_OFFSET

  return {
    x: GAME_CONSTANTS.PLAYER_X,
    y: groundY - GAME_CONSTANTS.PLAYER_HEIGHT,
    width: GAME_CONSTANTS.PLAYER_WIDTH,
    height: GAME_CONSTANTS.PLAYER_HEIGHT,
    velocityY: 0,
    velocityX: 0,
    grounded: true,
    jumping: false,
    jumpKeyHeld: false,
    coyoteTimer: 0,
    canDoubleJump: GAME_CONSTANTS.DOUBLE_JUMP_ENABLED,
    hasDoubleJumped: false,
  }
}

// ============================================================================
// PHYSICS UPDATE
// ============================================================================

export function updatePlayerPhysics(
  player: Player,
  gravity: number,
  groundY: number,
  reverseGravity = false
): Player {
  const updatedPlayer = { ...player }
  const effectiveGravity = reverseGravity ? -gravity : gravity

  // Apply gravity
  updatedPlayer.velocityY += effectiveGravity
  updatedPlayer.y += updatedPlayer.velocityY

  // Update coyote timer
  if (!updatedPlayer.grounded && updatedPlayer.coyoteTimer > 0) {
    updatedPlayer.coyoteTimer--
  }

  // Ground collision (normal gravity)
  if (!reverseGravity) {
    if (updatedPlayer.y + updatedPlayer.height >= groundY) {
      updatedPlayer.y = groundY - updatedPlayer.height
      updatedPlayer.velocityY = 0
      updatedPlayer.grounded = true
      updatedPlayer.jumping = false
      updatedPlayer.coyoteTimer = GAME_CONSTANTS.COYOTE_TIME_FRAMES
      updatedPlayer.hasDoubleJumped = false
    } else {
      // In air
      if (updatedPlayer.grounded) {
        updatedPlayer.coyoteTimer = GAME_CONSTANTS.COYOTE_TIME_FRAMES
      }
      updatedPlayer.grounded = false
    }
  } else {
    // Reverse gravity - player sticks to ceiling
    const ceiling = 0
    if (updatedPlayer.y <= ceiling) {
      updatedPlayer.y = ceiling
      updatedPlayer.velocityY = 0
      updatedPlayer.grounded = true
      updatedPlayer.jumping = false
      updatedPlayer.coyoteTimer = GAME_CONSTANTS.COYOTE_TIME_FRAMES
      updatedPlayer.hasDoubleJumped = false
    } else {
      if (updatedPlayer.grounded) {
        updatedPlayer.coyoteTimer = GAME_CONSTANTS.COYOTE_TIME_FRAMES
      }
      updatedPlayer.grounded = false
    }
  }

  return updatedPlayer
}

// ============================================================================
// JUMP MECHANICS
// ============================================================================

export function initiateJump(
  player: Player,
  jumpForce: number,
  reverseGravity = false
): Player {
  const updatedPlayer = { ...player }
  const effectiveJumpForce = reverseGravity ? -jumpForce : jumpForce

  // Can jump if:
  // 1. Grounded
  // 2. Within coyote time window
  // 3. Has double jump available
  const canJump =
    updatedPlayer.grounded ||
    updatedPlayer.coyoteTimer > 0 ||
    (updatedPlayer.canDoubleJump && !updatedPlayer.hasDoubleJumped && !updatedPlayer.grounded)

  if (canJump) {
    // Check if this is a double jump
    if (!updatedPlayer.grounded && updatedPlayer.coyoteTimer <= 0) {
      updatedPlayer.hasDoubleJumped = true
    }

    updatedPlayer.velocityY = effectiveJumpForce
    updatedPlayer.jumping = true
    updatedPlayer.jumpKeyHeld = true
    updatedPlayer.grounded = false
    updatedPlayer.coyoteTimer = 0

    return updatedPlayer
  }

  return player // No change
}

export function releaseJump(player: Player): Player {
  const updatedPlayer = { ...player }
  updatedPlayer.jumpKeyHeld = false

  // Variable jump height: if released early, reduce upward velocity
  if (updatedPlayer.jumping && updatedPlayer.velocityY < 0) {
    updatedPlayer.velocityY *= GAME_CONSTANTS.VARIABLE_JUMP_MIN_HEIGHT
  }

  return updatedPlayer
}

// ============================================================================
// COLLISION DETECTION
// ============================================================================

export function checkCollision(
  player: Player,
  object: PhysicsObject
): CollisionResult {
  // Standard AABB collision
  const collided =
    player.x < object.x + object.width &&
    player.x + player.width > object.x &&
    player.y < object.y + object.height &&
    player.y + player.height > object.y

  // Near miss detection: check if player is close but not colliding
  const nearMiss = !collided && isNearMiss(player, object)

  return { collided, nearMiss }
}

export function isNearMiss(player: Player, object: PhysicsObject): boolean {
  // Calculate distance from player to object
  const playerCenterX = player.x + player.width / 2
  const playerCenterY = player.y + player.height / 2
  const objectCenterX = object.x + object.width / 2
  const objectCenterY = object.y + object.height / 2

  const distance = Math.sqrt(
    Math.pow(playerCenterX - objectCenterX, 2) +
      Math.pow(playerCenterY - objectCenterY, 2)
  )

  // Near miss if within threshold distance
  return distance < GAME_CONSTANTS.NEAR_MISS_DISTANCE + (player.width + object.width) / 2
}

// ============================================================================
// MAGNETISM (for Magnet power-up)
// ============================================================================

export function applyMagnetism(
  object: PhysicsObject,
  player: Player,
  magnetRange: number,
  magnetStrength: number
): PhysicsObject {
  const objectCenterX = object.x + object.width / 2
  const objectCenterY = object.y + object.height / 2
  const playerCenterX = player.x + player.width / 2
  const playerCenterY = player.y + player.height / 2

  const dx = playerCenterX - objectCenterX
  const dy = playerCenterY - objectCenterY
  const distance = Math.sqrt(dx * dx + dy * dy)

  // Only apply magnetism if within range
  if (distance < magnetRange && distance > 0) {
    const force = magnetStrength / distance
    const updatedObject = { ...object }

    updatedObject.x += (dx / distance) * force
    updatedObject.y += (dy / distance) * force

    return updatedObject
  }

  return object
}

// ============================================================================
// BOUNDS CHECKING
// ============================================================================

export function isOffScreen(
  object: PhysicsObject,
  canvasWidth: number,
  canvasHeight: number,
  margin = 50
): boolean {
  return (
    object.x + object.width < -margin ||
    object.x > canvasWidth + margin ||
    object.y + object.height < -margin ||
    object.y > canvasHeight + margin
  )
}

export function clampPosition(
  object: PhysicsObject,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
): PhysicsObject {
  return {
    ...object,
    x: Math.max(minX, Math.min(maxX - object.width, object.x)),
    y: Math.max(minY, Math.min(maxY - object.height, object.y)),
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getGroundY(canvasHeight: number): number {
  return canvasHeight - GAME_CONSTANTS.GROUND_Y_OFFSET
}

export function getRandomY(minY: number, maxY: number): number {
  return Math.random() * (maxY - minY) + minY
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

// Easing function for smooth animations
export function easeOutQuad(t: number): number {
  return t * (2 - t)
}

export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}
