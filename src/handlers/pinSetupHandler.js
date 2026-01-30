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
  // Validate PIN format (4 digits)
  if (!/^\d{4}$/.test(input)) {
    // Invalid PIN, stay in same state
    return {
      message: languageService.getText('invalidPin', session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  // Store PIN temporarily in session
  session.tempPin = input;
  
  // Move to PIN confirmation
  session.state = STATES.PIN_CONFIRMATION;
  
  return {
    message: languageService.getText('pinConfirmPrompt', session.language),
    type: RESPONSE_TYPES.CONTINUE
  };
}

module.exports = { handle };
