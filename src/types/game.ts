/**
 * Game Types
 *
 * Defines all types related to games, scores, leaderboards, and game sessions.
 * Supports multiple game modes and difficulty levels.
 */

/**
 * Available game modes - Code Runner jumping game
 */
export type GameMode = 'classic' | 'sprint' | 'debug' | 'chaos';

/**
 * Difficulty levels for games
 */
export type GameDifficulty = 'easy' | 'normal' | 'hard' | 'expert';

/**
 * Game status
 */
export type GameStatus = 'not_started' | 'playing' | 'paused' | 'completed' | 'failed';

/**
 * Base game configuration
 */
export interface GameConfig {
  mode: GameMode;
  difficulty: GameDifficulty;
  duration?: number; // in seconds
  maxAttempts?: number;
  customSettings?: Record<string, unknown>;
}

/**
 * Game session - represents a single game play instance
 */
export interface GameSession {
  id: string;
  userId: string;
  gameMode: GameMode;
  difficulty: GameDifficulty;
  status: GameStatus;
  score: number;
  startedAt: Date;
  completedAt?: Date;
  duration: number; // in seconds
  moves?: number;
  accuracy?: number; // percentage
  metadata: GameMetadata;
}

/**
 * Game metadata - mode-specific data
 */
export interface GameMetadata {
  // Typing test specific
  wpm?: number; // words per minute
  charactersTyped?: number;
  errors?: number;

  // Memory cards specific
  pairsFound?: number;
  totalPairs?: number;
  moves?: number;

  // Code quiz specific
  questionsAnswered?: number;
  correctAnswers?: number;
  totalQuestions?: number;

  // Reaction time specific
  averageReactionTime?: number; // in milliseconds
  fastestReaction?: number;
  slowestReaction?: number;
  attempts?: number;

  // Common fields
  hintsUsed?: number;
  powerUpsUsed?: string[];
  achievements?: string[];
}

/**
 * Game score - stored result of a completed game
 */
export interface GameScore {
  id: string;
  userId: string;
  username: string;
  gameMode: GameMode;
  difficulty: GameDifficulty;
  score: number;
  maxScore: number;
  percentage: number;
  completedAt: Date;
  duration: number; // in seconds
  metadata: GameMetadata;
  isVerified: boolean; // for authenticated users
  syncedToServer: boolean; // whether synced to backend
}

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  gameMode: GameMode;
  difficulty: GameDifficulty;
  completedAt: Date;
  isCurrentUser: boolean;
  isVerified: boolean;
  metadata?: Partial<GameMetadata>;
}

/**
 * Leaderboard filter options
 */
export interface LeaderboardFilter {
  gameMode?: GameMode;
  difficulty?: GameDifficulty;
  timeRange?: LeaderboardTimeRange;
  limit?: number;
  offset?: number;
}

/**
 * Time range for leaderboard filtering
 */
export type LeaderboardTimeRange = 'today' | 'week' | 'month' | 'year' | 'all-time';

/**
 * Leaderboard response
 */
export interface Leaderboard {
  entries: LeaderboardEntry[];
  totalEntries: number;
  currentUserEntry?: LeaderboardEntry;
  filter: LeaderboardFilter;
  updatedAt: Date;
}

/**
 * Personal best scores for a user
 */
export interface PersonalBests {
  userId: string;
  bests: Record<GameMode, Record<GameDifficulty, GameScore>>;
  updatedAt: Date;
}

/**
 * Game statistics for a specific mode
 */
export interface GameStats {
  gameMode: GameMode;
  totalGames: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  totalPlayTime: number; // in seconds
  averagePlayTime: number; // in seconds
  lastPlayedAt?: Date;
  byDifficulty: Record<GameDifficulty, DifficultyStats>;
}

/**
 * Statistics per difficulty level
 */
export interface DifficultyStats {
  difficulty: GameDifficulty;
  gamesPlayed: number;
  averageScore: number;
  bestScore: number;
  totalPlayTime: number;
  lastPlayedAt?: Date;
}

/**
 * Game event for analytics
 */
export interface GameEvent {
  id: string;
  sessionId: string;
  userId: string;
  gameMode: GameMode;
  eventType: GameEventType;
  timestamp: Date;
  data?: Record<string, unknown>;
}

/**
 * Game event types for tracking
 */
export type GameEventType =
  | 'game_started'
  | 'game_paused'
  | 'game_resumed'
  | 'game_completed'
  | 'game_failed'
  | 'score_achieved'
  | 'achievement_unlocked'
  | 'hint_used'
  | 'powerup_used';

