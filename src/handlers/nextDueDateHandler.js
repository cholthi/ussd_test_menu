/**
 * Next Due Date Handler
 * Handles next due date display
 */

const { STATES, RESPONSE_TYPES } = require('../constants');
const languageService = require('../languageService');

/**
 * Handle next due date state
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
 * Build next due date menu
 * @param {object} loanData - User loan data
 * @param {string} language - Session language
 * @returns {string} Next due date text
 */
function buildNextDueDateMenu(loanData, language) {
  const title = 'Next payment due:';
  const amount = `KES ${loanData.monthlyAmount.toLocaleString()}`;
  const date = `Date: ${formatDate(loanData.nextPaymentDate, 'dd/mm/yyyy')}`;
  
  return `${title}\n${amount}\n${date}\n\n0. Back`;
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

module.exports = { handle, buildNextDueDateMenu };
