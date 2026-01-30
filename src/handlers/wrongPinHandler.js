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
  // Handle back option
  if (input === '0') {
    if (session.previousStates && session.previousStates.length > 0) {
      session.currentState = session.previousStates.pop();
      return {
        message: languageService.getText('languageSelection'),
        type: RESPONSE_TYPES.CONTINUE
      };
    }
  }
  
  // Wrong PIN state simply redirects back to login
  // This allows the user to try entering their PIN again
  session.currentState = STATES.LOGIN;
  
  return {
    message: languageService.getText('loginPrompt', session.language),
    type: RESPONSE_TYPES.CONTINUE
  };
}

module.exports = { handle };