/**
 * Score validation result
 */
export interface ScoreValidation {
  isValid: boolean;
  score: number;
  expectedRange: [number, number];
  anomalies: string[];
  confidence: number; // 0-1
}

/**
 * Helper to calculate score percentage
 */
export function calculateScorePercentage(score: number, maxScore: number): number {
  if (maxScore === 0) return 0;
  return Math.round((score / maxScore) * 100);
}

/**
 * Helper to format game duration
 */
export function formatGameDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Helper to get difficulty color
 */
export function getDifficultyColor(difficulty: GameDifficulty): string {
  const colors: Record<GameDifficulty, string> = {
    easy: 'text-green-500',
    normal: 'text-yellow-500',
    hard: 'text-orange-500',
    expert: 'text-red-500',
  };
  return colors[difficulty];
}

/**
 * Helper to get game mode display name
 */
export function getGameModeName(mode: GameMode): string {
  const names: Record<GameMode, string> = {
    classic: 'Classic Mode',
    sprint: 'Sprint Mode',
    debug: 'Debug Challenge',
    chaos: 'Chaos Mode',
  };
  return names[mode];
}

/**
 * Helper to validate score for a game mode
 */
export function validateScore(
  gameMode: GameMode,
  difficulty: GameDifficulty,
  score: number,
  duration: number
): ScoreValidation {
  // Define expected score ranges per mode and difficulty
  const ranges: Record<GameMode, Record<GameDifficulty, [number, number]>> = {
    classic: {
      easy: [0, 2000],
      normal: [0, 5000],
      hard: [0, 10000],
      expert: [0, 20000],
    },
    sprint: {
      easy: [0, 1500],
      normal: [0, 3000],
      hard: [0, 6000],
      expert: [0, 12000],
    },
    debug: {
      easy: [0, 1000],
      normal: [0, 2500],
      hard: [0, 5000],
      expert: [0, 10000],
    },
    chaos: {
      easy: [0, 3000],
      normal: [0, 7000],
      hard: [0, 15000],
      expert: [0, 30000],
    },
  };

  const expectedRange = ranges[gameMode][difficulty];
  const [minScore, maxScore] = expectedRange;
  const anomalies: string[] = [];

  // Check if score is within expected range
  if (score < minScore || score > maxScore) {
    anomalies.push(`Score ${score} outside expected range [${minScore}, ${maxScore}]`);
  }

  // Check for suspiciously short duration for high scores
  if (duration < 10 && score > maxScore * 0.8) {
    anomalies.push('High score achieved in unusually short time');
  }

  // Check for suspiciously long duration
  if (duration > 3600) {
    anomalies.push('Game duration exceeds 1 hour');
  }

  const isValid = anomalies.length === 0;
  const confidence = isValid ? 1.0 : Math.max(0.1, 1.0 - anomalies.length * 0.3);

  return {
    isValid,
    score,
    expectedRange,
    anomalies,
    confidence,
  };
}

/**
 * Daily Challenges Types
 */

export type ChallengeType = 'score' | 'collect' | 'survive' | 'complete' | 'avoid';

export interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD format
  type: ChallengeType;
  mode?: GameMode;
  difficulty?: GameDifficulty;
  target: number; // Target value to achieve
  description: {
    en: string;
    es: string;
  };
  name: {
    en: string;
    es: string;
  };
  reward: {
    points: number;
    badge?: string;
    unlock?: string;
  };
  templateDifficulty: 'easy' | 'medium' | 'hard' | 'expert';
  // User progress (stored separately)
  progress?: number; // 0-100%
  completed?: boolean;
  attempts?: number;
  completedAt?: string;
}

export interface ChallengeProgress {
  current: number; // Current progress value (score, coffees, seconds, etc.)
  target: number; // Target value to reach
  percentage: number; // 0-100
}

export interface ChallengeStreak {
  current: number; // Current consecutive days
  longest: number; // Longest streak ever
  lastCompletedDate: string; // YYYY-MM-DD
}

export interface ChallengeHistoryEntry {
  date: string;
  challengeId: string;
  completed: boolean;
  score: number;
  completedAt?: string;
}

export interface ChallengeStats {
  totalCompleted: number;
  completionRate: number; // percentage
  totalRewardsEarned: number;
  currentStreak: number;
  longestStreak: number;
  lastWeekCompleted: number; // out of 7
}
