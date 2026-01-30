/**
 * Account Mini Statement Handler
 * Handles account mini statement display
 */

const { STATES, RESPONSE_TYPES } = require('../constants');
const languageService = require('../languageService');

/**
 * Handle account mini statement state
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
 * Build account mini statement menu
 * @param {object} accountData - User account data
 * @param {string} language - Session language
 * @returns {string} Mini statement text
 */
function buildAccountMiniStatementMenu(accountData, language) {
  const title = 'Mini Statement';
  let details = title;
  
  if (accountData.transactions && accountData.transactions.length > 0) {
    accountData.transactions.slice(0, 3).forEach(transaction => {
      const date = formatDate(transaction.date, 'dd/mm');
      details += `\n${date} KES ${transaction.amount.toLocaleString()}`;
    });
  } else {
    details += '\nNo recent transactions found';
  }
  
  return `${details}\n\n0. Back`;
}

/**
 * Format date for display
 * @param {string} dateString - Date to format
 * @param {string} format - Format type ('dd/mm', 'dd/mm/yyyy', or default)
 * @returns {string} Formatted date
 */
function formatDate(dateString, format = 'default') {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  
  if (format === 'dd/mm') {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
  } else if (format === 'dd/mm/yyyy') {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } else {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}

module.exports = { handle, buildAccountMiniStatementMenu };
