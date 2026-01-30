/**
 * Constants used throughout the USSD application
 */

// Import configuration
const config = require('./config');

// State definitions for the state machine
const STATES = {
  INITIAL: 'INITIAL',
  LANGUAGE_SELECTION: 'LANGUAGE_SELECTION',
  PIN_SETUP: 'PIN_SETUP',
  PIN_CONFIRMATION: 'PIN_CONFIRMATION',
  LOGIN: 'LOGIN',
  WRONG_PIN: 'WRONG_PIN',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  MAIN_MENU: 'MAIN_MENU',
  LOANS_MENU: 'LOANS_MENU',
  LOAN_BALANCE: 'LOAN_BALANCE',
  PAYMENT_BREAKDOWN: 'PAYMENT_BREAKDOWN',
  MINI_STATEMENT: 'MINI_STATEMENT',
  NEXT_DUE_DATE: 'NEXT_DUE_DATE',
  LOAN_DETAILS: 'LOAN_DETAILS',
  ACCOUNT_INFO_MENU: 'ACCOUNT_INFO_MENU',
  ACCOUNT_MINI_STATEMENT: 'ACCOUNT_MINI_STATEMENT',
  REGISTERED_PHONE: 'REGISTERED_PHONE',
  ACCOUNT_NEXT_DUE: 'ACCOUNT_NEXT_DUE',
  ACCOUNT_DETAILS: 'ACCOUNT_DETAILS',
  RECENT_TRANSACTIONS: 'RECENT_TRANSACTIONS'
};

// Response types
const RESPONSE_TYPES = {
  CONTINUE: 'FC', // FreeFlow Continue
  END: 'FB'       // FreeFlow Break (terminate)
};

// Supported languages
const LANGUAGES = {
  ENGLISH: 'en',
  KISWAHILI: 'sw',
  SOMALI: 'so'
};

// Max PIN attempts before account lockout (from config)
const MAX_PIN_ATTEMPTS = config.MAX_PIN_ATTEMPTS;

// Session timeout in milliseconds (from config)
const SESSION_TIMEOUT = config.SESSION_TIMEOUT;

module.exports = {
  STATES,
  RESPONSE_TYPES,
  LANGUAGES,
  MAX_PIN_ATTEMPTS,
  SESSION_TIMEOUT
};
