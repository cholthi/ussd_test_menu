/**
 * Main Menu Handler
 * Shows main menu options after successful login
 */

const { STATES, RESPONSE_TYPES } = require('../constants');
const languageService = require('../languageService');

/**
 * Handle main menu state
 * @param {object} session - Current session
 * @param {string} input - User input
 * @returns {object} Response with message and type
 */
async function handle(session, input) {
  const user = session.customerData;
  
  // Handle empty input (when user dials *183 directly) - show main menu
  if (input === '' || input === null || input === undefined) {
    return {
      message: buildMainMenu(user, session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  // Handle back option (though main menu is usually the root)
  if (input === '0') {
    // Show main menu again or could logout
    return {
      message: buildMainMenu(user, session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  if (input === '1') {
    // Loans menu selected
    session.currentState = STATES.LOANS_MENU;
    const { buildLoansMenu } = require('./loansMenuHandler');
    return {
      message: buildLoansMenu(user.loan, session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  if (input === '2') {
    // Account Info menu selected
    session.currentState = STATES.ACCOUNT_INFO_MENU;
    const { buildAccountInfoMenu } = require('./accountInfoMenuHandler');
    return {
      message: buildAccountInfoMenu(user.account, session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  if (input === '3') {
    // Logout selected
    return {
      message: languageService.getText('goodbye', session.language),
      type: RESPONSE_TYPES.END
    };
  }
  
  // Invalid option - show main menu again
  return {
    message: `${languageService.getText('invalidOption', session.language)}\n\n${buildMainMenu(user, session.language)}`,
    type: RESPONSE_TYPES.CONTINUE
  };
}

/**
 * Build main menu message
 * @param {object} user - User data
 * @param {string} language - Session language
 * @returns {string} Main menu text
 */
function buildMainMenu(user, language) {
  const welcome = languageService.getText('welcomeBack', language, { name: user.name });
  const menuOptions = [
    '1. ' + languageService.getText('loansOption', language),
    '2. ' + languageService.getText('accountInfoOption', language),
    '3. ' + languageService.getText('logoutOption', language)
  ].join('\n');
  
  return `${welcome}\n\n${menuOptions}`;
}

// buildLoansMenu function moved to loansMenuHandler.js

// buildAccountInfoMenu function moved to accountInfoMenuHandler.js

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
function formatCurrency(amount) {
  return `UGX ${amount.toLocaleString()}`;
}

/**
 * Format date for display
 * @param {string} dateString - Date to format
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

module.exports = { handle, buildMainMenu };
