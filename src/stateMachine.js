/**
 * State Machine for USSD application
 * Handles state transitions and routing to appropriate handlers
 */

const { STATES, RESPONSE_TYPES } = require('./constants');
const sessionStore = require('./sessionStore');
const userRepository = require('./userRepository');
const languageService = require('./languageService');

// Import state handlers
// Perform business logic for the application
const initialHandler = require('./handlers/initialHandler');
const languageHandler = require('./handlers/languageHandler');
const pinSetupHandler = require('./handlers/pinSetupHandler');
const pinConfirmHandler = require('./handlers/pinConfirmHandler');
const loginHandler = require('./handlers/loginHandler');
const wrongPinHandler = require('./handlers/wrongPinHandler');
const accountLockedHandler = require('./handlers/accountLockedHandler');
const mainMenuHandler = require('./handlers/mainMenuHandler');

class StateMachine {
  /**
   * Process USSD request and generate response
   * @param {string} msisdn - Phone number
   * @param {string} input - User input
   * @param {string} sessionId - Unique session identifier
   * @returns {object} Response object with headers and body
   */
  async processRequest(msisdn, input, sessionId) {
    try {
      // Check if user exists
      if (!userRepository.userExists(msisdn)) {
        return this.createResponse(
          languageService.getText('userNotFound'),
          RESPONSE_TYPES.END
        );
      }
      
      // Get or create session
      let session = sessionStore.getSession(sessionId);
      
      // First-time access, create new session
      if (!session) {
        session = {
          sessionId,
          msisdn,
          state: STATES.INITIAL,
          language: userRepository.getLanguage(msisdn) || null,
          tempPin: null,
          contextData: {}
        };
        
        session = sessionStore.saveSession(sessionId, session);
      }
      
      // Process input based on current state
      let response;
      
      // Select appropriate handler based on current state 
      switch (session.state) {
        case STATES.INITIAL:
          response = await initialHandler.handle(session, input);
          break;
          
        case STATES.LANGUAGE_SELECTION:
          response = await languageHandler.handle(session, input);
          break;
          
        case STATES.PIN_SETUP:
          response = await pinSetupHandler.handle(session, input);
          break;
          
        case STATES.PIN_CONFIRMATION:
          response = await pinConfirmHandler.handle(session, input);
          break;
          
        case STATES.LOGIN:
          response = await loginHandler.handle(session, input);
          break;
          
        case STATES.WRONG_PIN:
          response = await wrongPinHandler.handle(session, input);
          break;
          
        case STATES.ACCOUNT_LOCKED:
          response = await accountLockedHandler.handle(session, input);
          break;
          
        case STATES.MAIN_MENU:
          response = await mainMenuHandler.handle(session, input);
          break;
          
        default:
          // Invalid state, reset to initial
          session.state = STATES.INITIAL;
          response = await initialHandler.handle(session, input);
      }
      
      // Save updated session if continuing
      if (response.type === RESPONSE_TYPES.CONTINUE) {
        sessionStore.saveSession(sessionId, session);
      } else {
        // End of session, clear it
        sessionStore.clearSession(sessionId);
      }
      
      return this.createResponse(response.message, response.type);
      
    } catch (error) {
      console.error('State machine error:', error);
      return this.createResponse(
        'An error occurred. Please try again later.',
        RESPONSE_TYPES.END
      );
    }
  }
  
  /**
   * Create formatted response object
   * @param {string} message - Response message
   * @param {string} type - Response type (FC/FB)
   * @returns {object} Response object with headers and body
   */
  createResponse(message, type) {
    return {
      headers: {
        'FreeFlow': type,
        'Content_Type': 'utf-8'
      },
      body: message
    };
  }
}

// Export singleton instance
module.exports = new StateMachine();
