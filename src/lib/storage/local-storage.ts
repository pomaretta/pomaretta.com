/**
 * Local Storage Manager
 *
 * Type-safe wrapper around localStorage with error handling, quota management,
 * and automatic fallback strategies. Implements singleton pattern.
 */

import type { UserSession } from '@/types/auth';
import type { GameScore, PersonalBests } from '@/types/game';

/**
 * Local storage schema definition
 * Maps storage keys to their corresponding types
 */
export interface LocalStorageSchema {
  // Authentication
  'auth:session': UserSession;
  'auth:oauth_state': string;
  'auth:remember': boolean;

  // Game scores
  'game:scores': GameScore[];
  'game:personal_bests': PersonalBests;
  'game:current_session': string;

  // User preferences
  'prefs:theme': 'light' | 'dark' | 'system';
  'prefs:language': 'en' | 'es';
  'prefs:sound_enabled': boolean;
  'prefs:music_enabled': boolean;
  'prefs:sound_volume': number;
  'prefs:music_volume': number;
  'prefs:show_tutorial': boolean;
  'prefs:notifications': boolean;

  // Cache and temporary data
  'cache:leaderboard': string;
  'cache:last_sync': number;
  'temp:draft_game': string;
}

/**
 * Storage key type - ensures only valid keys are used
 */
export type StorageKey = keyof LocalStorageSchema;

/**
 * Storage operation result
 */
export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: StorageError;
}

/**
 * Storage error types
 */
export interface StorageError {
  code: StorageErrorCode;
  message: string;
  details?: unknown;
}

/**
 * Storage error codes
 */
export type StorageErrorCode =
  | 'QUOTA_EXCEEDED'
  | 'NOT_SUPPORTED'
  | 'PARSE_ERROR'
  | 'NOT_FOUND'
  | 'INVALID_KEY'
  | 'PERMISSION_DENIED'
  | 'UNKNOWN_ERROR';

/**
 * Storage options
 */
export interface StorageOptions {
  ttl?: number; // Time to live in milliseconds
  compress?: boolean; // Whether to compress data (future feature)
  encrypt?: boolean; // Whether to encrypt data (future feature)
}

/**
 * Stored value wrapper with metadata
 */
interface StoredValue<T> {
  value: T;
  timestamp: number;
  ttl?: number;
  version: number;
}

/**
 * Local Storage Manager
 * Singleton class for managing localStorage operations
 */
export class LocalStorageManager {
  private static instance: LocalStorageManager;
  private readonly storagePrefix = 'portfolio_';
  private readonly version = 1;
  private isAvailable = false;

  private constructor() {
    this.checkAvailability();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  /**
   * Check if localStorage is available and working
   */
  private checkAvailability(): void {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      this.isAvailable = true;
    } catch {
      this.isAvailable = false;
      console.warn('[LocalStorage] localStorage is not available');
    }
  }

  /**
   * Check if storage is available
   */
  public isStorageAvailable(): boolean {
    return this.isAvailable;
  }

  /**
   * Get prefixed key
   */
  private getPrefixedKey(key: StorageKey): string {
    return `${this.storagePrefix}${key}`;
  }

