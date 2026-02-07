/**
 * Game Modes
 * Mode-specific logic and state for Classic, Sprint, Debug Challenge, and Chaos modes
 */

import {
  GameMode,
  GAME_CONSTANTS,
  ChaosEventType,
  CHAOS_EVENTS,
} from '@/data/game-config'

// ============================================================================
// TYPES
// ============================================================================

export interface ClassicModeState {
  mode: 'classic'
  speedLevel: number // increases over time
}

export interface SprintModeState {
  mode: 'sprint'
  timeRemaining: number // frames
  timeFreezesUsed: number
  timeFrozen: boolean
  freezeFramesRemaining: number
}

export interface DebugMission {
  id: string
  goal: string
  target: number
  progress: number
  completed: boolean
}

export interface DebugModeState {
  mode: 'debug'
  currentMission: DebugMission
  missionsCompleted: number
}

export interface ChaosEvent {
  type: ChaosEventType
  name: string
  active: boolean
  framesRemaining: number
}

export interface ChaosModeState {
  mode: 'chaos'
  currentEvent: ChaosEvent | null
  eventTimer: number // frames until next event
  eventsTriggered: number
}

export type GameModeState =
  | ClassicModeState
  | SprintModeState
  | DebugModeState
  | ChaosModeState

// ============================================================================
// CLASSIC MODE
// ============================================================================

export function initializeClassicMode(): ClassicModeState {
  return {
    mode: 'classic',
    speedLevel: 1,
  }
}

export function updateClassicMode(
  state: ClassicModeState,
  frameCount: number
): ClassicModeState {
  const newState = { ...state }

  // Increase speed level every 600 frames (10 seconds)
  if (frameCount > 0 && frameCount % 600 === 0) {
    newState.speedLevel++
  }

  return newState
}

export function getClassicSpeedMultiplier(state: ClassicModeState): number {
  // Speed increases by 10% per level, capped at 2x
  return Math.min(1.0 + state.speedLevel * 0.1, 2.0)
}

// ============================================================================
// SPRINT MODE
// ============================================================================

export function initializeSprintMode(): SprintModeState {
  return {
    mode: 'sprint',
    timeRemaining: GAME_CONSTANTS.SPRINT_DURATION * GAME_CONSTANTS.TARGET_FPS,
    timeFreezesUsed: 0,
    timeFrozen: false,
    freezeFramesRemaining: 0,
  }
}

export function updateSprintMode(state: SprintModeState): SprintModeState {
  const newState = { ...state }

  // Handle time freeze
  if (newState.timeFrozen) {
    newState.freezeFramesRemaining--

    if (newState.freezeFramesRemaining <= 0) {
      newState.timeFrozen = false
    }

    // Don't decrease time remaining while frozen
    return newState
  }

  // Decrease time remaining
  if (newState.timeRemaining > 0) {
    newState.timeRemaining--
  }

  return newState
}

export function activateTimeFreeze(state: SprintModeState): SprintModeState {
  return {
    ...state,
    timeFrozen: true,
    freezeFramesRemaining: GAME_CONSTANTS.TIME_FREEZE_DURATION,
    timeFreezesUsed: state.timeFreezesUsed + 1,
  }
}

export function getSprintTimeRemaining(state: SprintModeState): {
  seconds: number
  frames: number
} {
  return {
    seconds: Math.ceil(state.timeRemaining / GAME_CONSTANTS.TARGET_FPS),
    frames: state.timeRemaining,
  }
}

export function isSprintTimeUp(state: SprintModeState): boolean {
  return state.timeRemaining <= 0
}

// ============================================================================
// DEBUG CHALLENGE MODE
// ============================================================================

export function initializeDebugMode(): DebugModeState {
  const missions = GAME_CONSTANTS.DEBUG_MISSIONS

  // Start with first mission
  const firstMission = missions[0]

  return {
    mode: 'debug',
    currentMission: {
      id: firstMission.id,
      goal: firstMission.goal,
      target: firstMission.target,
      progress: 0,
      completed: false,
    },
    missionsCompleted: 0,
  }
}

