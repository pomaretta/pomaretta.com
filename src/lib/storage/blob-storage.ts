/**
 * Vercel Blob Storage Manager
 *
 * Provides cloud storage using Vercel Blob as a fallback when localStorage quota is exceeded.
 * Stores game scores and personal bests in Vercel's edge-optimized blob storage.
 */

import { put, del, list, head } from '@vercel/blob'
import type { GameScore, PersonalBests } from '@/types/game'

/**
 * Vercel Blob Storage Manager
 * Singleton class for managing blob storage operations
 */
export class BlobStorageManager {
  private static instance: BlobStorageManager
  private readonly BLOB_TOKEN: string
  private readonly SCORES_PREFIX = 'scores/'
  private readonly BESTS_PREFIX = 'personal-bests/'

  private constructor() {
    // Read from environment variable
    this.BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || ''

    if (!this.BLOB_TOKEN && typeof window !== 'undefined') {
      console.warn('[BlobStorage] No BLOB_READ_WRITE_TOKEN found in environment')
    }
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): BlobStorageManager {
    if (!BlobStorageManager.instance) {
      BlobStorageManager.instance = new BlobStorageManager()
    }
    return BlobStorageManager.instance
  }

  /**
   * Check if Blob Storage is available and configured
   */
  public isAvailable(): boolean {
    return !!this.BLOB_TOKEN && typeof window !== 'undefined'
  }

  /**
   * Generate blob path for a score
   */
  private getScorePath(userId: string, scoreId: string): string {
    return `${this.SCORES_PREFIX}${userId}/${scoreId}.json`
  }

  /**
   * Generate blob path for personal bests
   */
  private getBestsPath(userId: string): string {
    return `${this.BESTS_PREFIX}${userId}.json`
  }

  /**
   * Store a score in Blob Storage
   */
  public async storeScore(score: GameScore): Promise<void> {
    if (!this.isAvailable()) {
      console.warn('[BlobStorage] Not configured, skipping storeScore')
      return
    }

    try {
      const path = this.getScorePath(score.userId, score.id)
      const blob = await put(path, JSON.stringify(score), {
        access: 'public',
        token: this.BLOB_TOKEN,
        addRandomSuffix: false,
      })
      console.log('[BlobStorage] Score stored:', blob.url)
    } catch (error) {
      console.error('[BlobStorage] Failed to store score:', error)
      throw error
    }
  }

  /**
   * Save a score (alias for storeScore)
   */
  public async saveScore(score: GameScore): Promise<void> {
    return this.storeScore(score)
  }

  /**
   * Retrieve all scores for a user
   */
  public async getScores(userId: string, limit?: number): Promise<GameScore[]> {
    if (!this.isAvailable()) {
      console.warn('[BlobStorage] Not configured, returning empty array')
      return []
    }

    try {
      const prefix = `${this.SCORES_PREFIX}${userId}/`
      const { blobs } = await list({
        prefix,
        token: this.BLOB_TOKEN,
        limit: limit || 1000,
      })

      const scores: GameScore[] = []
      for (const blob of blobs) {
        try {
          const response = await fetch(blob.url)
          const score = await response.json()
          scores.push(score)
        } catch (error) {
          console.error('[BlobStorage] Failed to fetch score:', blob.url, error)
        }
      }

      // Sort by completion date (most recent first)
      scores.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())

      return limit ? scores.slice(0, limit) : scores
    } catch (error) {
      console.error('[BlobStorage] Failed to get scores:', error)
      return []
    }
  }

  /**
   * Get all scores (alias for getScores)
   */
  public async getAllScores(userId: string): Promise<GameScore[]> {
    return this.getScores(userId)
  }

  /**
   * Delete a specific score
   */
  public async deleteScore(userId: string, scoreId: string): Promise<void> {
    if (!this.isAvailable()) {
      console.warn('[BlobStorage] Not configured, skipping deleteScore')
      return
    }

    try {
      const path = this.getScorePath(userId, scoreId)

      // Check if blob exists
      try {
        await head(path, { token: this.BLOB_TOKEN })
      } catch {
        console.warn('[BlobStorage] Score not found:', path)
        return
      }

      await del(path, { token: this.BLOB_TOKEN })
      console.log('[BlobStorage] Score deleted:', path)
    } catch (error) {
      console.error('[BlobStorage] Failed to delete score:', error)
      throw error
    }
  }

  /**
   * Save personal bests
   */
  public async savePersonalBests(bests: PersonalBests): Promise<void> {
    if (!this.isAvailable()) {
      console.warn('[BlobStorage] Not configured, skipping savePersonalBests')
      return
    }

    try {
      const path = this.getBestsPath(bests.userId)
      const blob = await put(path, JSON.stringify(bests), {
        access: 'public',
        token: this.BLOB_TOKEN,
        addRandomSuffix: false,
      })
      console.log('[BlobStorage] Personal bests saved:', blob.url)
    } catch (error) {
      console.error('[BlobStorage] Failed to save personal bests:', error)
      throw error
    }
  }

  /**
   * Get personal bests
   */
  public async getPersonalBests(userId: string): Promise<PersonalBests | null> {
    if (!this.isAvailable()) {
      console.warn('[BlobStorage] Not configured, returning null')
      return null
    }

    try {
      const path = this.getBestsPath(userId)

      // Check if blob exists
      try {
        await head(path, { token: this.BLOB_TOKEN })
      } catch {
        console.warn('[BlobStorage] Personal bests not found for user:', userId)
        return null
      }

      // Fetch the blob content
      const { blobs } = await list({
        prefix: path,
        token: this.BLOB_TOKEN,
        limit: 1,
      })

      if (blobs.length === 0) return null

      const response = await fetch(blobs[0].url)
      const bests = await response.json()
      return bests
    } catch (error) {
      console.error('[BlobStorage] Failed to get personal bests:', error)
      return null
    }
  }

  /**
   * Clear all scores for a user
   */
  public async clearScores(userId: string): Promise<void> {
    if (!this.isAvailable()) {
      console.warn('[BlobStorage] Not configured, skipping clearScores')
      return
    }

    try {
      const prefix = `${this.SCORES_PREFIX}${userId}/`
      const { blobs } = await list({
        prefix,
        token: this.BLOB_TOKEN,
        limit: 1000,
      })

      // Delete all score blobs
      await Promise.all(
        blobs.map(blob =>
          del(blob.url, { token: this.BLOB_TOKEN }).catch(err =>
            console.error('[BlobStorage] Failed to delete blob:', blob.url, err)
          )
        )
      )

      console.log('[BlobStorage] Cleared', blobs.length, 'scores for user:', userId)
    } catch (error) {
      console.error('[BlobStorage] Failed to clear scores:', error)
      throw error
    }
  }

  /**
   * Clear all data for a user (scores + personal bests)
   */
  public async clearAll(userId: string): Promise<void> {
    if (!this.isAvailable()) {
      console.warn('[BlobStorage] Not configured, skipping clearAll')
      return
    }

    try {
      // Clear scores
      await this.clearScores(userId)

      // Clear personal bests
      const bestsPath = this.getBestsPath(userId)
      try {
        await head(bestsPath, { token: this.BLOB_TOKEN })
        await del(bestsPath, { token: this.BLOB_TOKEN })
      } catch {
        // Bests file doesn't exist, that's fine
      }

      console.log('[BlobStorage] Cleared all data for user:', userId)
    } catch (error) {
      console.error('[BlobStorage] Failed to clear all data:', error)
      throw error
    }
  }
}

// Export singleton instance
export const blobStorage = BlobStorageManager.getInstance()
