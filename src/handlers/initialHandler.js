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
  const user = userRepository.getUser(session.msisdn);
  
  // Check if user has set language preference
  if (!session.language && !user.preferredLanguage) {
    // No language set, go to language selection
    session.state = STATES.LANGUAGE_SELECTION;
    
    const welcomeText = languageService.getText('welcome');
    const promptText = languageService.getText('languagePrompt');
    const optionsText = languageService.getText('languageOptions');
    
    return {
      message: `${welcomeText}\n\n${promptText}\n${optionsText}`,
      type: RESPONSE_TYPES.CONTINUE
    };
  } else {
    // Language already set, use it
    session.language = session.language || user.preferredLanguage;
    
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
}

module.exports = { handle };
