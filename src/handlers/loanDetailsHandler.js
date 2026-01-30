/**
 * Loan Details Handler
 * Handles detailed loan information views
 */

const { STATES, RESPONSE_TYPES } = require('../constants');
const languageService = require('../languageService');
const { buildMainMenu } = require('./mainMenuHandler');

/**
 * Handle loan details state
 * @param {object} session - Current session
 * @param {string} input - User input
 * @returns {object} Response with message and type
 */
async function handle(session, input) {
  const user = session.customerData;
  const subMenu = session.tempData.subMenu || 'loanDetails';
  
  // Handle back option - return to loans menu
  if (input === '0') {
    session.currentState = STATES.LOANS_MENU;
    return {
      message: buildLoansMenu(user.loan, session.language),
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
  
  // For this simple implementation, any other input returns to loans menu
  session.currentState = STATES.LOANS_MENU;
  return {
    message: buildLoansMenu(user.loan, session.language),
    type: RESPONSE_TYPES.CONTINUE
  };
}

/**
 * Build loans menu message
 * @param {object} loanData - User loan data
 * @param {string} language - Session language
 * @returns {string} Loans menu text
 */
function buildLoansMenu(loanData, language) {
  const title = 'LOAN INFORMATION';
  const status = `Status: ${loanData.status}`;
  const balance = `Balance: UGX ${loanData.balance.toLocaleString()}`;
  
  let details = `${title}\n\n${status}\n${balance}`;
  
  if (loanData.status === 'Active') {
    const nextPayment = `Next Payment: ${formatDate(loanData.nextPaymentDate)}`;
    const monthlyAmount = `Monthly: UGX ${loanData.monthlyAmount.toLocaleString()}`;
    details += `\n${nextPayment}\n${monthlyAmount}`;
  }
  
  const menuOptions = [
    '',
    '0. Back to Main Menu',
    '00. Main Menu'
  ].join('\n');
  
  return `${details}${menuOptions}`;
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

module.exports = { handle };
