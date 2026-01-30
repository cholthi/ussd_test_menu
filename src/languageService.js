/**
 * Language Service for USSD application
 * Handles translations for multi-language support
 */

const { LANGUAGES } = require('./constants');

// Translation dictionary
const translations = {
  // English translations
  [LANGUAGES.ENGLISH]: {
    welcome: 'Welcome to Demo USSD',
    languagePrompt: 'Please select your language:',
    languageOptions: '1. Kiswahili\n2. English\n3. Somali',
    invalidOption: 'Invalid option. Please try again.',
    pinSetupPrompt: 'Please set your 4-digit PIN:',
    invalidPin: 'PIN must be 4 digits. Please try again.',
    pinConfirmPrompt: 'Please confirm your PIN:',
    pinMismatch: 'PINs do not match. Please try again.',
    pinSuccess: 'PIN set successfully!',
    loginPrompt: 'Please enter your PIN:',
    loginSuccess: 'You are now logged in.',
    wrongPin: 'Wrong PIN. Please try again.',
    attemptsLeft: 'Attempts left: {attempts}',
    accountLocked: 'Your account has been locked due to multiple failed attempts.\nPlease contact customer support.',
    logoutOption: '1. Logout',
    userNotFound: 'User not found. Please contact customer support.',
    goodbye: 'Thank you for using our service. Goodbye!'
  },
  
  // Kiswahili translations
  [LANGUAGES.KISWAHILI]: {
    welcome: 'Karibu kwenye USSD ya Majaribio',
    languagePrompt: 'Tafadhali chagua lugha yako:',
    languageOptions: '1. Kiswahili\n2. English\n3. Somali',
    invalidOption: 'Chaguo si sahihi. Tafadhali jaribu tena.',
    pinSetupPrompt: 'Tafadhali weka PIN yako ya tarakimu 4:',
    invalidPin: 'PIN lazima iwe na tarakimu 4. Tafadhali jaribu tena.',
    pinConfirmPrompt: 'Tafadhali thibitisha PIN yako:',
    pinMismatch: 'PIN hazifanani. Tafadhali jaribu tena.',
    pinSuccess: 'PIN imewekwa kwa mafanikio!',
    loginPrompt: 'Tafadhali ingiza PIN yako:',
    loginSuccess: 'Umeingia kwa mafanikio.',
    wrongPin: 'PIN si sahihi. Tafadhali jaribu tena.',
    attemptsLeft: 'Majaribio yaliyosalia: {attempts}',
    accountLocked: 'Akaunti yako imefungwa kwa sababu ya majaribio mengi yasiyofaulu.\nTafadhali wasiliana na huduma kwa wateja.',
    logoutOption: '1. Ondoka',
    userNotFound: 'Mtumiaji hajapatikana. Tafadhali wasiliana na huduma kwa wateja.',
    goodbye: 'Asante kwa kutumia huduma zetu. Kwaheri!'
  },
  
  // Somali translations
  [LANGUAGES.SOMALI]: {
    welcome: 'Ku soo dhowow USSD Tijaabo',
    languagePrompt: 'Fadlan dooro luuqadaada:',
    languageOptions: '1. Kiswahili\n2. English\n3. Somali',
    invalidOption: 'Doorasho khaldan. Fadlan isku day mar kale.',
    pinSetupPrompt: 'Fadlan gali PIN-kaaga 4-dhigaal ah:',
    invalidPin: 'PIN waa inuu ahaadaa 4 dhigaal. Fadlan isku day mar kale.',
    pinConfirmPrompt: 'Fadlan xaqiiji PIN-kaaga:',
    pinMismatch: 'PIN-yadu iskuma haboona. Fadlan isku day mar kale.',
    pinSuccess: 'PIN si guul leh ayaa loo dejiyay!',
    loginPrompt: 'Fadlan gali PIN-kaaga:',
    loginSuccess: 'Waxaad si guul leh u soo gashay.',
    wrongPin: 'PIN khaldan. Fadlan isku day mar kale.',
    attemptsLeft: 'Isku dayo hadhay: {attempts}',
    accountLocked: 'Akoonkaaga waxaa la xidhay kadib isku dayo badan oo aan guuleysan.\nFadlan la xidhiidh adeegga macaamiisha.',
    logoutOption: '1. Ka bax',
    userNotFound: 'Isticmaalaha lama helin. Fadlan la xidhiidh adeegga macaamiisha.',
    goodbye: 'Waad ku mahadsan tahay isticmaalka adeegyadayada. Nabadeey!'
  }
};

class LanguageService {
  /**
   * Get translation for a specific key
   * @param {string} key - Translation key
   * @param {string} language - Language code (en, sw, so)
   * @param {object} params - Optional parameters for string interpolation
   * @returns {string} Translated text
   */
  getText(key, language = LANGUAGES.ENGLISH, params = {}) {
    // Default to English if language not supported
    const langDict = translations[language] || translations[LANGUAGES.ENGLISH];
    
    // Get text by key or return key if not found
    let text = langDict[key] || key;
    
    // Replace parameters in text if any
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
  }
  
  /**
   * Get language name from language code
   * @param {string} languageCode - Language code
   * @returns {string} Language name
   */
  getLanguageName(languageCode) {
    const names = {
      [LANGUAGES.ENGLISH]: 'English',
      [LANGUAGES.KISWAHILI]: 'Kiswahili',
      [LANGUAGES.SOMALI]: 'Somali'
    };
    
    return names[languageCode] || 'Unknown';
  }
  
  /**
   * Get language code from menu selection
   * @param {string} selection - User input (1, 2, or 3)
   * @returns {string|null} Language code or null if invalid
   */
  getLanguageFromSelection(selection) {
    const mapping = {
      '1': LANGUAGES.KISWAHILI,
      '2': LANGUAGES.ENGLISH,
      '3': LANGUAGES.SOMALI
    };
    
    return mapping[selection] || null;
  }
}

// Export singleton instance
module.exports = new LanguageService();
