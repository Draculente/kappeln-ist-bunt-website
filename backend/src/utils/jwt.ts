import jwt from 'jsonwebtoken'

export interface SubscriberJWTPayload {
  email: string
  id: number
}

/**
 * Create a JWT token with the given payload
 * @param payload The payload to encode in the token
 * @param expiresIn Time in seconds or undefined for no expiration
 * @returns
 */
export function createToken(
  payload: SubscriberJWTPayload,
  expiresIn: number | undefined = undefined,
): string {
  return jwt.sign(payload, process.env.JWT_SECRET || '', {
    expiresIn: expiresIn,
  })
}

/**
 * Verify a JWT token and return the decoded payload
 * @param token The token to verify
 * @returns
 */
export function verifyToken(token: string): SubscriberJWTPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || '') as SubscriberJWTPayload
  } catch {
    return null
  }
}
