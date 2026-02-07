/**
 * Authentication and User Types
 *
 * Defines all types related to user authentication, sessions, and profiles.
 * Supports both guest and authenticated users with OAuth integration.
 */

/**
 * OAuth provider types supported by the application
 */
export type OAuthProvider = 'github' | 'google' | 'discord';

/**
 * User role in the system
 */
export type UserRole = 'guest' | 'user' | 'admin';

/**
 * Base user interface - common properties for all user types
 */
export interface BaseUser {
  id: string;
  username: string;
  role: UserRole;
  createdAt: Date;
  lastActiveAt: Date;
}

/**
 * Guest user - anonymous user with temporary ID
 * Guest users can play games but scores are stored locally only
 */
export interface GuestUser extends BaseUser {
  role: 'guest';
  isGuest: true;
  isAuthenticated: false;
}

/**
 * Authenticated user - user logged in via OAuth
 * Can sync scores across devices and appear on global leaderboards
 */
export interface AuthenticatedUser extends BaseUser {
  role: 'user' | 'admin';
  isGuest: false;
  isAuthenticated: true;
  email: string;
  avatar?: string;
  provider: OAuthProvider;
  providerId: string;
  displayName?: string;
}

/**
 * Union type for all user types
 */
export type User = GuestUser | AuthenticatedUser;

/**
 * OAuth token information
 */
export interface OAuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  tokenType: 'Bearer';
  scope?: string;
}

/**
 * OAuth profile data returned from provider
 */
export interface OAuthProfile {
  provider: OAuthProvider;
  providerId: string;
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
  emailVerified?: boolean;
}

/**
 * User session information
 * Stored in localStorage and used to maintain authentication state
 */
export interface UserSession {
  user: User;
  token?: OAuthToken;
  sessionId: string;
  createdAt: Date;
  expiresAt: Date;
  lastRefreshAt: Date;
}

/**
 * User profile with extended information
 * Includes statistics and preferences
 */
export interface UserProfile {
  user: User;
  stats: UserStats;
  preferences: UserPreferences;
  achievements: Achievement[];
}

/**
 * User statistics across all games
 */
export interface UserStats {
  totalGamesPlayed: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  totalPlayTime: number; // in seconds
  gamesWon: number;
  gamesLost: number;
  winRate: number; // percentage
  lastPlayedAt?: Date;
}

/**
 * User preferences and settings
 */
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: 'en' | 'es';
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number; // 0-100
  musicVolume: number; // 0-100
  showTutorial: boolean;
  notifications: boolean;
}

/**
 * Achievement/badge system
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

/**
 * Authentication state
 */
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: UserSession | null;
  error: AuthError | null;
}

/**
 * Authentication error types
 */
export interface AuthError {
  code: AuthErrorCode;
  message: string;
  details?: unknown;
}

/**
 * Authentication error codes
 */
export type AuthErrorCode =
  | 'AUTH_FAILED'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'SESSION_EXPIRED'
  | 'SESSION_INVALID'
  | 'OAUTH_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * OAuth callback state for PKCE flow
 */
export interface OAuthState {
  provider: OAuthProvider;
  codeVerifier: string;
  state: string;
  redirectUri: string;
  createdAt: Date;
}

/**
 * Type guard to check if user is authenticated
 */
export function isAuthenticatedUser(user: User): user is AuthenticatedUser {
  return user.isAuthenticated === true;
}

/**
 * Type guard to check if user is guest
 */
export function isGuestUser(user: User): user is GuestUser {
  return user.isGuest === true;
}

/**
 * Helper to create a guest user
 */
export function createGuestUser(username: string = 'Guest'): GuestUser {
  const now = new Date();
  return {
    id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    username,
    role: 'guest',
    isGuest: true,
    isAuthenticated: false,
    createdAt: now,
    lastActiveAt: now,
  };
}
