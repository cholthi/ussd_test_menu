/**
 * Wrong PIN Handler
 * Handles wrong PIN state
 */

const { STATES, RESPONSE_TYPES, MAX_PIN_ATTEMPTS } = require('../constants');
const userRepository = require('../userRepository');
const languageService = require('../languageService');

/**
 * Handle wrong PIN state
 * @param {object} session - Current session
 * @param {string} input - User input
 * @returns {object} Response with message and type
 */
async function handle(session, input) {
  // Return to login state for another attempt
  session.state = STATES.LOGIN;
  
  return {
    message: languageService.getText('loginPrompt', session.language),
    type: RESPONSE_TYPES.CONTINUE
  };
}

module.exports = { handle };
