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
  MAIN_MENU: 'MAIN_MENU'
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
