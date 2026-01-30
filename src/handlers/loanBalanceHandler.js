/**
 * Loan Balance Handler
 * Handles loan balance display
 */

const { STATES, RESPONSE_TYPES } = require('../constants');
const languageService = require('../languageService');

/**
 * Handle loan balance state
 * @param {object} session - Current session
 * @param {string} input - User input
 * @returns {object} Response with message and type
 */
async function handle(session, input) {
  const user = session.customerData;
  
  // Handle back option - return to loans menu
  if (input === '0') {
    session.currentState = STATES.LOANS_MENU;
    const { buildLoansMenu } = require('./loansMenuHandler');
    return {
      message: buildLoansMenu(user.loan, session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  // Any other input returns to loans menu
  session.currentState = STATES.LOANS_MENU;
  const { buildLoansMenu } = require('./loansMenuHandler');
  return {
    message: buildLoansMenu(user.loan, session.language),
    type: RESPONSE_TYPES.CONTINUE
  };
}

/**
 * Build loan balance menu
 * @param {object} loanData - User loan data
 * @param {string} language - Session language
 * @returns {string} Loan balance text
 */
function buildLoanBalanceMenu(loanData, language) {
  const title = 'Loan Balance';
  const balance = `Your loan balance is:\nKES ${loanData.balance.toLocaleString()}`;
  
  return `${title}\n${balance}\n\n0. Back`;
}

module.exports = { handle, buildLoanBalanceMenu };
