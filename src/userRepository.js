/**
 * User Repository for USSD application
 * Manages user data and operations
 * This should typically be replaced with a database or caching system in production
 */

// Import mock user database
const users = require('../data/users');

class UserRepository {
  constructor() {
    // Use imported mock database
    this.users = users;
  }

  /**
   * Check if user exists by phone number (MSISDN)
   * @param {string} msisdn - Phone number
   * @returns {boolean} True if user exists
   */
  userExists(msisdn) {
    return !!this.users[msisdn];
  }

  /**
   * Get user by phone number
   * @param {string} msisdn - Phone number
   * @returns {object|null} User object or null if not found
   */
  getUser(msisdn) {
    return this.users[msisdn] || null;
  }

  /**
   * Set user PIN
   * @param {string} msisdn - Phone number
   * @param {string} pin - 4-digit PIN
   * @returns {boolean} True if successful
   */
  setPin(msisdn, pin) {
    if (!this.userExists(msisdn)) {
      return false;
    }

    this.users[msisdn].pin = pin;
    this.users[msisdn].hasPin = true;
    return true;
  }

  /**
   * Verify user PIN
   * @param {string} msisdn - Phone number
   * @param {string} pin - 4-digit PIN to verify
   * @returns {boolean} True if PIN matches
   */
  verifyPin(msisdn, pin) {
    const user = this.getUser(msisdn);
    
    if (!user || !user.hasPin) {
      return false;
    }

    return user.pin === pin;
  }

  /**
   * Set preferred language for user
   * @param {string} msisdn - Phone number
   * @param {string} language - Language code
   */
  setLanguage(msisdn, language) {
    if (this.userExists(msisdn)) {
      this.users[msisdn].preferredLanguage = language;
      return true;
    }
    return false;
  }

  /**
   * Get preferred language for user
   * @param {string} msisdn - Phone number
   * @returns {string|null} Language code or null if not set
   */
  getLanguage(msisdn) {
    const user = this.getUser(msisdn);
    return user ? user.preferredLanguage : null;
  }

  /**
   * Increment failed PIN attempts
   * @param {string} msisdn - Phone number
   * @returns {number} Current number of attempts
   */
  incrementAttempts(msisdn) {
    if (this.userExists(msisdn)) {
      this.users[msisdn].attempts += 1;
      return this.users[msisdn].attempts;
    }
    return 0;
  }

  /**
   * Reset PIN attempts counter
   * @param {string} msisdn - Phone number
   */
  resetAttempts(msisdn) {
    if (this.userExists(msisdn)) {
      this.users[msisdn].attempts = 0;
    }
  }

  /**
   * Lock user account
   * @param {string} msisdn - Phone number
   */
  lockAccount(msisdn) {
    if (this.userExists(msisdn)) {
      this.users[msisdn].isLocked = true;
    }
  }

  /**
   * Check if user account is locked
   * @param {string} msisdn - Phone number
   * @returns {boolean} True if account is locked
   */
  isAccountLocked(msisdn) {
    const user = this.getUser(msisdn);
    return user ? user.isLocked : false;
  }
}

// Export singleton instance
module.exports = new UserRepository();
