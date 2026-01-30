/**
 * Main Menu Handler
 * Handles main menu state
 */

const { RESPONSE_TYPES } = require('../constants');
const languageService = require('../languageService');

/**
 * Handle main menu state
 * @param {object} session - Current session
 * @param {string} input - User input
 * @returns {object} Response with message and type
 */
async function handle(session, input) {
  // Check for logout option (1)
  if (input === '1') {
    return {
      message: languageService.getText('goodbye', session.language),
      type: RESPONSE_TYPES.END
    };
  }
  
  // Invalid option, show main menu again
  const loginSuccessMsg = languageService.getText('loginSuccess', session.language);
  const logoutOption = languageService.getText('logoutOption', session.language);
  
  return {
    message: `${loginSuccessMsg}\n\n${logoutOption}`,
    type: RESPONSE_TYPES.CONTINUE
  };
}

module.exports = { handle };
