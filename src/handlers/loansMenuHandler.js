/**
 * Loans Menu Handler
 * Handles navigation within the loans submenu
 */

const { STATES, RESPONSE_TYPES } = require('../constants');
const languageService = require('../languageService');
const { buildMainMenu } = require('./mainMenuHandler');

/**
 * Handle loans menu state
 * @param {object} session - Current session
 * @param {string} input - User input
 * @returns {object} Response with message and type
 */
async function handle(session, input) {
  const user = session.customerData;
  
  // Handle back option - return to main menu
  if (input === '0') {
    session.currentState = STATES.MAIN_MENU;
    return {
      message: buildMainMenu(user, session.language),
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
  
  if (input === '1') {
    // Loan Balance selected
    session.currentState = STATES.LOAN_BALANCE;
    const { buildLoanBalanceMenu } = require('./loanBalanceHandler');
    return {
      message: buildLoanBalanceMenu(user.loan, session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  if (input === '2') {
    // Payment Breakdown selected
    session.currentState = STATES.PAYMENT_BREAKDOWN;
    const { buildPaymentBreakdownMenu } = require('./paymentBreakdownHandler');
    return {
      message: buildPaymentBreakdownMenu(user.loan, session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  if (input === '3') {
    // Mini Statement selected
    session.currentState = STATES.MINI_STATEMENT;
    const { buildMiniStatementMenu } = require('./miniStatementHandler');
    return {
      message: buildMiniStatementMenu(user.loan, session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  if (input === '4') {
    // Next Due Date selected
    session.currentState = STATES.NEXT_DUE_DATE;
    const { buildNextDueDateMenu } = require('./nextDueDateHandler');
    return {
      message: buildNextDueDateMenu(user.loan, session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  // Invalid option - show loans menu again
  const user_loan = user.loan;
  return {
    message: `${languageService.getText('invalidOption', session.language)}\n\n${buildLoansMenu(user_loan, session.language)}`,
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
  const title = 'Loan Menu';
  
  const menuOptions = [
    '',
    '1. Loan Balance',
    '2. Payment Breakdown', 
    '3. Mini Statement',
    '4. Next Due Date',
    '',
    '0. Back'
  ].join('\n');
  
  return `${title}${menuOptions}`;
}


// Utility functions moved to individual handlers

module.exports = { handle, buildLoansMenu };