export function updateDebugMission(
  state: DebugModeState,
  missionType: 'coffee' | 'time' | 'speed' | 'combo' | 'nearMiss',
  value: number
): DebugModeState {
  const newState = { ...state }

  // Update progress based on mission type
  const missionId = newState.currentMission.id

  if (
    (missionId === 'coffee-collector' && missionType === 'coffee') ||
    (missionId === 'survivor' && missionType === 'time') ||
    (missionId === 'speedster' && missionType === 'speed') ||
    (missionId === 'combo-master' && missionType === 'combo') ||
    (missionId === 'near-miss-expert' && missionType === 'nearMiss')
  ) {
    newState.currentMission.progress = value

    // Check if mission is completed
    if (
      !newState.currentMission.completed &&
      newState.currentMission.progress >= newState.currentMission.target
    ) {
      newState.currentMission.completed = true
      newState.missionsCompleted++
    }
  }

  return newState
}

export function advanceToNextMission(state: DebugModeState): DebugModeState {
  const missions = GAME_CONSTANTS.DEBUG_MISSIONS
  const currentIndex = missions.findIndex((m) => m.id === state.currentMission.id)

  // Check if there's a next mission
  if (currentIndex < missions.length - 1) {
    const nextMission = missions[currentIndex + 1]

    return {
      ...state,
      currentMission: {
        id: nextMission.id,
        goal: nextMission.goal,
        target: nextMission.target,
        progress: 0,
        completed: false,
      },
    }
  }

  // No more missions - return same state
  return state
}

export function isAllMissionsCompleted(state: DebugModeState): boolean {
  return state.missionsCompleted >= GAME_CONSTANTS.DEBUG_MISSIONS.length
}

export function getMissionProgress(state: DebugModeState): number {
  // Return progress as percentage (0-100)
  const { progress, target } = state.currentMission
  return Math.min((progress / target) * 100, 100)
}

// ============================================================================
// CHAOS MODE
// ============================================================================

export function initializeChaosMode(): ChaosModeState {
  const { min, max } = GAME_CONSTANTS.CHAOS_EVENT_INTERVAL

  return {
    mode: 'chaos',
    currentEvent: null,
    eventTimer: Math.floor(Math.random() * (max - min) + min),
    eventsTriggered: 0,
  }
}

export function updateChaosMode(state: ChaosModeState): ChaosModeState {
  const newState = { ...state }

  // Update active event
  if (newState.currentEvent && newState.currentEvent.active) {
    newState.currentEvent.framesRemaining--

    // Deactivate event if expired
    if (newState.currentEvent.framesRemaining <= 0) {
      newState.currentEvent = null
    }
  }

  // Check if it's time to trigger new event
  if (!newState.currentEvent || !newState.currentEvent.active) {
    newState.eventTimer--

    if (newState.eventTimer <= 0) {
      // Trigger random event
      newState.currentEvent = triggerRandomChaosEvent()
      newState.eventsTriggered++

      // Reset timer for next event
      const { min, max } = GAME_CONSTANTS.CHAOS_EVENT_INTERVAL
      newState.eventTimer = Math.floor(Math.random() * (max - min) + min)
    }
  }

  return newState
}

function triggerRandomChaosEvent(): ChaosEvent {
  const eventTypes = Object.keys(CHAOS_EVENTS) as ChaosEventType[]
  const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
  const config = CHAOS_EVENTS[randomType]

  return {
    type: randomType,
    name: config.name,
    active: true,
    framesRemaining: config.duration,
  }
}

export function getChaosEventEffects(state: ChaosModeState): {
  bugStorm: boolean
  coffeeRain: boolean
  reverseGravity: boolean
  speedWarp: boolean
  invisibleObstacles: boolean
  doubleSpeed: boolean
  speedMultiplier: number
} {
  const event = state.currentEvent

  if (!event || !event.active) {
    return {
      bugStorm: false,
      coffeeRain: false,
      reverseGravity: false,
      speedWarp: false,
      invisibleObstacles: false,
      doubleSpeed: false,
      speedMultiplier: 1.0,
    }
  }

  return {
    bugStorm: event.type === 'bugStorm',
    coffeeRain: event.type === 'coffeeRain',
    reverseGravity: event.type === 'reverseGravity',
    speedWarp: event.type === 'speedWarp',
    invisibleObstacles: event.type === 'invisibleObstacles',
    doubleSpeed: event.type === 'doubleSpeed',
    speedMultiplier: event.type === 'doubleSpeed' ? 2.0 : 1.0,
  }
}

