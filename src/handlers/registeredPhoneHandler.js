/**
 * Registered Phone Handler
 * Handles registered phone number display
 */

const { STATES, RESPONSE_TYPES } = require('../constants');
const languageService = require('../languageService');

/**
 * Handle registered phone state
 * @param {object} session - Current session
 * @param {string} input - User input
 * @returns {object} Response with message and type
 */
async function handle(session, input) {
  const user = session.customerData;
  
  // Handle back option - return to account info menu
  if (input === '0') {
    session.currentState = STATES.ACCOUNT_INFO_MENU;
    const { buildAccountInfoMenu } = require('./accountInfoMenuHandler');
    return {
      message: buildAccountInfoMenu(user.account, session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  // Any other input returns to account info menu
  session.currentState = STATES.ACCOUNT_INFO_MENU;
  const { buildAccountInfoMenu } = require('./accountInfoMenuHandler');
  return {
    message: buildAccountInfoMenu(user.account, session.language),
    type: RESPONSE_TYPES.CONTINUE
  };
}

/**
 * Build registered phone menu
 * @param {object} accountData - User account data
 * @param {string} language - Session language
 * @returns {string} Registered phone text
 */
function buildRegisteredPhoneMenu(accountData, language) {
  const title = 'Registered number:';
  const phoneNumber = accountData.phoneNumber || '07XX XXX XXX';
  
  return `${title}\n${phoneNumber}\n\n0. Back`;
}

module.exports = { handle, buildRegisteredPhoneMenu };
