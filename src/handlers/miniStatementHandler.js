/**
 * Mini Statement Handler
 * Handles mini statement display
 */

const { STATES, RESPONSE_TYPES } = require('../constants');
const languageService = require('../languageService');

/**
 * Handle mini statement state
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
 * Build mini statement menu
 * @param {object} loanData - User loan data
 * @param {string} language - Session language
 * @returns {string} Mini statement text
 */
function buildMiniStatementMenu(loanData, language) {
  const title = 'Recent Payments';
  let details = title;
  
  if (loanData.paymentHistory && loanData.paymentHistory.length > 0) {
    loanData.paymentHistory.slice(0, 3).forEach(payment => {
      const date = formatDate(payment.date, 'dd/mm');
      details += `\n${date}: KES ${payment.amount.toLocaleString()}`;
    });
  } else {
    details += '\nNo recent payments found';
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

module.exports = { handle, buildMiniStatementMenu };
