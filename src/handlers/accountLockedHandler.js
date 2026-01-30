/**
 * Account Locked Handler
 * Handles account locked state
 */

const { RESPONSE_TYPES } = require('../constants');
const languageService = require('../languageService');

/**
 * Handle account locked state
 * @param {object} session - Current session
 * @param {string} input - User input
 * @returns {object} Response with message and type
 */
async function handle(session, input) {
  // Account is locked, always terminate session
  // No further interaction allowed until account is unlocked
  
  return {
    message: languageService.getText('accountLocked', session.language),
    type: RESPONSE_TYPES.END
  };
}

module.exports = { handle };
