/**
 * Session Store for USSD application
 * Manages in-memory storage of user sessions
 * This should typically be replaced with a database or caching system in production
 */

const { SESSION_TIMEOUT } = require('./config');

class SessionStore {
  constructor() {
    // In-memory session storage
    this.sessions = {};
    
    // Set up periodic cleanup of expired sessions
    setInterval(() => this.cleanExpiredSessions(), 60000); // Cleanup every minute
  }

  /**
   * Create or update a session
   * @param {string} sessionId - Unique session identifier
   * @param {object} sessionData - Session data to store
   */
  saveSession(sessionId, sessionData) {
    // Set last activity timestamp
    const updatedSession = {
      currentState: sessionData.currentState || 'INITIAL',
      sessionId: sessionId,
      phoneNumber: sessionData.phoneNumber || sessionData.msisdn,
      previousStates: sessionData.previousStates || [],
      customerData: sessionData.customerData || null,
      language: sessionData.language || 'en',
      tempData: sessionData.tempData || {}, // For temporary data like PIN setup
      lastActivity: Date.now()
    };
    
    this.sessions[sessionId] = updatedSession;
    return updatedSession;
  }

  /**
   * Retrieve a session by ID
   * @param {string} sessionId - Session identifier
   * @returns {object|null} Session data or null if not found
   */
  getSession(sessionId) {
    const session = this.sessions[sessionId];
    
    // Check if session exists and is not expired
    if (session) {
      const now = Date.now();
      
      // Check for session timeout
      if (now - session.lastActivity > SESSION_TIMEOUT) {
        this.clearSession(sessionId);
        return null;
      }
      
      // Update last activity
      session.lastActivity = now;
      return session;
    }
    
    return null;
  }

  /**
   * Remove a session
   * @param {string} sessionId - Session identifier
   */
  clearSession(sessionId) {
    if (this.sessions[sessionId]) {
      delete this.sessions[sessionId];
      return true;
    }
    return false;
  }

  /**
   * Clean up expired sessions
   */
  cleanExpiredSessions() {
    const now = Date.now();
    const expiredSessions = Object.keys(this.sessions).filter(
      sessionId => now - this.sessions[sessionId].lastActivity > SESSION_TIMEOUT
    );
    
    expiredSessions.forEach(sessionId => this.clearSession(sessionId));
    
    if (expiredSessions.length > 0) {
      console.log(`Cleaned up ${expiredSessions.length} expired sessions`);
    }
  }
}

// Export singleton instance
module.exports = new SessionStore();
