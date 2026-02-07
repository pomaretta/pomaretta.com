/**
 * Daily Challenges System
 *
 * Generates and manages daily challenges with deterministic seeding.
 * All users see the same challenge on the same date.
 */

import {
  getTemplateForDate,
  calculateTarget,
} from '@/data/challenge-templates';
import type {
  DailyChallenge,
  ChallengeProgress,
  ChallengeStreak,
  ChallengeHistoryEntry,
  ChallengeStats,
} from '@/types/game';

const STORAGE_KEY_PREFIX = 'challenge:daily:';
const STORAGE_KEY_STREAK = 'challenge:streak';
const STORAGE_KEY_HISTORY = 'challenge:history';

/**
 * Get today's date in YYYY-MM-DD format (UTC)
 */
export function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Generate a deterministic seed from a date string
 */
function generateSeed(date: string): number {
  const [year, month, day] = date.split('-').map(Number);
  // Use prime numbers for better distribution
  return (year * 10007 + month * 479 + day * 31) % 999983;
}

/**
 * Generate today's daily challenge
 * Same challenge for all users on the same date
 */
export function generateDailyChallenge(date: string = getTodayDate()): DailyChallenge {
  const template = getTemplateForDate(date);
  const seed = generateSeed(date);
  const target = calculateTarget(template, seed);

  const challenge: DailyChallenge = {
    id: `daily_${date}`,
    date,
    type: template.type,
    target,
    name: template.name,
    description: {
      en: template.description.en(target),
      es: template.description.es(target),
    },
    reward: {
      points: template.rewardPoints,
      badge: template.badge,
      unlock: template.unlock,
    },
    templateDifficulty: template.difficulty,
  };

  return challenge;
}

/**
 * Get today's challenge with user progress
 */
export function getTodayChallenge(): DailyChallenge {
  const today = getTodayDate();
  const challenge = generateDailyChallenge(today);

  // Load user progress from localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${today}`);
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        challenge.progress = progress.progress || 0;
        challenge.completed = progress.completed || false;
        challenge.attempts = progress.attempts || 0;
        challenge.completedAt = progress.completedAt;
      } catch (e) {
        console.error('Failed to load challenge progress:', e);
      }
    }
  }

  return challenge;
}

/**
 * Update challenge progress
 */
export function updateChallengeProgress(
  challenge: DailyChallenge,
  current: number,
  completed: boolean = false
): void {
  if (typeof window === 'undefined') return;

  const progress = {
    progress: Math.min(100, (current / challenge.target) * 100),
    current,
    completed: completed || current >= challenge.target,
    attempts: (challenge.attempts || 0) + 1,
    completedAt: completed || current >= challenge.target ? new Date().toISOString() : undefined,
  };

  localStorage.setItem(`${STORAGE_KEY_PREFIX}${challenge.date}`, JSON.stringify(progress));

  // Update streak if completed
  if (progress.completed && !challenge.completed) {
    updateStreak(challenge.date);
    addToHistory(challenge, progress.current);
  }
}

/**
 * Calculate current progress
 */
export function calculateProgress(challenge: DailyChallenge, current: number): ChallengeProgress {
  return {
    current,
    target: challenge.target,
    percentage: Math.min(100, (current / challenge.target) * 100),
  };
}

/**
 * Check if challenge is completed
 */
export function isChallengeCompleted(challenge: DailyChallenge, current: number): boolean {
  return current >= challenge.target;
}

/**
 * Get streak information
 */
export function getStreak(): ChallengeStreak {
  if (typeof window === 'undefined') {
    return { current: 0, longest: 0, lastCompletedDate: '' };
  }

  const saved = localStorage.getItem(STORAGE_KEY_STREAK);
  if (!saved) {
    return { current: 0, longest: 0, lastCompletedDate: '' };
  }

  try {
    return JSON.parse(saved);
  } catch (e) {
    return { current: 0, longest: 0, lastCompletedDate: '' };
  }
}

/**
 * Update streak when challenge is completed
 */
function updateStreak(completedDate: string): void {
  const streak = getStreak();
  const yesterday = new Date(completedDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (streak.lastCompletedDate === yesterdayStr) {
    // Continuing streak
    streak.current += 1;
  } else if (streak.lastCompletedDate === completedDate) {
    // Already completed today, no change
    return;
  } else {
    // Streak broken, start new one
    streak.current = 1;
  }

  streak.longest = Math.max(streak.longest, streak.current);
  streak.lastCompletedDate = completedDate;

  localStorage.setItem(STORAGE_KEY_STREAK, JSON.stringify(streak));
}

/**
 * Get challenge history
 */
export function getChallengeHistory(): ChallengeHistoryEntry[] {
  if (typeof window === 'undefined') return [];

  const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
}

/**
 * Add challenge to history
 */
function addToHistory(challenge: DailyChallenge, score: number): void {
  const history = getChallengeHistory();

  // Remove existing entry for this date if any
  const filtered = history.filter((entry) => entry.date !== challenge.date);

  // Add new entry
  filtered.push({
    date: challenge.date,
    challengeId: challenge.id,
    completed: true,
    score,
    completedAt: new Date().toISOString(),
  });

  // Keep only last 30 days
  const sorted = filtered.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);

  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(sorted));
}

