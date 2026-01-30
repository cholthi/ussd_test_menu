/**
 * Account Info Menu Handler
 * Handles navigation within the account info submenu
 */

const { STATES, RESPONSE_TYPES } = require('../constants');
const languageService = require('../languageService');
const { buildMainMenu } = require('./mainMenuHandler');

/**
 * Handle account info menu state
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
    // Account Mini Statement selected
    session.currentState = STATES.ACCOUNT_MINI_STATEMENT;
    const { buildAccountMiniStatementMenu } = require('./accountMiniStatementHandler');
    return {
      message: buildAccountMiniStatementMenu(user.account, session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  if (input === '2') {
    // Registered Phone selected
    session.currentState = STATES.REGISTERED_PHONE;
    const { buildRegisteredPhoneMenu } = require('./registeredPhoneHandler');
    return {
      message: buildRegisteredPhoneMenu(user.account, session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  if (input === '3') {
    // Account Next Due Date selected
    session.currentState = STATES.ACCOUNT_NEXT_DUE;
    const { buildAccountNextDueMenu } = require('./accountNextDueHandler');
    return {
      message: buildAccountNextDueMenu(user.account, session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  // Invalid option - show account info menu again
  return {
    message: `${languageService.getText('invalidOption', session.language)}\n\n${buildAccountInfoMenu(user.account, session.language)}`,
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
  const title = 'Account Info';
  
  const menuOptions = [
    '',
    '1. Mini Statement',
    '2. Registered Phone',
    '3. Next Due Date',
    '',
    '0. Back'
  ].join('\n');
  
  return `${title}${menuOptions}`;
}

/**
 * Build recent transactions menu
 * @param {object} accountData - User account data
 * @param {string} language - Session language
 * @returns {string} Recent transactions text
 */
function buildRecentTransactionsMenu(accountData, language) {
  const title = 'RECENT TRANSACTIONS';
  
  let details = `${title}\n\nAccount: ${accountData.accountNumber}\nCurrent Balance: UGX ${accountData.balance.toLocaleString()}`;
  
  if (accountData.transactions && accountData.transactions.length > 0) {
    details += '\n\nRecent Activity:';
    accountData.transactions.slice(0, 4).forEach(txn => {
      const amount = txn.amount >= 0 ? `+${txn.amount.toLocaleString()}` : txn.amount.toLocaleString();
      details += `\n${formatDate(txn.date)}: ${txn.type} ${amount}`;
    });
  }
  
  return `${details}\n\n0. Back to Account Menu\n00. Main Menu`;
}

/**
 * Build account details menu
 * @param {object} accountData - User account data
 * @param {string} language - Session language
 * @returns {string} Account details text
 */
function buildAccountDetailsMenu(accountData, language) {
  const title = 'ACCOUNT DETAILS';
  
  const details = `${title}\n\nAccount Number: ${accountData.accountNumber}\nAccount Type: ${accountData.accountType}\nCurrent Balance: UGX ${accountData.balance.toLocaleString()}`;
  
  // Add transaction summary
  if (accountData.transactions && accountData.transactions.length > 0) {
    const totalTransactions = accountData.transactions.length;
    const recentTxn = accountData.transactions[0];
    details += `\n\nTransaction Summary:\nTotal Transactions: ${totalTransactions}\nLast Transaction: ${formatDate(recentTxn.date)}`;
  }
  
  return `${details}\n\n0. Back to Account Menu\n00. Main Menu`;
}

/**
 * Format date for display
 * @param {string} dateString - Date to format
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

module.exports = { handle, buildAccountInfoMenu };
