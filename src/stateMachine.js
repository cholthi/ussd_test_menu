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
const loansMenuHandler = require('./handlers/loansMenuHandler');
const loanBalanceHandler = require('./handlers/loanBalanceHandler');
const paymentBreakdownHandler = require('./handlers/paymentBreakdownHandler');
const miniStatementHandler = require('./handlers/miniStatementHandler');
const nextDueDateHandler = require('./handlers/nextDueDateHandler');
const accountInfoMenuHandler = require('./handlers/accountInfoMenuHandler');
const accountMiniStatementHandler = require('./handlers/accountMiniStatementHandler');
const registeredPhoneHandler = require('./handlers/registeredPhoneHandler');
const accountNextDueHandler = require('./handlers/accountNextDueHandler');
const loanDetailsHandler = require('./handlers/loanDetailsHandler');
const accountDetailsHandler = require('./handlers/accountDetailsHandler');
const recentTransactionsHandler = require('./handlers/recentTransactionsHandler');

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
        const userData = userRepository.getUser(msisdn);
        session = {
          currentState: STATES.INITIAL,
          sessionId,
          phoneNumber: msisdn,
          previousStates: [],
          customerData: userData,
          language: userData.preferredLanguage || null,
          tempData: {}
        };
        
        session = sessionStore.saveSession(sessionId, session);
      }
      
      // Track previous state for navigation
      const previousState = session.currentState;
      
      // Process input based on current state
      let response;
      
      // Select appropriate handler based on current state 
      switch (session.currentState) {
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
          
        case STATES.LOANS_MENU:
          response = await loansMenuHandler.handle(session, input);
          break;
          
        case STATES.LOAN_BALANCE:
          response = await loanBalanceHandler.handle(session, input);
          break;
          
        case STATES.PAYMENT_BREAKDOWN:
          response = await paymentBreakdownHandler.handle(session, input);
          break;
          
        case STATES.MINI_STATEMENT:
          response = await miniStatementHandler.handle(session, input);
          break;
          
        case STATES.NEXT_DUE_DATE:
          response = await nextDueDateHandler.handle(session, input);
          break;
          
        case STATES.ACCOUNT_INFO_MENU:
          response = await accountInfoMenuHandler.handle(session, input);
          break;
          
        case STATES.ACCOUNT_MINI_STATEMENT:
          response = await accountMiniStatementHandler.handle(session, input);
          break;
          
        case STATES.REGISTERED_PHONE:
          response = await registeredPhoneHandler.handle(session, input);
          break;
          
        case STATES.ACCOUNT_NEXT_DUE:
          response = await accountNextDueHandler.handle(session, input);
          break;
          
        case STATES.LOAN_DETAILS:
          response = await loanDetailsHandler.handle(session, input);
          break;
          
        case STATES.ACCOUNT_DETAILS:
          response = await accountDetailsHandler.handle(session, input);
          break;
          
        case STATES.RECENT_TRANSACTIONS:
          response = await recentTransactionsHandler.handle(session, input);
          break;
          
        default:
          // Invalid state, reset to initial
          session.currentState = STATES.INITIAL;
          response = await initialHandler.handle(session, input);
      }
      
      // If the state changed, add the previous state to history
      if (previousState !== session.currentState && response.type === RESPONSE_TYPES.CONTINUE) {
        session.previousStates.push(previousState);
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
   * Helper method to continue session with a message
   * @param {string} message - Message to display
   * @returns {object} Continue response object
   */
  continueSession(message) {
    return {
      message,
      type: RESPONSE_TYPES.CONTINUE
    };
  }
  
  /**
   * Helper method to end session with a message
   * @param {string} message - Message to display
   * @returns {object} End response object
   */
  endSession(message) {
    return {
      message,
      type: RESPONSE_TYPES.END
    };
  }
  
  /**
   * Handle back navigation
   * @param {object} session - Current session
   * @returns {string} Previous state or fallback
   */
  goBack(session) {
    if (session.previousStates && session.previousStates.length > 0) {
      return session.previousStates.pop();
    }
    return STATES.MAIN_MENU; // Default fallback
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
