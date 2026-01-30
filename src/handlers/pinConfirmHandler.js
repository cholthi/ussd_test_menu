/**
 * PIN Confirmation Handler
 * Handles PIN confirmation state
 */

const { STATES, RESPONSE_TYPES } = require('../constants');
const userRepository = require('../userRepository');
const languageService = require('../languageService');

/**
 * Handle PIN confirmation state
 * @param {object} session - Current session
 * @param {string} input - User input
 * @returns {object} Response with message and type
 */
async function handle(session, input) {
  // Check if confirmation PIN matches the temporary PIN
  if (input !== session.tempPin) {
    // PINs don't match, go back to PIN setup
    session.state = STATES.PIN_SETUP;
    session.tempPin = null;
    
    return {
      message: `${languageService.getText('pinMismatch', session.language)}\n\n${languageService.getText('pinSetupPrompt', session.language)}`,
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  // PINs match, save PIN for user
  userRepository.setPin(session.msisdn, session.tempPin);
  
  // Clear temporary PIN
  session.tempPin = null;
  
  // Move to main menu
  session.state = STATES.MAIN_MENU;
  
  // Success message
  const successMsg = languageService.getText('pinSuccess', session.language);
  const loginSuccessMsg = languageService.getText('loginSuccess', session.language);
  const logoutOption = languageService.getText('logoutOption', session.language);
  
  return {
    message: `${successMsg}\n${loginSuccessMsg}\n\n${logoutOption}`,
    type: RESPONSE_TYPES.CONTINUE
  };
}

module.exports = { handle };
