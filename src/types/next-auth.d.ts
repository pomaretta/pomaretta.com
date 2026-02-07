/**
 * NextAuth Type Extensions
 *
 * Extends the default NextAuth types to include custom properties
 * for the User and Session objects.
 */

import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  /**
   * Extends the built-in session.user type
   */
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }

  /**
   * Extends the built-in user type
   */
  interface User extends DefaultUser {
    id: string
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the JWT token type
   */
  interface JWT extends DefaultJWT {
    userId?: string
  }
}
