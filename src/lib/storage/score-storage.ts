/**
 * Score Storage Manager
 *
 * High-level API for managing game scores, personal bests, and leaderboard data.
 * Handles automatic fallback to Vercel Blob Storage when localStorage quota is exceeded.
 */

import type {
  GameScore,
  PersonalBests,
  GameMode,
  GameDifficulty,
  LeaderboardFilter,
  Leaderboard,
  LeaderboardEntry,
  GameStats,
  DifficultyStats,
} from '@/types/game';
import { storage } from './local-storage';
import { blobStorage } from './blob-storage';

/**
 * Score storage options
 */
export interface ScoreStorageOptions {
  useBlobStorage?: boolean; // Force use of Blob Storage
  autoSync?: boolean; // Auto-sync with server (future feature)
}

/**
 * Score query options
 */
export interface ScoreQueryOptions {
  gameMode?: GameMode;
  difficulty?: GameDifficulty;
  userId?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'score' | 'date' | 'duration';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Score Storage Manager
 * Manages game scores with automatic fallback to Blob Storage
 */
export class ScoreStorageManager {
  private static instance: ScoreStorageManager;
  private useBlobStorage = false;

  private constructor() {
    this.initialize();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ScoreStorageManager {
    if (!ScoreStorageManager.instance) {
      ScoreStorageManager.instance = new ScoreStorageManager();
    }
    return ScoreStorageManager.instance;
  }

  /**
   * Initialize storage
   */
  private initialize(): void {
    // Check if localStorage is available
    if (!storage.isStorageAvailable()) {
      console.warn('[ScoreStorage] localStorage not available, using Blob Storage');
      this.useBlobStorage = true;
    }

    // Check localStorage quota
    const storageInfo = storage.getStorageInfo();
    if (storageInfo.percentage > 80) {
      console.warn(
        `[ScoreStorage] localStorage usage at ${storageInfo.percentage.toFixed(1)}%, switching to Blob Storage`
      );
      this.useBlobStorage = true;
    }

    // Check if Blob Storage is available
    if (this.useBlobStorage && !blobStorage.isAvailable()) {
      console.warn('[ScoreStorage] Blob Storage not configured, falling back to localStorage only');
      this.useBlobStorage = false;
    }
  }

  /**
   * Save a game score
   */
  public async saveScore(score: GameScore): Promise<boolean> {
    try {
      // Get existing scores
      const existingScores = await this.getAllScores();

      // Add new score
      const updatedScores = [...existingScores, score];

      // Sort by date (newest first)
      updatedScores.sort(
        (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );

      // Keep only last 100 scores to prevent storage bloat
      const scoresToKeep = updatedScores.slice(0, 100);

      // Save to storage
      if (this.useBlobStorage) {
        await blobStorage.saveScore(score);
      } else {
        const result = storage.setItem('game:scores', scoresToKeep);
        if (!result.success) {
          // If localStorage fails, fallback to Blob Storage
          console.warn('[ScoreStorage] localStorage failed, falling back to Blob Storage');
          this.useBlobStorage = true;
          await blobStorage.saveScore(score);
        }
      }

      // Update personal bests
      await this.updatePersonalBests(score);

      return true;
    } catch (error) {
      console.error('[ScoreStorage] Failed to save score:', error);
      return false;
    }
  }

  /**
   * Get all scores
   */
  public async getAllScores(options?: ScoreQueryOptions): Promise<GameScore[]> {
    try {
      let scores: GameScore[];

      if (this.useBlobStorage) {
        // Blob storage requires userId
        if (options?.userId) {
          scores = await blobStorage.getAllScores(options.userId);
        } else {
          console.warn('[ScoreStorage] Blob storage requires userId, returning empty array');
          scores = [];
        }
      } else {
        const result = storage.getItem('game:scores');
        scores = result.success && result.data ? result.data : [];
      }

      // Apply filters
      if (options) {
        scores = this.filterScores(scores, options);
      }

      return scores;
    } catch (error) {
      console.error('[ScoreStorage] Failed to get scores:', error);
      return [];
    }
  }

  /**
   * Filter scores based on query options
   */
  private filterScores(scores: GameScore[], options: ScoreQueryOptions): GameScore[] {
    let filtered = [...scores];

    // Filter by game mode
    if (options.gameMode) {
      filtered = filtered.filter(score => score.gameMode === options.gameMode);
    }

    // Filter by difficulty
    if (options.difficulty) {
      filtered = filtered.filter(score => score.difficulty === options.difficulty);
    }

    // Filter by user ID
    if (options.userId) {
      filtered = filtered.filter(score => score.userId === options.userId);
    }

    // Sort
    const sortBy = options.sortBy || 'date';
    const sortOrder = options.sortOrder || 'desc';

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'score':
          comparison = a.score - b.score;
          break;
        case 'date':
          comparison =
            new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Apply pagination
    if (options.offset !== undefined) {
      filtered = filtered.slice(options.offset);
    }
    if (options.limit !== undefined) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }

  /**
   * Get scores for a specific game mode
   */
  public async getScoresByMode(gameMode: GameMode): Promise<GameScore[]> {
    return this.getAllScores({ gameMode });
  }

  /**
   * Get top scores for a game mode and difficulty
   */
  public async getTopScores(
    gameMode: GameMode,
    difficulty: GameDifficulty,
    limit = 10
  ): Promise<GameScore[]> {
    return this.getAllScores({
      gameMode,
      difficulty,
      sortBy: 'score',
      sortOrder: 'desc',
      limit,
    });
  }

  /**
   * Update personal bests
   */
  private async updatePersonalBests(score: GameScore): Promise<void> {
    try {
      const personalBests = await this.getPersonalBests(score.userId);

      const currentBest =
        personalBests.bests[score.gameMode]?.[score.difficulty];

      // Update if this is a new best score
      if (!currentBest || score.score > currentBest.score) {
        if (!personalBests.bests[score.gameMode]) {
          personalBests.bests[score.gameMode] = {} as Record<
            GameDifficulty,
            GameScore
          >;
        }
        personalBests.bests[score.gameMode][score.difficulty] = score;
        personalBests.updatedAt = new Date();

        // Save updated personal bests
        if (this.useBlobStorage) {
          await blobStorage.savePersonalBests(personalBests);
        } else {
          storage.setItem('game:personal_bests', personalBests);
        }
      }
    } catch (error) {
      console.error('[ScoreStorage] Failed to update personal bests:', error);
    }
  }

  /**
   * Get personal bests for a user
   */
  public async getPersonalBests(userId: string): Promise<PersonalBests> {
    try {
      let personalBests: PersonalBests;

      if (this.useBlobStorage) {
        const dbBests = await blobStorage.getPersonalBests(userId);
        personalBests = dbBests || this.createEmptyPersonalBests(userId);
      } else {
        const result = storage.getItem('game:personal_bests');
        if (result.success && result.data) {
          personalBests = result.data;
        } else {
          personalBests = this.createEmptyPersonalBests(userId);
        }
      }

      return personalBests;
    } catch (error) {
      console.error('[ScoreStorage] Failed to get personal bests:', error);
      return this.createEmptyPersonalBests(userId);
    }
  }

  /**
   * Create empty personal bests structure
   */
  private createEmptyPersonalBests(userId: string): PersonalBests {
    return {
      userId,
      bests: {
        'classic': {} as Record<GameDifficulty, GameScore>,
        'sprint': {} as Record<GameDifficulty, GameScore>,
        'debug': {} as Record<GameDifficulty, GameScore>,
        'chaos': {} as Record<GameDifficulty, GameScore>,
      },
      updatedAt: new Date(),
    };
  }

  /**
   * Get game statistics for a user
   */
  public async getGameStats(
    userId: string,
    gameMode: GameMode
  ): Promise<GameStats> {
    try {
      const scores = await this.getAllScores({ gameMode, userId });

      if (scores.length === 0) {
        return this.createEmptyGameStats(gameMode);
      }

      const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
      const totalPlayTime = scores.reduce((sum, score) => sum + score.duration, 0);
      const sortedScores = [...scores].sort((a, b) => b.score - a.score);

      // Calculate stats by difficulty
      const byDifficulty: Record<GameDifficulty, DifficultyStats> = {
        easy: this.calculateDifficultyStats('easy', scores),
        normal: this.calculateDifficultyStats('normal', scores),
        hard: this.calculateDifficultyStats('hard', scores),
        expert: this.calculateDifficultyStats('expert', scores),
      };

      return {
        gameMode,
        totalGames: scores.length,
        totalScore,
        averageScore: totalScore / scores.length,
        bestScore: sortedScores[0].score,
        worstScore: sortedScores[sortedScores.length - 1].score,
        totalPlayTime,
        averagePlayTime: totalPlayTime / scores.length,
        lastPlayedAt: new Date(sortedScores[0].completedAt),
        byDifficulty,
      };
    } catch (error) {
      console.error('[ScoreStorage] Failed to get game stats:', error);
      return this.createEmptyGameStats(gameMode);
    }
  }

  /**
   * Calculate difficulty-specific stats
   */
  private calculateDifficultyStats(
    difficulty: GameDifficulty,
    scores: GameScore[]
  ): DifficultyStats {
    const difficultyScores = scores.filter(score => score.difficulty === difficulty);

    if (difficultyScores.length === 0) {
      return {
        difficulty,
        gamesPlayed: 0,
        averageScore: 0,
        bestScore: 0,
        totalPlayTime: 0,
      };
    }

    const totalScore = difficultyScores.reduce((sum, score) => sum + score.score, 0);
    const totalPlayTime = difficultyScores.reduce(
      (sum, score) => sum + score.duration,
      0
    );
    const sortedScores = [...difficultyScores].sort((a, b) => b.score - a.score);

    return {
      difficulty,
      gamesPlayed: difficultyScores.length,
      averageScore: totalScore / difficultyScores.length,
      bestScore: sortedScores[0].score,
      totalPlayTime,
      lastPlayedAt: new Date(sortedScores[0].completedAt),
    };
  }

  /**
   * Create empty game stats
   */
  private createEmptyGameStats(gameMode: GameMode): GameStats {
    return {
      gameMode,
      totalGames: 0,
      totalScore: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,
      totalPlayTime: 0,
      averagePlayTime: 0,
      byDifficulty: {
        easy: this.createEmptyDifficultyStats('easy'),
        normal: this.createEmptyDifficultyStats('normal'),
        hard: this.createEmptyDifficultyStats('hard'),
        expert: this.createEmptyDifficultyStats('expert'),
      },
    };
  }

  /**
   * Create empty difficulty stats
   */
  private createEmptyDifficultyStats(difficulty: GameDifficulty): DifficultyStats {
    return {
      difficulty,
      gamesPlayed: 0,
      averageScore: 0,
      bestScore: 0,
      totalPlayTime: 0,
    };
  }

  /**
   * Generate local leaderboard
   */
  public async getLocalLeaderboard(filter: LeaderboardFilter): Promise<Leaderboard> {
    try {
      const scores = await this.getAllScores({
        gameMode: filter.gameMode,
        difficulty: filter.difficulty,
        sortBy: 'score',
        sortOrder: 'desc',
      });

      // Group by user and keep only best score per user
      const bestScoresByUser = new Map<string, GameScore>();

      for (const score of scores) {
        const existing = bestScoresByUser.get(score.userId);
        if (!existing || score.score > existing.score) {
          bestScoresByUser.set(score.userId, score);
        }
      }

      // Convert to leaderboard entries
      const entries: LeaderboardEntry[] = Array.from(bestScoresByUser.values())
        .slice(filter.offset || 0, (filter.offset || 0) + (filter.limit || 10))
        .map((score, index) => ({
          rank: (filter.offset || 0) + index + 1,
          userId: score.userId,
          username: score.username,
          score: score.score,
          gameMode: score.gameMode,
          difficulty: score.difficulty,
          completedAt: new Date(score.completedAt),
          isCurrentUser: false, // Will be set by the UI
          isVerified: score.isVerified,
          metadata: score.metadata,
        }));

      return {
        entries,
        totalEntries: bestScoresByUser.size,
        filter,
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('[ScoreStorage] Failed to generate leaderboard:', error);
      return {
        entries: [],
        totalEntries: 0,
        filter,
        updatedAt: new Date(),
      };
    }
  }

  /**
   * Clear all scores
   */
  public async clearAllScores(userId?: string): Promise<boolean> {
    try {
      if (this.useBlobStorage) {
        if (userId) {
          await blobStorage.clearScores(userId);
        } else {
          console.warn('[ScoreStorage] Blob storage requires userId for clearScores, skipping');
        }
      } else {
        storage.removeItem('game:scores');
        storage.removeItem('game:personal_bests');
      }
      return true;
    } catch (error) {
      console.error('[ScoreStorage] Failed to clear scores:', error);
      return false;
    }
  }

  /**
   * Delete a specific score
   */
  public async deleteScore(scoreId: string, userId?: string): Promise<boolean> {
    try {
      const scores = await this.getAllScores({ userId });
      const updatedScores = scores.filter(score => score.id !== scoreId);

      if (this.useBlobStorage) {
        if (userId) {
          await blobStorage.deleteScore(userId, scoreId);
        } else {
          // Try to find userId from existing scores
          const scoreToDelete = scores.find(s => s.id === scoreId);
          if (scoreToDelete) {
            await blobStorage.deleteScore(scoreToDelete.userId, scoreId);
          } else {
            console.warn('[ScoreStorage] Could not find score to delete:', scoreId);
          }
        }
      } else {
        storage.setItem('game:scores', updatedScores);
      }

      return true;
    } catch (error) {
      console.error('[ScoreStorage] Failed to delete score:', error);
      return false;
    }
  }

  /**
   * Get storage usage information
   */
  public getStorageInfo() {
    return storage.getStorageInfo();
  }
}

// Export singleton instance
export const scoreStorage = ScoreStorageManager.getInstance();
