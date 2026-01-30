/**
 * Recent Transactions Handler
 * Handles recent transactions view
 */

const { STATES, RESPONSE_TYPES } = require('../constants');
const { buildMainMenu } = require('./mainMenuHandler');

/**
 * Handle recent transactions state
 * @param {object} session - Current session
 * @param {string} input - User input
 * @returns {object} Response with message and type
 */
async function handle(session, input) {
  const user = session.customerData;
  
  // Handle back option - return to account info menu
  if (input === '0') {
    session.currentState = STATES.ACCOUNT_INFO_MENU;
    return {
      message: buildAccountInfoMenu(user.account, session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  // Handle 00 option - direct to main menu
  if (input === '00') {
    session.currentState = STATES.MAIN_MENU;
    return {
      message: buildMainMenu(user, session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  // For this simple implementation, any other input returns to account info menu
  session.currentState = STATES.ACCOUNT_INFO_MENU;
  return {
    message: buildAccountInfoMenu(user.account, session.language),
    type: RESPONSE_TYPES.CONTINUE
  };
}

/**
 * Build account info menu message
 * @param {object} accountData - User account data
 * @param {string} language - Session language
 * @returns {string} Account info menu text
 */
function buildAccountInfoMenu(accountData, language) {
  const title = 'ACCOUNT INFORMATION';
  const accountNumber = `Account: ${accountData.accountNumber}`;
  const balance = `Balance: UGX ${accountData.balance.toLocaleString()}`;
  const accountType = `Type: ${accountData.accountType}`;
  
  const details = `${title}\n\n${accountNumber}\n${balance}\n${accountType}`;
  
  const menuOptions = [
    '',
    '1. Recent Transactions',
    '2. Account Details',
    '',
    '0. Back to Main Menu'
  ].join('\n');
  
  return `${details}${menuOptions}`;
}

module.exports = { handle };
