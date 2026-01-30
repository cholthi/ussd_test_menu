/**
 * Language Selection Handler
 * Handles language selection state
 */

const { STATES, RESPONSE_TYPES } = require('../constants');
const userRepository = require('../userRepository');
const languageService = require('../languageService');

/**
 * Handle language selection state
 * @param {object} session - Current session
 * @param {string} input - User input
 * @returns {object} Response with message and type
 */
async function handle(session, input) {
  // Parse language selection (1, 2, or 3)
  const selectedLanguage = languageService.getLanguageFromSelection(input);
  
  if (!selectedLanguage) {
    // Invalid selection, stay in same state
    return {
      message: `${languageService.getText('invalidOption')}\n\n${languageService.getText('languageOptions')}`,
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  // Set language in session and user preferences
  session.language = selectedLanguage;
  userRepository.setLanguage(session.msisdn, selectedLanguage);
  
  const user = userRepository.getUser(session.msisdn);
  
  // Check if user has PIN set
  if (user.hasPin) {
    // PIN set, go to login
    session.state = STATES.LOGIN;
    
    return {
      message: languageService.getText('loginPrompt', session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  } else {
    // No PIN set, go to PIN setup
    session.state = STATES.PIN_SETUP;
    
    return {
      message: languageService.getText('pinSetupPrompt', session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
}

module.exports = { handle };
