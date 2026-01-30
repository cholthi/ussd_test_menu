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
  const user = userRepository.getUser(session.msisdn);
  
  // Check if account is locked
  if (userRepository.isAccountLocked(session.msisdn)) {
    session.state = STATES.ACCOUNT_LOCKED;
    
    return {
      message: languageService.getText('accountLocked', session.language),
      type: RESPONSE_TYPES.END
    };
  }
  
  // Validate PIN
  if (!userRepository.verifyPin(session.msisdn, input)) {
    // Increment attempts
    const attempts = userRepository.incrementAttempts(session.msisdn);
    
    // Check if max attempts reached
    if (attempts >= MAX_PIN_ATTEMPTS) {
      // Lock account
      userRepository.lockAccount(session.msisdn);
      session.state = STATES.ACCOUNT_LOCKED;
      
      return {
        message: languageService.getText('accountLocked', session.language),
        type: RESPONSE_TYPES.END
      };
    }
    
    // Move to wrong PIN state
    session.state = STATES.WRONG_PIN;
    
    // Calculate attempts left
    const attemptsLeft = MAX_PIN_ATTEMPTS - attempts;
    
    return {
      message: `${languageService.getText('wrongPin', session.language)}\n${languageService.getText('attemptsLeft', session.language, { attempts: attemptsLeft })}`,
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  // PIN correct, reset attempts
  userRepository.resetAttempts(session.msisdn);
  
  // Move to main menu
  session.state = STATES.MAIN_MENU;
  
  // Success message
  const loginSuccessMsg = languageService.getText('loginSuccess', session.language);
  const logoutOption = languageService.getText('logoutOption', session.language);
  
  return {
    message: `${loginSuccessMsg}\n\n${logoutOption}`,
    type: RESPONSE_TYPES.CONTINUE
  };
}

module.exports = { handle };
