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
  // Handle back option (though rarely used in language selection)
  if (input === '0') {
    // Go back to initial or end session if no previous state
    if (session.previousStates && session.previousStates.length > 0) {
      session.currentState = session.previousStates.pop();
    } else {
      return {
        message: languageService.getText('goodbye', session.language || 'en'),
        type: RESPONSE_TYPES.END
      };
    }
  }
  
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
  userRepository.setLanguage(session.phoneNumber, selectedLanguage);
  
  // Update customer data in session
  if (session.customerData) {
    session.customerData.preferredLanguage = selectedLanguage;
  }
  
  const user = session.customerData || userRepository.getUser(session.phoneNumber);
  
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
