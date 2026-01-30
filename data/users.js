/**
 * Mock user database for the USSD application
 * In a real application, this would be a proper database like Postgres, MySQL, MongoDB etc
 * PIN would be hashed in a real application using a secure hash function
 */

// Initial set of users
const users = {
  // Format: MSISDN -> user object
  '211925415377': {
    msisdn: '211925415377',
    hasPin: false,
    pin: null,
    isLocked: false,
    preferredLanguage: null,
    attempts: 0
  },
  '211955123456': {
    msisdn: '211955123456',
    hasPin: false,
    pin: null,
    isLocked: false,
    preferredLanguage: null,
    attempts: 0
  }
};

module.exports = users;
