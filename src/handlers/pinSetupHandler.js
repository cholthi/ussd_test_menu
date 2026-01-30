/**
 * PIN Setup Handler
 * Handles PIN setup state
 */

const { STATES, RESPONSE_TYPES } = require('../constants');
const languageService = require('../languageService');

/**
 * Handle PIN setup state
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
  
  // Validate PIN (4 digits)
  if (!input || input.length !== 4 || !/^\d{4}$/.test(input)) {
    return {
      message: languageService.getText('invalidPin', session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  // Store PIN temporarily (not saved yet)
  session.tempData.tempPin = input;
  session.currentState = STATES.PIN_CONFIRMATION;
  
  return {
    message: languageService.getText('pinConfirmPrompt', session.language),
    type: RESPONSE_TYPES.CONTINUE
  };
}

module.exports = { handle };