export function getChaosEventProgress(state: ChaosModeState): number {
  if (!state.currentEvent || !state.currentEvent.active) return 0

  const config = CHAOS_EVENTS[state.currentEvent.type]
  return (state.currentEvent.framesRemaining / config.duration) * 100
}

// ============================================================================
// MODE UTILITIES
// ============================================================================

export function isGameModeComplete(state: GameModeState, frameCount: number): boolean {
  switch (state.mode) {
    case 'classic':
      // Classic mode never ends (until game over)
      return false

    case 'sprint':
      return isSprintTimeUp(state)

    case 'debug':
      return isAllMissionsCompleted(state)

    case 'chaos':
      // Chaos mode never ends (until game over)
      return false

    default:
      return false
  }
}

export function getModeDescription(mode: GameMode): string {
  switch (mode) {
    case 'classic':
      return 'Survive as long as possible. Speed increases over time.'
    case 'sprint':
      return 'Score as much as possible in 60 seconds. Collect time-freeze power-ups!'
    case 'debug':
      return 'Complete missions to progress. Each mission unlocks the next.'
    case 'chaos':
      return 'Random events will change the game. Adapt or perish!'
    default:
      return ''
  }
}

export function getModeObjectives(state: GameModeState): string[] {
  switch (state.mode) {
    case 'classic':
      return [
        'Survive as long as possible',
        'Collect coffees for points',
        `Current speed level: ${state.speedLevel}`,
      ]

    case 'sprint':
      const { seconds } = getSprintTimeRemaining(state)
      return [
        `Time remaining: ${seconds}s`,
        'Maximize your score',
        `Time freezes used: ${state.timeFreezesUsed}`,
      ]

    case 'debug':
      return [
        state.currentMission.goal,
        `Progress: ${state.currentMission.progress}/${state.currentMission.target}`,
        `Missions completed: ${state.missionsCompleted}`,
      ]

    case 'chaos':
      const event = state.currentEvent?.active ? state.currentEvent.name : 'No active event'
      return ['Survive chaos events', `Current event: ${event}`, `Events survived: ${state.eventsTriggered}`]

    default:
      return []
  }
}

// ============================================================================
// MODE-SPECIFIC RENDERING INFO
// ============================================================================

export interface ModeUIData {
  title: string
  objectives: string[]
  statusBar: {
    label: string
    value: string | number
    progress?: number // 0-100
  }[]
}

export function getModeUIData(state: GameModeState): ModeUIData {
  switch (state.mode) {
    case 'classic':
      return {
        title: 'Classic Mode',
        objectives: getModeObjectives(state),
        statusBar: [
          {
            label: 'Speed Level',
            value: state.speedLevel,
          },
        ],
      }

    case 'sprint':
      const { seconds } = getSprintTimeRemaining(state)
      return {
        title: 'Sprint Mode',
        objectives: getModeObjectives(state),
        statusBar: [
          {
            label: 'Time',
            value: `${seconds}s`,
            progress: (state.timeRemaining / (GAME_CONSTANTS.SPRINT_DURATION * GAME_CONSTANTS.TARGET_FPS)) * 100,
          },
          {
            label: 'Freezes',
            value: state.timeFreezesUsed,
          },
        ],
      }

    case 'debug':
      return {
        title: 'Debug Challenge',
        objectives: getModeObjectives(state),
        statusBar: [
          {
            label: 'Mission',
            value: state.currentMission.goal,
            progress: getMissionProgress(state),
          },
          {
            label: 'Completed',
            value: state.missionsCompleted,
          },
        ],
      }

    case 'chaos':
      return {
        title: 'Chaos Mode',
        objectives: getModeObjectives(state),
        statusBar: [
          {
            label: 'Event',
            value: state.currentEvent?.name || 'Incoming...',
            progress: state.currentEvent ? getChaosEventProgress(state) : 0,
          },
          {
            label: 'Survived',
            value: state.eventsTriggered,
          },
        ],
      }

    default:
      return {
        title: 'Unknown Mode',
        objectives: [],
        statusBar: [],
      }
  }
}
