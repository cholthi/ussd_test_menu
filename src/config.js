/**
 * Configuration module for USSD application
 * Loads and provides access to environment variables
 */

// Load environment variables from .env file
require('dotenv').config();

// Server configuration
const PORT = process.env.PORT || 8090;
const USSD_CODE = process.env.USSD_CODE || '*183#';

// Session configuration
const SESSION_TIMEOUT = parseInt(process.env.SESSION_TIMEOUT || 300000, 10); // Default: 5 minutes

// Security configuration
const MAX_PIN_ATTEMPTS = parseInt(process.env.MAX_PIN_ATTEMPTS || 3, 10);

// Default language
const DEFAULT_LANGUAGE = process.env.DEFAULT_LANGUAGE || 'en';

module.exports = {
  PORT,
  USSD_CODE,
  SESSION_TIMEOUT,
  MAX_PIN_ATTEMPTS,
  DEFAULT_LANGUAGE
};
