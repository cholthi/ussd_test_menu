/**
 * Login Handler
 * Handles login state
 */

const { STATES, RESPONSE_TYPES, MAX_PIN_ATTEMPTS } = require('../constants');
const userRepository = require('../userRepository');
const languageService = require('../languageService');

/**
 * Handle login state
 * @param {object} session - Current session
 * @param {string} input - User input
 * @returns {object} Response with message and type
 */
async function handle(session, input) {
  const user = userRepository.getUser(session.phoneNumber);
  
  // Check if account is locked
  if (userRepository.isAccountLocked(session.phoneNumber)) {
    session.currentState = STATES.ACCOUNT_LOCKED;
    
    return {
      message: languageService.getText('accountLocked', session.language),
      type: RESPONSE_TYPES.END
    };
  }
  
  // Handle back option
  if (input === '0') {
    if (session.previousStates && session.previousStates.length > 0) {
      session.currentState = session.previousStates.pop();
      // Return appropriate message based on previous state
      return {
        message: languageService.getText('languageSelection'),
        type: RESPONSE_TYPES.CONTINUE
      };
    }
  }
  
  // Validate PIN format (4 digits)
  if (!input || input.length !== 4 || !/^\d{4}$/.test(input)) {
    return {
      message: languageService.getText('invalidPin', session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  // Verify PIN
  if (!userRepository.verifyPin(session.phoneNumber, input)) {
    const attempts = userRepository.incrementAttempts(session.phoneNumber);
    
    if (attempts >= MAX_PIN_ATTEMPTS) {
      userRepository.lockAccount(session.phoneNumber);
      session.currentState = STATES.ACCOUNT_LOCKED;
      
      return {
        message: languageService.getText('accountLocked', session.language),
        type: RESPONSE_TYPES.END
      };
    }
    
    session.currentState = STATES.WRONG_PIN;
    const attemptsLeft = MAX_PIN_ATTEMPTS - attempts;
    
    return {
      message: `${languageService.getText('wrongPin', session.language)}\n${languageService.getText('attemptsLeft', session.language, { attempts: attemptsLeft })}`,
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  // PIN is correct, reset attempts
  userRepository.resetAttempts(session.phoneNumber);
  
  // Login successful, go to main menu
  session.currentState = STATES.MAIN_MENU;
  
  // Use the proper buildMainMenu function for consistency
  const { buildMainMenu } = require('./mainMenuHandler');
  
  return {
    message: buildMainMenu(session.customerData, session.language),
    type: RESPONSE_TYPES.CONTINUE
  };
}

module.exports = { handle };