  /**
   * Set item in localStorage
   */
  public setItem<K extends StorageKey>(
    key: K,
    value: LocalStorageSchema[K],
    options?: StorageOptions
  ): StorageResult<void> {
    if (!this.isAvailable) {
      return {
        success: false,
        error: {
          code: 'NOT_SUPPORTED',
          message: 'localStorage is not available',
        },
      };
    }

    try {
      const storedValue: StoredValue<LocalStorageSchema[K]> = {
        value,
        timestamp: Date.now(),
        ttl: options?.ttl,
        version: this.version,
      };

      const serialized = JSON.stringify(storedValue);
      const prefixedKey = this.getPrefixedKey(key);

      localStorage.setItem(prefixedKey, serialized);

      return { success: true };
    } catch (error) {
      // Check for quota exceeded error
      if (
        error instanceof DOMException &&
        (error.code === 22 || error.name === 'QuotaExceededError')
      ) {
        // Try to free up space
        this.clearExpired();

        // Retry once
        try {
          const storedValue: StoredValue<LocalStorageSchema[K]> = {
            value,
            timestamp: Date.now(),
            ttl: options?.ttl,
            version: this.version,
          };
          const serialized = JSON.stringify(storedValue);
          const prefixedKey = this.getPrefixedKey(key);
          localStorage.setItem(prefixedKey, serialized);
          return { success: true };
        } catch {
          return {
            success: false,
            error: {
              code: 'QUOTA_EXCEEDED',
              message: 'Storage quota exceeded',
              details: error,
            },
          };
        }
      }

      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'Failed to set item',
          details: error,
        },
      };
    }
  }

  /**
   * Get item from localStorage
   */
  public getItem<K extends StorageKey>(
    key: K
  ): StorageResult<LocalStorageSchema[K]> {
    if (!this.isAvailable) {
      return {
        success: false,
        error: {
          code: 'NOT_SUPPORTED',
          message: 'localStorage is not available',
        },
      };
    }

    try {
      const prefixedKey = this.getPrefixedKey(key);
      const item = localStorage.getItem(prefixedKey);

      if (item === null) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Item with key "${key}" not found`,
          },
        };
      }

      const storedValue = JSON.parse(item) as StoredValue<LocalStorageSchema[K]>;

      // Check if item has expired
      if (storedValue.ttl) {
        const expirationTime = storedValue.timestamp + storedValue.ttl;
        if (Date.now() > expirationTime) {
          this.removeItem(key);
          return {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Item has expired',
            },
          };
        }
      }

      // Check version compatibility
      if (storedValue.version !== this.version) {
        console.warn(`[LocalStorage] Version mismatch for key "${key}"`);
        // Could implement migration logic here
      }

      return {
        success: true,
        data: storedValue.value,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PARSE_ERROR',
          message: 'Failed to parse stored value',
          details: error,
        },
      };
    }
  }

  /**
   * Remove item from localStorage
   */
  public removeItem(key: StorageKey): StorageResult<void> {
    if (!this.isAvailable) {
      return {
        success: false,
        error: {
          code: 'NOT_SUPPORTED',
          message: 'localStorage is not available',
        },
      };
    }

    try {
      const prefixedKey = this.getPrefixedKey(key);
      localStorage.removeItem(prefixedKey);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'Failed to remove item',
          details: error,
        },
      };
    }
  }

  /**
   * Clear all items with our prefix
   */
  public clear(): StorageResult<void> {
    if (!this.isAvailable) {
      return {
        success: false,
        error: {
          code: 'NOT_SUPPORTED',
          message: 'localStorage is not available',
        },
      };
    }

    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.storagePrefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'Failed to clear storage',
          details: error,
        },
      };
    }
  }

  /**
   * Clear expired items
   */
  public clearExpired(): number {
    if (!this.isAvailable) {
      return 0;
    }

    let clearedCount = 0;

    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith(this.storagePrefix)) continue;

        try {
          const item = localStorage.getItem(key);
          if (!item) continue;

          const storedValue = JSON.parse(item) as StoredValue<unknown>;

          if (storedValue.ttl) {
            const expirationTime = storedValue.timestamp + storedValue.ttl;
            if (Date.now() > expirationTime) {
              keysToRemove.push(key);
            }
          }
        } catch {
          // If parsing fails, remove the corrupted item
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        clearedCount++;
      });

      return clearedCount;
    } catch {
      return clearedCount;
    }
  }

  /**
   * Get storage usage information
   */
  public getStorageInfo(): {
    used: number;
    available: number;
    total: number;
    percentage: number;
  } {
    if (!this.isAvailable) {
      return { used: 0, available: 0, total: 0, percentage: 0 };
    }

    try {
      let totalSize = 0;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.storagePrefix)) {
          const item = localStorage.getItem(key);
          if (item) {
            totalSize += item.length + key.length;
          }
        }
      }

      // Most browsers have a 5-10MB limit for localStorage
      // We'll assume 5MB (5,242,880 bytes) as a conservative estimate
      const totalAvailable = 5242880;
      const available = totalAvailable - totalSize;
      const percentage = (totalSize / totalAvailable) * 100;

      return {
        used: totalSize,
        available: Math.max(0, available),
        total: totalAvailable,
        percentage: Math.min(100, percentage),
      };
    } catch {
      return { used: 0, available: 0, total: 0, percentage: 0 };
    }
  }

  /**
   * Check if key exists
   */
  public hasItem(key: StorageKey): boolean {
    const result = this.getItem(key);
    return result.success;
  }

  /**
   * Get all keys with our prefix
   */
  public getAllKeys(): StorageKey[] {
    if (!this.isAvailable) {
      return [];
    }

    const keys: StorageKey[] = [];

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.storagePrefix)) {
          const unprefixedKey = key.substring(this.storagePrefix.length);
          keys.push(unprefixedKey as StorageKey);
        }
      }
    } catch {
      // Ignore errors
    }

    return keys;
  }
}

// Export singleton instance
export const storage = LocalStorageManager.getInstance();
