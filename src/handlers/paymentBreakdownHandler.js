/**
 * Payment Breakdown Handler
 * Handles payment breakdown display
 */

const { STATES, RESPONSE_TYPES } = require('../constants');
const languageService = require('../languageService');

/**
 * Handle payment breakdown state
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
 * Build payment breakdown menu
 * @param {object} loanData - User loan data
 * @param {string} language - Session language
 * @returns {string} Payment breakdown text
 */
function buildPaymentBreakdownMenu(loanData, language) {
  const title = 'Loan Summary';
  const total = `Total: KES ${loanData.totalLoan.toLocaleString()}`;
  const paid = `Paid: KES ${loanData.paidAmount.toLocaleString()}`;
  const balance = `Balance: KES ${loanData.balance.toLocaleString()}`;
  
  return `${title}\n${total}\n${paid}\n${balance}\n\n0. Back`;
}

module.exports = { handle, buildPaymentBreakdownMenu };
