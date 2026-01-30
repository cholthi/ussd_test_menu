/**
 * Account Next Due Date Handler
 * Handles account next due date display
 */

const { STATES, RESPONSE_TYPES } = require('../constants');
const languageService = require('../languageService');

/**
 * Handle account next due date state
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
 * Build account next due date menu
 * @param {object} accountData - User account data
 * @param {string} language - Session language
 * @returns {string} Next due date text
 */
function buildAccountNextDueMenu(accountData, language) {
  const title = 'Your next installment is due:';
  const dueDate = accountData.nextDueDate || '20/01/2025';
  const amount = `Amount: KES ${accountData.nextInstallmentAmount ? accountData.nextInstallmentAmount.toLocaleString() : '4,500'}`;
  
  return `${title}\n${dueDate}\n${amount}\n\n0. Back`;
}

module.exports = { handle, buildAccountNextDueMenu };
