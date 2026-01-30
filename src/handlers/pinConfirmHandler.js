/**
 * PIN Confirmation Handler
 * Handles PIN confirmation state
 */

const { STATES, RESPONSE_TYPES } = require('../constants');
const userRepository = require('../userRepository');
const languageService = require('../languageService');

/**
 * Handle PIN confirmation state
 * @param {object} session - Current session
 * @param {string} input - User input
 * @returns {object} Response with message and type
 */
async function handle(session, input) {
  // Handle back option
  if (input === '0') {
    session.currentState = STATES.PIN_SETUP;
    return {
      message: languageService.getText('pinSetupPrompt', session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  // Validate PIN format (4 digits)
  if (!input || input.length !== 4 || !/^\d{4}$/.test(input)) {
    return {
      message: languageService.getText('invalidPin', session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  // Check if PINs match
  if (input !== session.tempData.tempPin) {
    // PINs don't match, go back to PIN setup
    session.currentState = STATES.PIN_SETUP;
    session.tempData.tempPin = null; // Clear temp PIN
    
    return {
      message: languageService.getText('pinMismatch', session.language),
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  // PINs match, save PIN
  const success = userRepository.setPin(session.phoneNumber, input);
  
  if (!success) {
    return {
      message: languageService.getText('pinSetupFailed', session.language),
      type: RESPONSE_TYPES.END
    };
  }
  
  // Update customer data in session
  if (session.customerData) {
    session.customerData.pin = input;
    session.customerData.hasPin = true;
  }
  
  // Clear temporary PIN data
  session.tempData.tempPin = null;
  
  // PIN setup successful, go to main menu
  session.currentState = STATES.MAIN_MENU;
  
  // Get user data and build main menu
  const { buildMainMenu } = require('./mainMenuHandler');
  const user = session.customerData;
  const successMessage = languageService.getText('pinSetupSuccess', session.language);
  const mainMenu = buildMainMenu(user, session.language);
  
  return {
    message: `${successMessage}\n\n${mainMenu}`,
    type: RESPONSE_TYPES.CONTINUE
  };
}

module.exports = { handle };