/**
 * Get completion statistics
 */
export function getChallengeStats(): ChallengeStats {
  const history = getChallengeHistory();
  const streak = getStreak();

  const totalCompleted = history.filter((entry) => entry.completed).length;
  const completionRate = history.length > 0 ? (totalCompleted / history.length) * 100 : 0;

  // Calculate total rewards earned (estimate based on history)
  const totalRewardsEarned = history.filter((entry) => entry.completed).length * 250; // Average reward

  // Last 7 days completion
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastWeekStr = lastWeek.toISOString().split('T')[0];

  const lastWeekCompleted = history.filter(
    (entry) => entry.completed && entry.date >= lastWeekStr
  ).length;

  return {
    totalCompleted,
    completionRate,
    totalRewardsEarned,
    currentStreak: streak.current,
    longestStreak: streak.longest,
    lastWeekCompleted,
  };
}

/**
 * Motivational messages based on progress
 */
export function getMotivationalMessage(progress: ChallengeProgress, locale: 'en' | 'es'): string {
  const percentage = progress.percentage;

  const messages = {
    en: {
      start: ['You got this!', 'Let\'s do this!', 'Ready to code!'],
      quarter: ['Great start!', 'Keep it up!', 'You\'re doing great!'],
      half: ['Halfway there!', 'Almost there!', 'Don\'t give up!'],
      threeQuarter: ['So close!', 'Almost done!', 'You can do it!'],
      nearComplete: ['One more push!', 'Almost there!', 'Finish strong!'],
    },
    es: {
      start: ['¡Tú puedes!', '¡Vamos a por ello!', '¡Listo para programar!'],
      quarter: ['¡Buen comienzo!', '¡Sigue así!', '¡Lo estás haciendo genial!'],
      half: ['¡A mitad de camino!', '¡Ya casi!', '¡No te rindas!'],
      threeQuarter: ['¡Muy cerca!', '¡Casi terminado!', '¡Tú puedes!'],
      nearComplete: ['¡Un empujón más!', '¡Ya casi!', '¡Termina fuerte!'],
    },
  };

  const localeMessages = messages[locale];
  let categoryMessages: string[];

  if (percentage < 25) {
    categoryMessages = localeMessages.start;
  } else if (percentage < 50) {
    categoryMessages = localeMessages.quarter;
  } else if (percentage < 75) {
    categoryMessages = localeMessages.half;
  } else if (percentage < 95) {
    categoryMessages = localeMessages.threeQuarter;
  } else {
    categoryMessages = localeMessages.nearComplete;
  }

  return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
}

/**
 * Get encouragement message for near completion
 */
export function getNearCompletionMessage(
  progress: ChallengeProgress,
  locale: 'en' | 'es'
): string | null {
  const remaining = progress.target - progress.current;

  if (remaining <= 0) return null;
  if (progress.percentage < 80) return null;

  if (locale === 'en') {
    return `Only ${remaining} more to go!`;
  } else {
    return `¡Solo ${remaining} más!`;
  }
}

/**
 * Get failure recovery message
 */
export function getFailureMessage(attempts: number, locale: 'en' | 'es'): string {
  const messages = {
    en: [
      'So close! Try again?',
      'You can do it!',
      'Don\'t give up!',
      'One more time!',
      'Almost had it!',
    ],
    es: [
      '¡Tan cerca! ¿Intentas de nuevo?',
      '¡Tú puedes!',
      '¡No te rindas!',
      '¡Una vez más!',
      '¡Casi lo tenías!',
    ],
  };

  const localeMessages = messages[locale];
  return localeMessages[attempts % localeMessages.length];
}

/**
 * Get streak celebration message
 */
export function getStreakMessage(streak: number, locale: 'en' | 'es'): string | null {
  if (streak < 2) return null;

  if (locale === 'en') {
    if (streak >= 7) return `🔥 ${streak} Day Streak! On fire!`;
    if (streak >= 3) return `⭐ ${streak} Day Streak! Keep it up!`;
    return `🎯 ${streak} Day Streak!`;
  } else {
    if (streak >= 7) return `🔥 ¡${streak} Días Seguidos! ¡Imparable!`;
    if (streak >= 3) return `⭐ ¡${streak} Días Seguidos! ¡Sigue así!`;
    return `🎯 ¡${streak} Días Seguidos!`;
  }
}
