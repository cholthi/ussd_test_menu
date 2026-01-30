/**
 * Initial State Handler
 * First state in the USSD flow
 */

const { STATES, RESPONSE_TYPES } = require('../constants');
const userRepository = require('../userRepository');
const languageService = require('../languageService');
const { DEFAULT_LANGUAGE } = require('../config');

/**
 * Handle initial state
 * @param {object} session - Current session
 * @param {string} input - User input
 * @returns {object} Response with message and type
 */
async function handle(session, input) {
  const user = session.customerData || userRepository.getUser(session.phoneNumber);
  
  // User not found (should not happen as checked in state machine)
  if (!user) {
    return {
      message: languageService.getText('userNotFound'),
      type: RESPONSE_TYPES.END
    };
  }
  
  // Check if user has preferred language set
  if (!user.preferredLanguage) {
    // No language set, go to language selection
    session.currentState = STATES.LANGUAGE_SELECTION;
    
    return {
      message: languageService.getText('languageSelection'),
      type: RESPONSE_TYPES.CONTINUE
    };
  } else {
    // Language already set, use it for this session
    session.language = user.preferredLanguage;
  }
    
  // Check if user has PIN set
  if (user.hasPin) {
    // PIN set, go to login
    session.currentState = STATES.LOGIN;
    
    return {
      message: languageService.getText('loginPrompt', session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  } else {
    // No PIN set, go to PIN setup
    session.currentState = STATES.PIN_SETUP;
    
    return {
      message: languageService.getText('pinSetupPrompt', session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
}

module.exports = { handle };
